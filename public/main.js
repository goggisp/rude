//intro
$('#divSchema').hide();
$('#intro').show();
// $('#settings').show();
if(localStorage.getItem('name1') !== null) {
  $('#firstInput').val(localStorage.getItem('name1').substr(0, localStorage.getItem('name1').indexOf(' ')));
  $('#lastInput').val(localStorage.getItem('name1').substr(localStorage.getItem('name1').indexOf(' ')+1));
  getInfo();
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
        $('#intro').slideUp();
        $('#divSchema').delay(400).fadeIn(1000);

        localStorage.setItem('1', requestedId);
        localStorage.setItem('current', requestedId);

        //nedan: loggar in automatiskt nästa gång appen startas om eftersom
        //name i LS inte kan skapas om inte getInfo() gått igenom
        localStorage.setItem('name1', originalFirstName+' '+originalLastName);

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
          $('#schemanUl').append('<li class="schemanLi" id="'+i+'schemanLi">'+name+'</li>');
        }

        if (nameArr.length > 1) {
          $('#1barLi').find('p').css('color', 'red');
          restart();
        }

	 if((localStorage.length-1)/2 < $('.barLi').length) {
          location.reload();
          console.log('Y u max the submit btn?');
        }


        //reloadiframes först eftersom resten hämtar från DOM
        reloadIframes();
        $.when($.ajax(appendWeeks())).then(setWeek());
        $.when($.ajax(setWeek())).then(modalRestart());

        addRemoveBtn();
      } else {
        $('#welcome').text('Hittade inte ditt schema :-( Kolla stavning och internetanslutning! OBS: Skriv ut ev. flera efternamn & accenter.').css({'color': 'red', 'font-size': '16px'});
      }
    });
  }
}

if(localStorage.length > 1) {
  $('#welcome').text('Välkommen tillbaka!');
}

if (localStorage.length < 2) {
  $('#disclaimer').append('<p>Rudebecks.me är fristående från Rudebecks.se, ingen data är följaktligen hämtad från skolans hemsida.</p>');
  $('#disclaimerCreator').append('<p>Thim Högberg</p> <p>hogberg.thim@gmail.com</p>')
}

$('#removeScheduleBtn').click(function() {
  $('.removeSchedule').slideToggle(200);
})

//TA BORT schema TILLFÄLLIG PLATS
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
      console.log('removed last localstorage..');
    } else {
      localStorage.removeItem(whichId);
      localStorage.removeItem('name'+whichId);

      //subtraherar 1 från keyn på de med key större än den som togs bort
      for (var i = whichId, l = nameArr.length; i< l; i++) {
        console.log(nameArr.length);
        localStorage.setItem(i, localStorage.getItem(parseInt(i)+1));
        //kan tydligen inte lägga på i localStorage.getitem()
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
        console.log('ny current');
      }
    }

    $(this).parent().remove();
    $('#'+whichId+'barLi').remove();
    nameArr.length = 0;
    // localStorage.removeItem(whichId);
    // localStorage.removeItem('name'+whichId);
    $.when($.ajax()).then(setWeek());

    if($('.barLi').length < 2) {
      location.reload();
      $('#settings').show();
    } else if ($('.barLi').length < 1) {
      location.reload();
    } else {
      $('.barLi').find('p').css('color', 'grey');
      $('#1barLi').find('p').css('color', 'red');
    }
  })
}


var today = new Date();
var todayDay = today.getDay();


if (today.getMonth()>6) {var termin='Ht'} else {termin='Vt'};

