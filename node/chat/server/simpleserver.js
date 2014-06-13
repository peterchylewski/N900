
// http://socket.io/get-started/chat/

var express = require('express');
var app 	= express();
var http 	= require('http').Server(app);
var io 		= require('socket.io')(http);
var fs 		= require('fs');

var PATH_TO_CLIENT = __dirname + '/../client';

app.use(express.static(PATH_TO_CLIENT));

//console.log(fs.readdirSync(PATH_TO_CLIENT + '/assets'));

app.get('/*', function(req, res) {
	res.sendfile('client/index.html');
});

io.on('connection', function(socket) {
	console.log('a user connected');
	io.emit('chat message', 'hi');
	socket.on('chat message', function(msg) {
		console.log('message: ' + msg);
		io.emit('chat message', msg);
	});
	socket.on('json message', function(msg) {
		console.log('message: ' + msg);
		io.emit('json message', msg);
	});
	socket.on('json drag', function(msg) {
		socket.broadcast.emit('json drag', msg);
	});
	socket.on('jpeg', function(msg) {
		socket.broadcast.emit('jpeg', msg);
	});
});

http.listen(3000, function() {
	console.log('listening on *:3000');
});