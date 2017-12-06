// server.js
var express = require('express');
var sio  = require('socket.io');
var app = express();

app.use(express.static('client'));

var server = app.listen(process.env.PORT, function(){
    console.log('Started serving');
});

var io = sio.listen(server);

io.sockets.on('connection', function(socket){
    console.log('New connection: ' + socket.id);
    io.sockets.emit('message', 'test');
});