Date.prototype.getWeek = function() {
  var onejan = new Date(this.getFullYear(),0,1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
}

var iframeWeek = today.getWeek();

if (today.getDay() == 6 || today.getDay() == 0) {
  //initial slide blir således måndag
  todayDay = 1;
  iframeWeek = iframeWeek + 1;
  $('#divSchema .barName').text('Trevlig helg /TH');
  $('#divSchema .barName').hide();
  $('#divSchema .barName').delay(2500).fadeIn().delay(2000).fadeOut();
  setTimeout( function() {
    $('#divSchema .barName').hide();
    $('#divSchema .barName').text('Nästa veckas schema');
    $('#divSchema .barName').fadeIn();
  }, 6000);
}

if(localStorage.length < 4 && today.getDay() !== 6 && today.getDay() !== 0) {
  $('#divSchema .barName').text('Lägg till fler scheman →');
  $('#divSchema .barName').hide();
  $('#divSchema .barName').delay(2500).fadeIn().delay(4000).fadeOut();
  setTimeout( function() {
    $('#divSchema .barName').hide();
    $('#divSchema .barName').text('Schema');
    $('#divSchema .barName').fadeIn();
  }, 8500);
}

if (termin == 'Ht') { var lastDay = new Date(today.getYear(), 11, 31) } else { var lastDay = new Date(today.getYear(), 5, 31) };

//WEEK
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
    // $('.swiper-pagination').css('z-index', '0');
    $('.iframeSchema').fadeOut(100);
    var week = this.id;

    $('.iframeSchema').each(function() {
      // NOTE: var week
      // $(this).attr('src', $(this).attr('src').replace($(this).attr('src').substring($(this).attr('src').indexOf('week=')+5, $(this).attr('src').indexOf('&foot')), week));
      var iframeUrl = $(this).attr('src');
      var weekEW = iframeUrl.substring(iframeUrl.indexOf('week='), iframeUrl.indexOf('&foot'));
      $(this).attr('src', iframeUrl.replace(weekEW, 'week='+week));
      console.log('changed week of iframes');
    });
    setWeek();
    // $.when($.ajax(modalRestart())).then(scheduleWNewW());
    scheduleWNewW();
    $('.weekModal').slideUp(200);
  })
}
modalRestart();

function scheduleWNewW() {
  setTimeout( function() {
    $('.swiper-pagination').css('z-index', '2');
  }, 200);
  $('.iframeSchema').fadeIn(100);
  console.log('new iframe - new week');
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
  $('.weekModal').slideToggle(200);
})

//settings
$('.settingsBtn').click(function() {
  $('#settings').slideToggle();
  $('#divSchema').slideToggle();
})

$('#goBack').click(function() {
  $('#settings').slideToggle();
  $('#addScheduleModal').slideUp();
  $('#colorInput').slideUp();
  $('.removeSchedule').slideUp();
  $('#divSchema').slideToggle();
})

$('#addSchedule').click(function() {
  $('#addScheduleModal').slideToggle(150);
  $('#schemeInputFirst').focus();
})

$('#scheduleModalBtn').click(function() {
  addSchedule();
})

$('#schemeInputLast').keypress(function(e) {
  if(e.which == 13) {
    addSchedule();
  }
});

//ADD ANOTHER SCHEDULE
function addSchedule() {
  var firstName = $('#schemeInputFirst').val();
  var lastName = $('#schemeInputLast').val();

  if (firstName == '' && lastName == '') {
    // $('#welcome').text('Du glömde för och efternamn!').css('color', 'red');
    alert('Du glömde för och efternamn!');
  } else if (firstName == '') {
    // $('#welcome').text('Du glömde förnamn!!!1!').css('color', 'red');
    alert('Du glömde förnamn!1!');
  } else if (lastName == '') {
    // $('#welcome').text('Du glömde efternamn!').css('color', 'red');
    alert('Du glömde efternamn!');
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
    // NOTE:ADDSCHEDULE
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
        $('#schemeInputFirst').val('');
        $('#schemeInputLast').val('');

        // localStorage.setItem('current', requestedId);
        var n = $('.barLi').length + 1;

        $('#schemanUl').append('<li class="schemanLi" id="'+n+'schemanLi">'+originalFirstName+' '+originalLastName+'</li>');

        // $('#schemanUl').append('<li class="schemanLi">'+id+'</li>');
        $('.barUl').append( '<li class="barLi" id="'+n+'barLi"><p>'+
                            originalFirstName.substr(0,1) + originalLastName.substr(0,1) +
                            '</p></li>');
        localStorage.setItem(n, requestedId);
        localStorage.setItem('name' + n, originalFirstName + ' ' + originalLastName);

        var currentId = localStorage.getItem('current');

        if($('.barLi').length < 2) {
          $('#1barLi').css('color', 'grey');
        } else {
          $('#' + localStorage.key(currentId)+'barLi').find('p').css('color', 'red');
        }

	$('#divSchema .barName').text('Schema');

        restart();
        setWeek();
        addRemoveBtn();
      } else {
        // $('#welcome').text('Hittade inte ditt schema :-( Kolla stavning och internetanslutning! OBS: Skriv ut ev. flera efternamn & accenter.').css({'color': 'red', 'font-size': '16px'});
        alert('Hittade inte ditt schema :-( Kolla stavning och internetanslutning! OBS: Skriv ut ev. flera efternamn & accenter.');
      }
    });
  }
}

