//© Thim Högberg 2018

//intro
$('#divSchema').hide();
$('#intro').show();

if(localStorage.getItem('name1') !== null) {
  $('#firstInput').val(localStorage.getItem('name1').substr(0, localStorage.getItem('name1').indexOf(' ')));
  $('#lastInput').val(localStorage.getItem('name1').substr(localStorage.getItem('name1').indexOf(' ')+1));
  // setTimeout( function() {
  //     doEverything();
  // }, 1);
  $(document).ready(function(){
    doEverything();
  });
}

$('#introBtn').click(function() {
  getInfo();
});

$('#lastInput').keypress(function(e) {
    if(e.which == 13) {
      getInfo();
    }
});

function getInfo() {
  var firstName = $('#firstInput').val();
  var lastName = $('#lastInput').val();

  if (firstName == '' && lastName == '') {
    $('#welcome').text('Du glömde för och efternamn!').css('color', 'red');
  } else if (firstName == '') {
    $('#welcome').text('Du glömde förnamn!!!1!').css('color', 'red');
  } else if (lastName == '') {
    $('#welcome').text('Du glömde efternamn!').css('color', 'red');
  } else {
    firstName = firstName.substr(0,1).toUpperCase()+firstName.substr(1);
    lastName = lastName.substr(0,1).toUpperCase()+lastName.substr(1);

    var originalFirstName = firstName;
    var originalLastName = lastName;

    firstName = firstName.replace('å', '&#229;');
    lastName = lastName.replace('å', '&#229;');
    firstName = firstName.replace('ä', '&#228;');
    lastName = lastName.replace('ä', '&#228;');
    firstName = firstName.replace('ö', '&#246;');
    lastName = lastName.replace('ö', '&#246;');
    firstName = firstName.replace('Å', '&#197;');
    lastName = lastName.replace('Å', '&#197;');
    firstName = firstName.replace('Ä', '&#196;');
    lastName = lastName.replace('Ä', '&#196;');
    firstName = firstName.replace('Ö', '&#214;');
    lastName = lastName.replace('Ö', '&#214;');
    firstName = firstName.replace('é', '&#233;');
    lastName = lastName.replace('é', '&#233;');
    firstName = firstName.replace('ü', '&#252;');
    lastName = lastName.replace('ü', '&#252;');

    var name = (lastName + ', ' + firstName);

    var req = new XMLHttpRequest();
    req.open('POST', 'http://178.62.210.139/', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify({name: name}));
    req.addEventListener('load', function() {
      var requestedId = (JSON.parse(req.responseText)).requestedId;
      requestedId = requestedId.substring(requestedId.indexOf('{')+1, requestedId.indexOf('}'));

      if (requestedId !== '') {
        localStorage.setItem('1', requestedId);
        localStorage.setItem('name1', originalFirstName+' '+originalLastName);

        doEverything();
      } else {
        $('#welcome').text('Hittade inte ditt schema :-( Kolla stavning och internetanslutning! OBS: Skriv ut ev. flera efternamn & áccéntér.').css({'color': 'red', 'font-size': '16px'});
      }
    });
  }
}

function doEverything() {
  localStorage.setItem('current', localStorage.getItem('1'));

  $('#intro').delay(500).slideUp();
  $('#divSchema').delay(750).fadeIn(250);

  var nameArr =[];
  for (var i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i).substr(0, 4) == 'name') {
      nameArr.push(localStorage.key(i));
    }
  }

  for (var i = 1; i <= nameArr.length; i++) {
    var name = localStorage.getItem('name'+i);
    var lastName = name.substr(name.indexOf(' ')+1);
    $('.barUl').append('<li class="barLi" id="'+i+'barLi"><p>' + name.substr(0,1) + lastName.substr(0,1) + '</p></li>');
    $('#schemanUl').append('<li class="schemanLi" id="'+i+'schemanLi">'+name+'<span class="meSign">&nbsp;JAG</span><span class="goldMemberSign">&nbsp;GOLD MEMBER</span></li>');
  }

  if (nameArr.length > 1) {
    $('#1barLi').find('p').css('color', 'red');
  }
  restart();

  // if((localStorage.length-1)/2 < $('.barLi').length) {
  //   location.reload();
  //   console.log('Y u max the submit btn?');
  // }

  var nameArr =[];
  for (var i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i).substr(0, 4) == 'name') {
      nameArr.push(localStorage.key(i));
    }
  }

  if (nameArr.length < $('.barLi').length) {
    $('#divSchema .barName').text('Uppdaterar...');
    location.reload();
  }

  //reloadiframes först eftersom resten hämtar från DOM
  reloadIframes();
  $.when($.ajax(appendWeeks())).then(setWeek());
  $.when($.ajax(setWeek())).then(modalRestart());

  addRemoveBtn();
  setColor();

  gold();
  meSign();
}

