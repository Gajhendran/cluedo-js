// server.js
var express = require('express');

var app = express();
app.use(express.static('client'));

var server = app.listen(process.env.PORT, function(){
    console.log('Started serving');
});
