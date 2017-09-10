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
    console.log('\''+name+'\'');

    var req = new XMLHttpRequest();
    req.open('POST', 'http://178.62.210.139', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify({name: name}));
    req.addEventListener('load', function() {
      var requestedId = (JSON.parse(req.responseText)).requestedId;
      requestedId = requestedId.substr(requestedId.indexOf('{')+1, requestedId.indexOf('}')-1);
      console.log(requestedId);

      if (requestedId !== '') {
        $('#intro').slideUp();
        $('#divSchema').delay(400).fadeIn(1000);

        localStorage.setItem('1', requestedId);
        localStorage.setItem('current', requestedId);

        //nedan: loggar in automatiskt nästa gång appen startas om eftersom
        //name i LS inte kan skapas om inte getInfo() gått igenom
        localStorage.setItem('name1', originalFirstName+' '+originalLastName);

        // if($('#1').children().length < 1) {
        //   $('#1').append('<p>' + originalFirstName.substr(0,1) + originalLastName.substr(0,1)+'</p>');
        //   console.log(originalFirstName.substr(0,1) + originalLastName.substr(0,1));
        // }

        // $('#schemanUl').append('<li class="schemanLi">'+originalFirstName+' '+originalLastName+'</li>');

        var nameArr =[];
        for (var i = 0; i < localStorage.length; i++) {
          if (localStorage.key(i).substr(0, 4) == 'name') {
            nameArr.push(localStorage.key(i));
          }
        }

        for (var i = 1; i <= nameArr.length; i++) {
          var name = localStorage.getItem('name'+i);
          var lastName = name.substr(name.indexOf(' ')+1);
          $('.barUl').append('<li class="barLi" id="'+i+'"><p>' + name.substr(0,1) + lastName.substr(0,1) + '</p></li>');
          $('#schemanUl').append('<li class="schemanLi">'+name+'</li>');
        }

        if (nameArr.length > 1) {
          $('#1').find('p').css('color', 'red');
          restart();
        }

        reloadIframes();


      } else {
        $('#welcome').text('Hittade inte ditt schema :-( Kolla stavning och internetanslutning! OBS: Skriv ut ev. flera efternamn & accenter.').css({'color': 'red', 'font-size': '16px'});
      }
    });
  }
}



var today = new Date();
var todayDay = today.getDay();

if (today.getMonth()>6) {var termin='Ht'} else {termin='Vt'};