$('#changeColor').click(function() {
  $('#colorInput').focus();
  $('#colorInput').slideToggle(150);
})

$('#colorInput').keypress(function(e) {
    if(e.which == 13) {
      alert('Denna eminenta funktion är fortfarande under beta, fyi')
      var color = $('#colorInput').val();
      $('.barTop').css('background-color', color);
      $('#colorInput').val('');
    }
});


function restart() {
  $('.barLi').on('click', function() {
    // $('.iframeSchema').slideUp(50);
    // $('.iframeSchema').fadeOut(100);
    var barLiId = this.id.substr(0,1);
    // console.log('You clicked no' + barLiId);
    var id = localStorage.getItem(barLiId);
    var currentId = localStorage.getItem('current');
    // console.log(id);
    localStorage.setItem('current', id);

    // $.when($.ajax(changeEachId())).then(changeSchedule());
    // $.when($.ajax(reloadIframes())).then(changeSchedule());

    function changeEachId() {
      $('.iframeSchema').each(function() {
        $(this).attr('src', $(this).attr('src').replace(currentId, id));
        // $('.iframeSchema').fadeIn(100);
      });
    }
    changeEachId();
    // function changeSchedule() {
    //   $('.iframeSchema').delay(200).slideToggle();
    //   console.log('showing new iframe');
    // }
    $(this).siblings().find('p').css('color', 'grey');
    $(this).find('p').css('color', 'red');
  });
};
// restart();


//schema append
var days = ['mon','tue','wed','thu','fri'];

function reloadIframes() {
  var id = localStorage.getItem('current');
  var imgHeight = $('body').height()-165;
  var imgWidth = $('body').width()-20;

  var j = 0;
  for (var i = 1; i <= 16; i*=2) {
    var iframeSchema = '<div class="swiper-slide"><iframe id="d' + days[j] + '1" src="http://www.novasoftware.se/ImgGen/schedulegenerator.aspx?format=png&schoolid=93700/sv-se&type=3&id={'+id+'}&period='+termin+'&week='+iframeWeek+'&foot=0&day='+i+'&width='+imgWidth+'&height='+imgHeight+'" class="iframeSchema"></iframe></div>';
    $('#swiper-wrapper').append(iframeSchema);
  j++;
  }
  reloadSwipe();
}

//swiper.js
// $(document).ready(function () {
//
// });
var dayArr = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre'];

function reloadSwipe() {
  $('.swiper-containerSchema').height($('body').height());
  //initialize swiper when document ready
  var schemaSwiper = new Swiper ('.swiper-containerSchema', {
    grabCursor: true,
    width: $('body').width(),
    spaceBetween: 10,
    initialSlide: todayDay - 1, //va händer om det är lördag då, ingen vet
    pagination: '.swiper-pagination',
    paginationClickable: true,
    paginationBulletRender: function (swiper, index, className) {
    return '<span class="' + className + '">' + dayArr[index] + '</span>';
    },
  })
}

var orgWArr = [];
orgWArr.length = 0;
orgWArr.push($('body').width());

$(window).resize(function() {
    if(this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function() {
        $(this).trigger('resizeEnd');
        orgWArr.push($('body').width());
    }, 500);
});

$(window).bind('resizeEnd', function() {
  console.log('resized');
  var imgHeight = $('body').height() - 165;
  var imgWidth = $('body').width()-20;
  var heightLength = (imgHeight.toString().length + 8);

  // var source = $('.iframeSchema').attr('src');
  // console.log(source.length);
  // var widthBeg = (source.indexOf('width=')+6);
  // var widthEnd = (source.length - heightLength);
  // console.log('widthbeg'+widthBeg);
  // console.log('widthe'+widthEnd);
  // console.log(source.substring(175, widthEnd));
  //
  if(orgWArr[orgWArr.length - 1] == (imgWidth+20)) {
    $('.iframeSchema').each(function() {
      $(this).attr('src', $(this).attr('src').replace( $(this).attr('src').substring($(this).attr('src').indexOf('height=')+7, $(this).attr('src').length), imgHeight));
      // $(this).attr('src', $(this).attr('src').replace($(this).attr('src').substring($(this).attr('src').indexOf('width=')+6, $(this).attr('src').length - heightLength), imgWidth));
    })
    orgWArr.length = 0;
  } else {
    orgWArr.length = 0;
    orgWArr.push($('body').width());
    location.reload();
  }
});
