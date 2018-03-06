const express = require('express');
const request = require('request');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.static('public'));

app.get('/mat', function (req, res) {
  getFood(function (foodObj) {
    res.json(foodObj);
  });
});

app.post('/', function(req, res) {
  getInfo(req.body.name, function(requestedId) {
    res.json({requestedId: requestedId});
  });
});

app.listen(1337, function() {
  console.log('listening on port 1337');
});

function getFood(callback) {
  request('https://www.rudebecks.se/bamba', function (error, response, body) {
    var table = '<tbody>';
    body = body.substring(body.indexOf(table) + table.length, body.indexOf('</tbody>'));
    var vfvft = 'views-field views-field-title';
    var spaceBefore = '             ';
    var spaceAfter = '          ';
    var nDays = body.match(/views-field views-field-title/g);
    nDays = nDays.length;

    var foodObj = new Object();
    for (var i = 0; i < nDays; i++) {
      if (body.includes(vfvft)) {
        body = body.substring(body.indexOf(vfvft) + vfvft.length + spaceBefore.length + 3, body.length);
        food = body.substring(0, + body.indexOf('</td>') - spaceAfter.length);
        foodObj['food'+i] = food;
      }
    }
    callback(foodObj);
  });
};

function getInfo(name, callback) {
  request('https://www.novasoftware.se/webviewer/(S(30gpycqpe4gvwj453yaxiwzi))/MZDesign1.aspx?schoolid=93700&code=969640&type=3', function (error, response, body){
    var requestedId = body.substring(body.indexOf(name) - 45, body.indexOf(name)-7);
    callback(requestedId);
  });
};