//current och googles sparas i ls
if(localStorage.length > 2) {
  $('#welcome').text('Välkommen tillbaka!');
}

if (localStorage.length < 3) {
  $('#disclaimer').append('<p>Rudebecks.me är fristående från Rudebecks.se, ingen data är följaktligen hämtad från skolans hemsida.</p>');
  $('#disclaimerCreator').append('<p>Thim Högberg</p> <p>hogberg.thim@gmail.com</p>')
}

//mainpage
var today = new Date();
var todayDay = today.getDay();

if (today.getMonth()>6) {var termin='Ht'} else {termin='Vt'};

Date.prototype.getWeek = function() {
  var onejan = new Date(this.getFullYear(),0,1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
}

var iframeWeek = today.getWeek();

if (termin == 'Ht') { var lastDay = new Date(today.getYear(), 11, 31) } else { var lastDay = new Date(today.getYear(), 5, 24) };


if (today.getDay() == 6 || today.getDay() == 0) {
  todayDay = 1;
  $('#divSchema .barName').text('HELG HELG HELG');
  $('#divSchema .barName').hide();
  $('#divSchema .barName').delay(1500).fadeIn().delay(2000).fadeOut();
  setTimeout( function() {
    $('#divSchema .barName').hide();
    $('#divSchema .barName').text('Nästa veckas schema');
    $('#divSchema .barName').fadeIn();
  }, 4500);
}

if(localStorage.getItem('name2') == null && today.getDay() !== 6 && today.getDay() !== 0) {
  $('#divSchema .barName').text('Lägg till fler scheman →');
  $('#divSchema .barName').hide();
  $('#divSchema .barName').delay(1500).fadeIn().delay(2000).fadeOut();
  setTimeout( function() {
    $('#divSchema .barName').hide();
    $('#divSchema .barName').text('rudebecks.me');
    $('#divSchema .barName').fadeIn();
  }, 4500);
}

function restart() {
  $('.barLi').on('click', function() {

    if ($('.barLi').length > 1) {
      var barLiId = this.id.substr(0,1);
      var id = localStorage.getItem(barLiId);
      var currentId = localStorage.getItem('current');
      localStorage.setItem('current', id);
      function changeEachId() {
        $('.iframeSchema').each(function() {
          $(this).attr('src', $(this).attr('src').replace(currentId, id));
        });
      }
      changeEachId();
      $(this).siblings().find('p').css('color', 'grey');
      $('.gold').find('p').css('color', '#D4AF37');
      $(this).find('p').css('color', 'red');
    }

    $('#timeLine, #timeBall').stop(true).fadeIn().delay(2500).fadeOut();
    $('#timeStamp').stop(true).fadeIn().delay(2500).fadeOut();
  });
};

//vecka
function setWeek() {
  $('#weekNo').empty();
  var weekNo = $('#dmon1').attr('src').substring($('#dmon1').attr('src').indexOf('week=')+5, $('#dmon1').attr('src').indexOf('&foot'));
  $('#weekNo').append(weekNo);
  $('.weekModalLi').css('color', 'white');
  $('.modalLiWeek').css('font-weight', 'normal');
  $('#'+ weekNo).css('color', 'red');
  $('#'+ weekNo + ' .modalLiWeek').css('font-weight', 'bold');
}

function appendWeeks() {
  var weekNo = $('#dmon1').attr('src').substring($('#dmon1').attr('src').indexOf('week=')+5, $('#dmon1').attr('src').indexOf('&foot'));
  for (var i = parseInt(weekNo); i < lastDay.getWeek()-1; i++) {
    $('.weekModal ul').append('<li class="weekModalLi" id='+i+'><p><span class="modalLiWeek">Vecka </span><span class="modalLiNo">'+i+'</span></p></li>');
  }
}

function modalRestart() {
  $('.weekModalLi').click(function() {
    $('.iframeSchema').fadeOut(100);
    var week = this.id;

    $('.iframeSchema').each(function() {
      var iframeUrl = $(this).attr('src');
      var weekEW = iframeUrl.substring(iframeUrl.indexOf('week='), iframeUrl.indexOf('&foot'));
      $(this).attr('src', iframeUrl.replace(weekEW, 'week='+week));
    });
    setWeek();
    scheduleWNewW();
    $('.weekModal').slideUp(200);
    $('#weekArrow').css('color', 'white');

if(week !== iframeWeek) {
      $('#timeLine, #timeBall, #timeStamp').hide();
      $('#divSchema .barName').hide();
      $('#divSchema .barName').text('Schema v.' + week);
      $('#divSchema .barName').delay(500).fadeIn();
    }

    if(week == iframeWeek) {
      showTime();
       if (today.getDay() == 6 || today.getDay() == 0) {
        $('#divSchema .barName').text('Nästa veckas schema');
      } else {
        $('#divSchema .barName').text('rudebecks.me');
      }
    }
 })
}

modalRestart();

function scheduleWNewW() {
  setTimeout( function() {
    $('.swiper-pagination').css('z-index', '2');
  }, 200);
  $('.iframeSchema').fadeIn(100);
}

$('.weekBtn').click(function() {
  if($('.weekModal').css('display') == 'none') {
    $('.swiper-pagination').css('z-index', '0');
    $('#weekArrow').css('color', '#bfbfbf');
  } else {
    setTimeout( function() {
      $('.swiper-pagination').css('z-index', '2');
      $('#weekArrow').css('color', 'white');
    }, 200);
  }
  $('.weekModal').stop(true).slideToggle(200);
})

$('#reloadBtn').click(function() {
  $('#divSchema .barName').text('Laddar om...');
  location.reload();
})

//matmatmatviktigtbra
var foodObj = new Object();

function getFood(callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.status);

      var foodArr = Object.values(JSON.parse(this.responseText));

      if (today.getDay() !== 6 && today.getDay() !== 0 && today.getDay() !== 5) {
        $('#matUlDagens').append('<li class="matLi">'+ foodArr[0]+'</li>');
        for (var i = 1; i < (5+1 - todayDay); i++) {
          $('#matUlResterande').append('<li class="matLi"><span class="matSpan">'+ foodArr[i] +'</span></li>');
        }
        for (var i = (5+1 - todayDay); i < foodArr.length; i++) {
          $('#matUlNästa').append('<li class="matLi"><span class="matSpan">'+ foodArr[i] +'</span></li>');
        }
      } else if (today.getDay() == 5) {
        $('#matUlDagens').append('<li class="matLi">'+ foodArr[0]+'</li>');
        $('#matUlNästa').append('<li class="matLi"><span class="matSpan">'+ foodArr[i] +'</span></li>');

      } else if (today.getDay() == 6 || today.getDay() == 0){
        for (var i = 0; i < foodArr.length; i++) {
          $('#matUlNästa').append('<li class="matLi"><span class="matSpan">'+ foodArr[i] +'</span></li>');
        }

      }
      setFoodDays();
      // $(document).ready(function() {
      //   setTimeout(function() {
      //     refineAds();
      //   }, 1000)
      // })
    }
  };
  // NOTE: NOTE NOTE
  xhttp.open("GET", "http://178.62.210.139/mat", true);
  xhttp.send();
}

