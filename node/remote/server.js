var express = require('express');
var app 	= express();
var http 	= require('http').Server(app);
var io 		= require('socket.io')(http);
var fs 		= require('fs');

var N900 = require('./N900');

var PATH_TO_PUBLIC = __dirname + '/public';

app.use(express.static(PATH_TO_PUBLIC));

//console.log(fs.readdirSync(PATH_TO_CLIENT + '/assets'));

app.get('/*', function(req, res) {
	res.sendfile(PATH_TO_PUBLIC + '/index.html');
});

io.on('connection', function(socket) {
	
	console.log('a user connected');
	
	io.emit('chat message', 'hi');
	
	socket.on('*', function(msg) {
		console.log('something received');
	});
	
	socket.on('cmd', function(msg, value) {
		
		console.log('cmdx: ' + msg);
		console.log('valuex: ' + value);
		
		switch(msg) {
			case 'setVolume':
				N900.setVolume(value, function(data) {
					io.emit('value', 'volume', data);
				});
			break;
			case 'getVolume':
				N900.getVolume(function(data) {
					io.emit('value', 'volume', data);
				});
			break;
		}
	});
	
	socket.on('chat message', function(msg) {
		console.log('message: ' + msg);
		io.emit('chat message', msg);
	});
	
	socket.on('json message', function(msg) {
		console.log('message: ' + msg);
		io.emit('json message', msg);
	});

});

http.listen(3000, function() {
	console.log('listening on *:3000');
});
