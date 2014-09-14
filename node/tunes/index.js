var express = require('express'),
	app 	= express(),
	http 	= require('http').Server(app),
	url 	= require('url'),
	io 		= require('socket.io')(http),
	fs 		= require('fs');

io.on('connection', function(socket) {

	console.log('a user connected');
	
	/*
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
	
	*/

});

http.listen(3000, function() {
	console.log('listening on *:3000');
});	

/*
'use strict';

var _ = require('underscore'),
	os = require('os'),
	fs = require('fs'),
	tunesDir = '/home/user/MyDocs/.sounds';
*/

/*
fs.readdir(tunesDir, function(err, files) {
	_.each(files, function(file) {
		console.log(tunesDir + '/' + file);
	})
});
*/
console.log('foo');
///home/user/MyDocs/.sounds

/*
fs.watch('/home/user/MyDocs/.sounds/Velveljin', function() {
	console.log('file has changed');
});
*/

/*
_.each(os, function(value, key) {
	if (typeof value === 'function') {
		console.log(key, value());
	} else {
		console.log(key, value);
	}
});

*/

var web = require('SimpleWebServer')(__dirname + '/public', 3000);

//var player = require('MPlayer');

//player.play('/media/mmc1/sounds/Chesky\ Records\ -\ The\ Body\ Acoustic/4-Hell\'s\ Kitchen.flac');

//player.play('/media/mmc1/sounds/Chaka\ Khan\ -\ Funk\ This/01_Back\ In\ The\ Day.flac');