$('.whyTho').click(function() {
  alert('Eftersom det kostar pengar att driva rudebecks.me (750kr/år) kan man som användare stötta hemsidan genom en donation. Som tack blir man då tilldelad den enormt prestigefyllda titeln GOLD MEMBER (pls swisha)');
})

getFood();

var dayArr = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre'];

function setFoodDays() {
  for (var i = 0; i < $('#matUlResterande .matLi').length; i++) {
    if (today.getDay() !== 6 && today.getDay() !== 0) {
      var day = (todayDay + i);
    } else {
      var day = i;
    }
    $('#matUlResterande .matLi:nth-child('+(i + 2)+')').prepend('<span class="matDagSpan">'+dayArr[day]+'</span>');
  }
  //varför 2 - a million dollar question
  for (var i = 2; i < ($('#matUlNästa .matLi').length + 2); i++) {
    $('#matUlNästa .matLi:nth-child('+i+')').prepend('<span class="matDagSpan">'+dayArr[i-2]+'</span>');
  }

  if ($('#matUlDagens .matLi').length < 1) {
    $('#matUlDagens').hide();
  }
  if ($('#matUlResterande .matLi').length == 1) {
    $('#matUlResterande li:first-child').text('Imorgon serveras:');
  }
  if ($('#matUlDagens .matLi').length < 0 && $('#matUlResterande .matLi').length < 0 && $('#matUlNästa .matLi').length < 1) {
    $('#matUlResterande').append('<li class="matLi">Inget att visa</li>');
  }
  if ($('#matUlResterande .matLi').length < 1) {
    $('#matUlResterande').hide();
  }
  if ($('#matUlNästa .matLi').length < 1) {
    $('#matUlNästa').hide();
  }
}

