console.log('hello, world!');

var spawn = require('child_process').spawn;

console.log('server', 'Spawning mplayer...');
mplayer = spawn('mplayer', ['-idle', '-slave']);
console.log('server', 'mplayer child pid: ' + mplayer.pid);

mplayer.stdout.on('data', function(data) {
	console.log('mplayer data:', data.toString());
});

mplayer.on('exit', function() {
	console.log('exiting mplayer...');
});

var m = 'loadfile "/media/mmc1/sounds/Chesky\ Records\ -\ The\ Body\ Acoustic/4-Hell\'s\ Kitchen.flac"';
mplayer.stdin.write(m + '\n');