Date.prototype.getWeek = function() {
  var onejan = new Date(this.getFullYear(),0,1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
}

// var id = '320B68A2-9E01-4730-BC95-5730EC4EBB4F';
//
// localStorage.setItem('1', id);
// localStorage.setItem('current', id);



// function loadSchedule() {
//
// }

//settings
$('.settingsBtn').click(function() {
  $('#settings').slideToggle();
})

$('#goBack').click(function() {
  $('#settings').slideToggle();
  $('#addScheduleModal').slideUp();
  $('#colorInput').slideUp();

})

// $('#schemanUl').append('<li class="schemanLi">'+id+'</li>');

$('#addSchedule').click(function() {
  $('#addScheduleModal').slideToggle(150);
  $('#schemeInputFirst').delay(1000).focus();
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
    alert('glömde för och efternamn');
  } else if (firstName == '') {
    // $('#welcome').text('Du glömde förnamn!!!1!').css('color', 'red');
    alert('glömde förnamn');
  } else if (lastName == '') {
    // $('#welcome').text('Du glömde efternamn!').css('color', 'red');
    alert('glömde efternamn');
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
    console.log('\''+name+'\'');

    var req = new XMLHttpRequest();
    req.open('POST', 'http://178.62.210.139', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify({name: name}));
    req.addEventListener('load', function() {
      var requestedId = (JSON.parse(req.responseText)).requestedId;
      requestedId = requestedId.substr(requestedId.indexOf('{')+1, requestedId.indexOf('}')-1);
      console.log(requestedId);

      if (requestedId !== '') {
        $('#schemeInputFirst').val('');
        $('#schemeInputLast').val('');

        // localStorage.setItem('current', requestedId);

        $('#schemanUl').append('<li class="schemanLi">'+originalFirstName+' '+originalLastName+'</li>');

        var n = $('.barLi').length + 1;
        // $('#schemanUl').append('<li class="schemanLi">'+id+'</li>');
        $('.barUl').append( '<li class="barLi" id="'+n+'"><p>'+
                            originalFirstName.substr(0,1) + originalLastName.substr(0,1) +
                            '</p></li>');
        localStorage.setItem(n, requestedId);
        localStorage.setItem('name' + n, originalFirstName + ' ' + originalLastName);

        var currentId = localStorage.getItem('current');
        $('#' + localStorage.key(currentId)).find('p').css('color', 'red');

        restart();
      } else {
        // $('#welcome').text('Hittade inte ditt schema :-( Kolla stavning och internetanslutning! OBS: Skriv ut ev. flera efternamn & accenter.').css({'color': 'red', 'font-size': '16px'});
        alert('hittade inte schema');
      }
    });
  }
}

$('#changeColor').click(function() {
  $('#colorInput').slideToggle(150);
})

$('#colorInput').keypress(function(e) {
    if(e.which == 13) {
      var color = $('#colorInput').val();
      if (color === '#fff') {
        $('.barTop').css('background-color', color);
        $('.barName').css('color', 'grey');
        $('.barTop svg').css('fill', 'grey');
        alert('vad tråkigt att ta vit färg');
        $('#colorInput').val('');
      } else {
        $('.barTop').css('background-color', color);
        $('#colorInput').val('');
        $('.swiper-containerSchema .swiper-pagination-bullet-active').css('color', color);
        $('.swiper-containerSchema .swiper-pagination-bullet-active').css('border-bottom', '2.5px solid ' + color);
      }
    }
});

function restart() {
  $('.barLi').on('click', function() {
    $('.iframeSchema').slideUp();
    console.log('You clicked no' + this.id);
    var id = localStorage.getItem(this.id);
    var currentId = localStorage.getItem('current');
    console.log(id);
    localStorage.setItem('current', id);

    $.when($.ajax(changeEachId())).then(changeSchedule());
    // $.when($.ajax(reloadIframes())).then(changeSchedule());

    function changeEachId() {
      $('.iframeSchema').each(function() {
        $(this).attr('src', $(this).attr('src').replace(currentId, id));
        console.log('changed iframe id');
      });
    }

    function changeSchedule() {
      $('.iframeSchema').delay(200).slideToggle();
      console.log('showing new iframe');
    }

    $(this).siblings().find('p').css('color', 'grey');
    $(this).find('p').css('color', 'red');
  });
};
restart();

var imgHeight = $('body').height() - 185;

var imgWidth = $('body').width()-20;

//schema append
var days = ['mon','tue','wed','thu','fri'];

function reloadIframes() {
  var id = localStorage.getItem('current');
  var j = 0;
  for (var i = 1; i <= 16; i*=2) {
    var iframeSchema = '<div class="swiper-slide"><iframe id="d' + days[j] + '1" src="http://www.novasoftware.se/ImgGen/schedulegenerator.aspx?format=png&schoolid=93700/sv-se&type=3&id={'+id+'}&period='+termin+'&week='+today.getWeek()+'&foot=0&day='+i+'&width='+imgWidth+'&height='+imgHeight+'" class="iframeSchema"></iframe></div>';
    $('#swiper-wrapper').append(iframeSchema);
  j++;
  }
  reloadSwipe();
}


// NOTE:
//denna funktionens blir kallad 5 ggr
// var called = false;
// function changeSchedule() {
//   console.log('in func');
//   if (called === false) {
//     $('.iframeSchema').slideToggle('fast');
//     called = true;
//     console.log('func in IFF');
//   }
// }
// NOTE:


// var name = localStorage.getItem('name');
// if ($('#schemanUl li').length < 1) {
//   $('#schemanUl').append('<li class="schemanLi">'+name+'</li>');
//   console.log('added list item');
// }



$('.swiper-containerSchema').height($('body').height());
//swiper.js
// $(document).ready(function () {
//
// });

function reloadSwipe() {
  //initialize swiper when document ready
  var schemaSwiper = new Swiper ('.swiper-containerSchema', {
    grabCursor: true,
    width: $('body').width(),
    spaceBetween: 10,
    initialSlide: todayDay - 1, //va händer om det är lördag då, ingen vet
    pagination: '.swiper-pagination',
    paginationClickable: true,
    paginationBulletRender: function (swiper, index, className) {
    return '<span class="' + className + '">' + $('.divDag' + index).html() + '</span>';
    },
  })
}
