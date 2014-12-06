Util = function() {};

Util.prototype.constructor = Util;

Util.prototype.random = function( min, max ) {
	return Math.floor((Math.random() * max) + min);
};