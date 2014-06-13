// http://book.mixu.net/node/index.html
// http://book.mixu.net/node/ch8.html
// http://bjouhier.wordpress.com/2012/04/14/node-js-awesome-runtime-and-new-age-javascript-gospel/

var fs = require('fs');
var _ = require('underscore');


exports.bar = function() {
	console.log('foobar');
	console.log(JSON.parse(fs.readFileSync(__dirname + '/node_modules/underscore/package.json', 'utf8')).readme);
	
}

var Foo = function() {
	
};

var util = require('util'),
	exec = require('child_process').exec,
	child;

function say(msg) {
	child = exec('say -v victoria "' + msg + '"', // command line argument directly in string
		function (error, stdout, stderr) {      // one easy function to capture data/errors
			console.log('stdout: ' + stdout);
			console.log('stderr: ' + stderr);
			var filesAfter = fs.readdirSync(__dirname);
			console.log(_.difference(filesAfter, filesBefore));
			console.log(_.intersection(filesAfter, filesBefore));
			filesBefore = fs.readdirSync(__dirname);
			if (error !== null) {
				console.log('exec error: ' + error);
			}
		});
}

var filesBefore = fs.readdirSync(__dirname);

fs.watch(__dirname, function(foo, bar) {
	console.log('something has changed:', foo, bar);
	
});

var applescript = require("applescript");

// Very basic AppleScript command. Returns the song name of each
// currently selected track in iTunes as an 'Array' of 'String's.
var script = 'tell application "iTunes" to get name of selection';
//var script = 'tell application "iTunes" to pause';

applescript.execString(script, function(err, rtn) {
  if (err) {
    // Something went wrong!
  }
  if (Array.isArray(rtn)) {
    rtn.forEach(function(songName) {
      console.log(songName);
		say(songName);
    }); 
  }
});