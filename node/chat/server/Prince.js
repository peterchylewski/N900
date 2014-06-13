var fs = require('fs');
var _ = require('underscore');
var extend = require('./extend.js');
var exec = require('child_process').exec;

var Prince = function(options) {
	var _defaults = {
			foo: 'pfumpel',
			cmd: 'ls -l'
		},
		_config = extend(_defaults, options);
		
	console.log(_config);
	
	_findPrince();
	
	this.pdf = function() {
		console.log('yeah, let’s make a PDF...');
		;
		
		_exec(_composeCommand(), {}, function(error, stdout, stderr) {
			console.log('afterexec');
			console.log(error, stdout, stderr);
		});
		/*
		_exec(_config.cmd, {}, function(error, stdout, stderr) {
			console.log('_exec callback');
			console.log(error, stdout, stderr);
		});
		*/
	};
	
	function _findPrince() {
		console.log('_findPrince');
		var paths = process.env.PATH.split(':'),
			pathToPrinceCandidate, pathToPrince;
			
		_.each(paths, function(path) {
			pathToPrinceCandidate = path + '/prince';
			if (fs.existsSync(pathToPrinceCandidate) === true) {
				pathToPrince = pathToPrinceCandidate;
			}
		});
		return pathToPrince !== undefined ? pathToPrince : false;
	}
	
	function _composeCommand() {
		var cmd;
			pathToPrince = _findPrince();
		
		if (pathToPrince !== false) {
			cmd = pathToPrince + ' in.html -o out.pdf';
			return cmd;
		} else {
			console.log('sorry, the prince must be hiding somwhere....');
		}
	}
	
	function _exec(cmd, options, callback) {
		try {
			exec(cmd, {}, callback);
		} catch(exception) {
			callback(exception);
		}
	}
	
	
};

module.exports = Prince;