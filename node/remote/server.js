var express = require('express'),
	app 	= express(),
	http 	= require('http').Server(app),
	io 		= require('socket.io')(http),
	fs 		= require('fs');

var PATH_TO_PUBLIC = __dirname + '/public';

app.use(express.static(PATH_TO_PUBLIC));

//console.log(fs.readdirSync(PATH_TO_CLIENT + '/assets'));

var N900 = require('./N900');

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
		
		console.log('cmd: ' + msg);
		console.log('value: ' + value);
		
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
			case 'setBrightness':
				N900.setBrightness(value, function(data) {
					io.emit('value', 'brightness', data);
				});
			break;
			case 'vibrate':
				N900.vibrate(function(data) {
					io.emit('value', 'foo', data);
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
