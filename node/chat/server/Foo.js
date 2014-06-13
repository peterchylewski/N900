// http://openmymind.net/2012/2/3/Node-Require-and-Exports/

var Foo = function() {
	this.bar = function() {
		return 'foobar';
	};
};

module.exports = new Foo();