// function refineAds() {
//   if ($('#matUlDagens .matLi').length > 0 && $('#matUlResterande .matLi').length > 0) {
//     var heightOfListItems = $('#matUlDagens').innerHeight() + $('#matUlResterande').innerHeight();
//   } else if ($('#matUlDagens .matLi').length > 0 && $('#matUlResterande .matLi').length == 0 ) {
//     var heightOfListItems = $('#matUlDagens').innerHeight();
//   } else {
//     var heightOfListItems = $('#matUlResterande').innerHeight() - 25;
//   }
//   //sista 10:an - blir snyggare
//   console.log(heightOfListItems);
//   var margins = (10 + 33 + 10 + 5 + 10);
//   var bars = (60 + 50)
//   var height = $('body').height() - (heightOfListItems + margins + bars);
//
//   if (height < 250) {
//     $('#matAdBig').hide();
//     $('#matAdSmall').show();
//     $('#matAdDiv').css('height', '100px');
//   }
// }


//settings
$('.settingsBtn').click(function() {
  $('#settings').stop(true).slideToggle();
  $('#divSchema').stop(true).slideToggle();
})

$('#goBack').click(function() {
  $('#settings').stop(true).slideToggle();
  $('#addScheduleModal').slideUp();
  $('#colorInput').slideUp();
  $('.removeSchedule').slideUp();
  $('#divSchema').stop(true).slideToggle();
  $('#creator').slideDown();
})

$('#addSchedule').click(function() {
  $('#colorInput').slideUp(150);
  $('#addScheduleModal').stop(true).slideToggle(150);
  $('#schemeInputFirst').focus();
  $('#creator').stop(true).slideToggle();
})

$('#scheduleModalBtn').click(function() {
  addSchedule();
})

$('#schemeInputLast').keypress(function(e) {
  if(e.which == 13) {
    addSchedule();
  }
});

$('#capitalizeCheckbox').change(function() {
  if($('#capitalizeCheckbox').is(':checked')) {
    $('#addScheduleModal input').css('text-transform', 'none');
    $('#schemeInputFirst').attr('placeholder', 'förnamn');
    $('#schemeInputLast').attr('placeholder', 'efternamn');
    $('#schemeInputFirst').focus();
  } else {
    $('#addScheduleModal input').css('text-transform', 'capitalize');
    $('#schemeInputFirst').focus();
  }
});

