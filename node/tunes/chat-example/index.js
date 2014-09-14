var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var player = require('MPlayer');

app.get('/', function(req, res) {
	res.sendfile('index.html');
});

app.get('/tunes', function(req, res) {
	res.sendfile('tunes.json');
});

player.on('progress', function(info) {
	//console.log('player progress:', info);
	io.emit('progress', info);
});

io.on('connection', function(socket) {
	console.log('a user connected');

	socket.on('chat message', function(msg) {
		io.emit('chat message', msg);
	});

	socket.on('cmd', function(msg, arg0) {
		console.log('cmd', msg, arg0);
		switch (msg) {
			case 'load':
				player.play(arg0, function(metadata) {
					delete metadata.picture;
					console.log('metadata', metadata);
					io.emit('metadata', metadata);
				});
			break;
			case 'play':
				player.play('/media/mmc1/sounds/Chaka\ Khan\ -\ Funk\ This/01_Back\ In\ The\ Day.flac', function(metadata) {
					console.log('metadata', metadata);
					io.emit('metadata', metadata);
				});
			break;
			case 'pause':
				player.pause();
			break;
		}
	});

});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

var tree = require('tm-FileTree')('/media/mmc1/sounds/'),
	treeData = tree.getData(),
	fs = require('fs');

fs.writeFile(__dirname + '/tunes.json', JSON.stringify(tree.getData(), null, 2), { encoding: 'utf8' }, function() {
	console.log('tree saved');
});