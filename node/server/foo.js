var _ = require('underscore');
var moment = require('moment');

var http = require('http');
var fs = require('fs');
var tpl = fs.readFileSync('template.html', 'utf8');
var index = fs.readFileSync('index.html');

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'html'});
	var compiled = _.template(tpl);
	res.end(compiled({foo: bar}));
}).listen(9615); 