//ADD ANOTHER SCHEDULE
function addSchedule() {
  var firstName = $('#schemeInputFirst').val();
  var lastName = $('#schemeInputLast').val();

  if (firstName == '' && lastName == '') {
    alert('Du glömde för och efternamn!');
  } else if (firstName == '') {
    alert('Du glömde förnamn!1!');
  } else if (lastName == '') {
    alert('Du glömde efternamn!');
  } else {
    if ($('#capitalizeCheckbox').is(':checked') == false) {
      firstName = firstName.substr(0,1).toUpperCase()+firstName.substr(1);
      lastName = lastName.substr(0,1).toUpperCase()+lastName.substr(1);
    }

    var originalFirstName = firstName;
    var originalLastName = lastName;

    firstName = firstName.replace('å', '&#229;');
    lastName = lastName.replace('å', '&#229;');
    firstName = firstName.replace('ä', '&#228;');
    lastName = lastName.replace('ä', '&#228;');
    firstName = firstName.replace('ö', '&#246;');
    lastName = lastName.replace('ö', '&#246;');
    firstName = firstName.replace('Å', '&#197;');
    lastName = lastName.replace('Å', '&#197;');
    firstName = firstName.replace('Ä', '&#196;');
    lastName = lastName.replace('Ä', '&#196;');
    firstName = firstName.replace('Ö', '&#214;');
    lastName = lastName.replace('Ö', '&#214;');
    firstName = firstName.replace('é', '&#233;');
    lastName = lastName.replace('é', '&#233;');
    firstName = firstName.replace('ü', '&#252;');
    lastName = lastName.replace('ü', '&#252;');
    // NOTE:ADDSCHEDULE

    var name = (lastName + ', ' + firstName);

    var req = new XMLHttpRequest();
    req.open('POST', 'http://178.62.210.139/', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify({name: name}));
    req.addEventListener('load', function() {
      var requestedId = (JSON.parse(req.responseText)).requestedId;
      requestedId = requestedId.substring(requestedId.indexOf('{')+1, requestedId.indexOf('}'));

      if (requestedId !== '') {
        $('#schemeInputFirst').val('');
        $('#schemeInputLast').val('');

        var n = $('.barLi').length + 1;

        $('#schemanUl').append('<li class="schemanLi" id="'+n+'schemanLi">'+originalFirstName+' '+originalLastName+'<span class="meSign">&nbsp;JAG</span><span class="goldMemberSign">&nbsp;GOLD MEMBER</span></li>');

        $('.barUl').append( '<li class="barLi" id="'+n+'barLi"><p>'+
                            originalFirstName.substr(0,1) + originalLastName.substr(0,1) +
                            '</p></li>');
        localStorage.setItem(n, requestedId);
        localStorage.setItem('name' + n, originalFirstName + ' ' + originalLastName);

        var currentId = localStorage.getItem('current');

        if (n < 3) {
          $('#1barLi p').css('color', 'red');
        }

	      $('#divSchema .barName').text('rudebecks.me');

        restart();
        setWeek();
        addRemoveBtn();
        gold();

      } else {
        alert('Hittade inte ditt schema :-( Kolla stavning och internetanslutning! OBS: Skriv ut ev. flera efternamn & áccéntér.');
      }
    });
  }
}

//TA BORT schema
$('#removeScheduleBtn').click(function() {
  $('.removeSchedule').stop(true).slideToggle(200);
})

function addRemoveBtn() {
  $('.schemanLi').find('.removeSchedule').remove();
  $('.schemanLi').append('<svg class="removeSchedule" version="1.1" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"> <g id="icomoon-ignore"> </g> <path d="M64 160v320c0 17.6 14.4 32 32 32h288c17.6 0 32-14.4 32-32v-320h-352zM160 448h-32v-224h32v224zM224 448h-32v-224h32v224zM288 448h-32v-224h32v224zM352 448h-32v-224h32v224z"></path> <path d="M424 64h-104v-40c0-13.2-10.8-24-24-24h-112c-13.2 0-24 10.8-24 24v40h-104c-13.2 0-24 10.8-24 24v40h416v-40c0-13.2-10.8-24-24-24zM288 64h-96v-31.599h96v31.599z"></path> </svg> ');

  $('.removeSchedule').click(function() {

    var whichId = $(this).parent().attr('id').substr(0,1);
    //updatera localStorage
    var nameArr =[];
    for (var i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).substr(0, 4) == 'name') {
        nameArr.push(localStorage.key(i));
      }
    }
    //om schemat som tas bort är det sista i localstorage awesome!! annars...
    if (whichId == nameArr.length) {
      localStorage.removeItem(whichId);
      localStorage.removeItem('name'+whichId);
    } else {
      localStorage.removeItem(whichId);
      localStorage.removeItem('name'+whichId);

      //subtraherar 1 från keyn på de med key större än den som togs bort
      for (var i = whichId, l = nameArr.length; i< l; i++) {
        localStorage.setItem(i, localStorage.getItem(parseInt(i)+1));

        var iplusone = parseInt(i) + 1;
        localStorage.setItem('name'+i, localStorage.getItem('name' + iplusone));
        localStorage.removeItem(iplusone);
        localStorage.removeItem('name'+iplusone);
        nameArr.length = 0;
        $('#'+iplusone+'schemanLi').attr('id', i + 'schemanLi');
        $('#'+iplusone+'barLi').attr('id', i + 'barLi');

        var currentId = localStorage.getItem('current');
        //currentId mst stå innan set item current
        localStorage.setItem('current', localStorage.getItem('1'));

        //byter oavsett tidigare schema till nr 1
        $('.iframeSchema').each(function() {
            $(this).attr('src', $(this).attr('src').replace(currentId, localStorage.getItem('1')));
        })
        restart();
      }
    }

    $(this).parent().remove();
    $('#'+whichId+'barLi').remove();
    nameArr.length = 0;
    $.when($.ajax()).then(setWeek());

    if($('.barLi').length == 1) {
      $('#1barLi').find('p').css('color', 'grey');
    } else if ($('.barLi').length < 1) {
      location.reload();
    } else {
      $('.barLi').find('p').css('color', 'grey');
      $('.gold').find('p').css('color', '#D4AF37');
      $('#1barLi').find('p').css('color', 'red');
    }
    if(whichId == 1) {
      meSign();
      localStorage.removeItem('color');
    }
  })
}

