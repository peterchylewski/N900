var exec = require('child_process').exec;
	
var N900 = function() {
	
	this.foo = function() {
		return 'bar';
	};
	
	this.getVolume = function(callback) {
		var callback = callback,
			cmd = 'dbus-send --print-reply --type=method_call --dest=com.nokia.mafw.renderer.Mafw-Gst-Renderer-Plugin.gstrenderer /com/nokia/mafw/renderer/gstrenderer com.nokia.mafw.extension.get_extension_property string:volume|awk "/nt/ {print $3}"';
		_execShellCommand(cmd, function(data) {
			callback(data.split(/\W/)[11]);
		});
	};
	
	function _execShellCommand(cmd, _callback) {
		var	child = exec(cmd, function (error, stdout, stderr) {
			if (error !== null) {
			    _callback('exec error: ' + error);
			} else {
				_callback(stdout);
			}
		});

	}
	
};

module.exports = new N900();



/*
'dbus-send --type=method_call --dest=com.nokia.mafw.renderer.Mafw-Gst-Renderer-Plugin.gstrenderer /com/nokia/mafw/renderer/gstrenderer com.nokia.mafw.extension.set_extension_property string:volume variant:uint32:50';
*/