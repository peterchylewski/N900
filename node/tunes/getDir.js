'use strict';

var fs = require('fs'),
    path = require('path'),
	_ = require('underscore');

// http://stackoverflow.com/questions/11194287/convert-a-directory-structure-in-the-filesystem-to-json-with-node-js

function dirTree(filename) {
	//console.log('dirTree', filename);
	
    var stats = fs.lstatSync(filename),
        info = {
            path: path.resolve(global._root, filename),
            name: path.basename(filename),
			birthtime: stats.birthtime,
			atime: stats.atime,
			ctime: stats.ctime,
			mtime: stats.mtime
        };

	//console.log('stats', stats);	
	
    if (stats.isDirectory()) {
        info.type = 'folder';
        info.children = fs.readdirSync(filename).map(function(child) {
            return dirTree(filename + '/' + child);
        });
    } else {
        // Assuming it's a file. In real life it could be a symlink or
        // something else!
        info.type = 'file';
		info.extension = path.extname(filename).replace(/^\./, '');
    }
    return info;
}

var jsonPath = require('JSONPath');

function filteredTree(filename) {
	var tree = dirTree('/media/mmc1');
	//return (jsonPath.eval(tree, '$..[?@type="file"]'));
	fs.writeFileSync('tunes.json', JSON.stringify(tree, null, 2));
	return tree;
}

//console.log(JSON.stringify(dirTree('/media/mmc1'), null, 2));

var http = require('http');
http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'html'});
	res.end(JSON.stringify(filteredTree('/media/mmc1'), null, 2));
}).listen(3000);