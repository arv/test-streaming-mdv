'use strict';

var express = require("express");
var app = express();

app.configure(function(){
  app.use(express.static(__dirname));
});

// app.get('/', function(req, res){
//   res.sendfile(__dirname + '/index.html');
// });

app.get('/feed.json', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Transfer-Encoding': 'chunked'
  });

  var start = Date.now();
  var counter = 0;

  res.write(Array(1000).join(' '));

  res.write('[');

  function writeMore() {
    if (counter >= 1000) {
      clearTimeout(t);
      res.end(']');
      return;
    }

    if (counter > 0)
      res.write(',');

    var obj = {
      counter: counter++,
      now: Date.now()
    };

    res.write(JSON.stringify(obj));
  }

  var t = setInterval(writeMore, 50);

});

app.listen(3000);