$('#changeColor').click(function() {
  $('#addScheduleModal').slideUp(150);
  $('#colorInput').stop(true).slideToggle(150);
  $('#creator').stop(true).slideToggle();
  $('#colorInput').focus();
})

$('#colorInput').keypress(function(e) {
    if(e.which == 13) {
      var color = $('#colorInput').val();
      $('#colorInput').val('');

      if (color == 'rainbow' || color == 'Rainbow') {
        $('.barTop').addClass('rainBow');
      } else {
        $('.barTop').removeClass('rainBow');
      }
      localStorage.setItem('color', color);
      setColor();
    }
});

function setColor() {
  var color = localStorage.getItem('color');
  if ( color == 'Rainbow' || color == 'rainbow') {
    $('.barTop').addClass('rainBow');
    //grattis du hittade det
  } else {
    $('.barTop').css('background-color', color);
  }
}

//schema append
var days = ['mon','tue','wed','thu','fri'];

function reloadIframes() {
  var id = localStorage.getItem('current');
  var imgHeight = $('body').height()-165;
  var imgWidth = $('body').width()-20;

  var j = 0;
  for (var i = 1; i <= 16; i*=2) {
    var iframeSchema = '<div class="swiper-slide swiper-slideSchemaDag"><iframe id="d' + days[j] + '1" src="http://www.novasoftware.se/ImgGen/schedulegenerator.aspx?format=png&schoolid=93700/sv-se&type=3&id={'+id+'}&period='+termin+'&week='+iframeWeek+'&foot=0&day='+i+'&width='+imgWidth+'&height='+imgHeight+'" class="iframeSchema"></iframe></div>';
    $('#swiper-wrapperVerticalSchema').append(iframeSchema);
  j++;
  }
  showTime();

  $(document).ready(function() {
    setTimeout(function() {
      reloadSwipe();
    }, 1000)
  })
}

var dayArr = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre'];

function reloadSwipe() {
  $('.swiper-containerSchema').height($('body').height());
  var schemaSwiper = new Swiper ('.swiper-containerVerticalSchema', {
    grabCursor: true,
    width: $('body').width(),
    spaceBetween: 10,
    initialSlide: todayDay - 1,
    pagination: '.swiper-pagination',
    paginationClickable: true,
    paginationBulletRender: function (swiper, index, className) {
    return '<span class="' + className + '">' + dayArr[index] + '</span>';
    },
  })

  var swiperH = new Swiper('.swiper-containerSchema', {
    grabCursor: true,
    direction: 'vertical',
    height: $('body').height(),
   // spaceBetween: 10,
  });
}

var orgWArr = [];
orgWArr.length = 0;
orgWArr.push($('body').width());

$(window).resize(function() {
    if(this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function() {
        $(this).trigger('resizeEnd');
        orgWArr.push($('body').width());
    }, 200);
});

$(window).bind('resizeEnd', function() {
  // console.log('resized');
  // var imgHeight = $('body').height() - 165;
  // var imgWidth = $('body').width()-20;
  // var heightLength = (imgHeight.toString().length + 8);
  //
  // if(orgWArr[orgWArr.length - 1] == (imgWidth+20)) {
  //   $('.iframeSchema').each(function() {
  //     $(this).attr('src', $(this).attr('src').replace( $(this).attr('src').substring($(this).attr('src').indexOf('height=')+7, $(this).attr('src').length), imgHeight));
  //   })
  //   orgWArr.length = 0;
  // } else {
  //   orgWArr.length = 0;
  //   orgWArr.push($('body').width());
  //   location.reload();
  // }
  location.reload();
  showTime();
});

