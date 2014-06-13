var exec = require('child_process').exec;
	
var N900 = function() {
	
	var _self = this;
	
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
	
	this.setVolume = function(value, callback) {
		var cmd = 'dbus-send --type=method_call --dest=com.nokia.mafw.renderer.Mafw-Gst-Renderer-Plugin.gstrenderer /com/nokia/mafw/renderer/gstrenderer com.nokia.mafw.extension.set_extension_property string:volume variant:uint32:' + value;
		_execShellCommand(cmd, function(data) {
			_self.getVolume(function(data) {
				callback(data);
			});
		});
	};
	
	this.setBrightness = function(value, callback) {
		var cmd = 'dbus-send --print-reply --system --dest=org.freedesktop.Hal /org/freedesktop/Hal/devices/computer_backlight org.freedesktop.Hal.Device.LaptopPanel.SetBrightness int32:' + value;
		_execShellCommand(cmd, function(data) {
			//callback(data);
		});
	};
	
	this.vibrate = function(callback) {
		var cmd = 'dbus-send --system --print-reply --dest=com.nokia.mce /com/nokia/mce/request com.nokia.mce.request.req_start_manual_vibration int32:255 int32:500';
		_execShellCommand(cmd, function(data) {
			console.log('data', data);
			callback('ok');
		});
	}
	
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

*/