function showTime() {
  if(today.getHours() > 7 && today.getHours() < 17 && today.getDay() < 6 && today.getDay() > 0) {

    if(today.getMinutes() < 10) {
      var todayMinutes = '0' + today.getMinutes();
      var todayHours = today.getHours();
    } else if (today.getHours() < 10) {
      var todayMinutes = today.getMinutes();
      var todayHours = '0' + today.getHours();
    } else if (today.getMinutes() < 10 && today.getHours() < 10) {
      var todayMinutes = '0' + today.getMinutes();
      var todayHours = '0' + today.getHours();
    } else {
      var todayMinutes = today.getMinutes();
      var todayHours = today.getHours();
    }

    $('.swiper-slideSchemaDag:nth-child('+todayDay+')').append('<div id="timeBall"></div><div id="timeStamp">'+todayHours+':'+todayMinutes+'</div><div id="timeLine"></div>');
    var bottom = 151.25 + (9/408) * ($('body').height() - 165);
    var Hour = ((462.5-160.25)/7/408) * ($('body').height() - 165);
    var hours = (17 - today.getHours())*Hour;
    var minutes = (today.getMinutes()/59) * Hour;
    var place = hours - minutes + bottom;
    $('#timeLine, #timeBall, #timeStamp').css('bottom', ''+place+'px');
    $('#timeLine, #timeBall, #timeStamp').hide();
    $('#timeLine, #timeBall').delay(1000).fadeIn().delay(4000).fadeOut();
    $('#timeStamp').delay(1500).fadeIn().delay(3000).fadeOut();

    /*setTimeout(function() {
      location.reload();
    },5*60000);*/

  }
}

var goldPersonList = ['Peter Stahre', 'Emelie Hitzeroth', 'Tim Thorén', 'Hedda Gustafsson'];

function gold() {
  var goldArr = [];
  var goldPeople = [];
  for (var i = 0; i < localStorage.length; i++) {
    if(localStorage.key(i).substring(0,4) == 'name') {
      goldArr.push(localStorage.key(i));
    }
  }
  for (var i = 1; i <= goldArr.length; i++) {
    goldPeople.push(localStorage.getItem('name' + i));
  }

  var goldN = goldPeople.indexOf(goldPersonList[0]) + 1;

  for (var i = 0; i < goldPersonList.length; i++) {
    $('#' + (goldPeople.indexOf(goldPersonList[i]) + 1) + 'barLi').addClass('gold');
    $('#' + (goldPeople.indexOf(goldPersonList[i]) + 1) + 'schemanLi').addClass('goldListItem');
    $('#' + (goldPeople.indexOf(goldPersonList[i]) + 1) + 'schemanLi').find('.goldMemberSign').show();
  }
  $('.gold').css('color', '#D4AF37');
  $('.goldListItem').css('border-left', '2px solid #D4AF37');
  $('.goldMemberSign').css({'color': '#D4AF37', 'font-size': '12px', 'font-weight': 'bold'});
}

function meSign() {
  $('.schemanLi .meSign').first().show();
  $('.meSign').css({'color': 'red', 'font-size': '12px', 'font-weight': 'bold'})
}

var sommarlov = new Date('Jun 12, 2018 11:00:00').getTime();
var now = today.getTime();

var diff = sommarlov - now;

var dagarSommar = Math.floor(diff / (1000 * 60 * 60 * 24));
var timmarSommar = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

if (diff < (14 * (1000 * 60 * 60 * 24))) {
  $('#sommarlov').append('<p style="font-weight:bold;font-size:20px;text-align:center;"><span style="color:red;">'+dagarSommar+' dagar </span>& <span style="color:red;">'+timmarSommar+' timmar</span> kvar till sommarlov</p>');
  $('#intro').css('background', '-webkit-linear-gradient(left, #b3e0ff, #ff8080)');

} else if (diff >= (14 * (1000 * 60 * 60 * 24))) {
  $('#sommarlov').append('<p style="font-weight:bold;font-size:20px;text-align:center;"><span style="color:red;">'+dagarSommar+' dagar </span>kvar till sommarlov</p>');
} else {
  $('#sommarlov').append('<p style="font-weight:bold;font-size:20px;text-align:center;">"Vi" på rudebecks.me önskar dig ett rofyllt sommarlov, peace out</span>kvar till sommarlov</p>');
}

$('#sommarlov').click(function() {
  $('#sommarlov p').append('!');
})







//© Thim Högberg 2018

//hogberg.thim@gmail.com
