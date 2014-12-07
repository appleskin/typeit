Util = function() {};

Util.prototype.constructor = Util;

Util.prototype.random = function( min, max ) {
	return Math.floor((Math.random() * max) + min);
};

Util.prototype.flip = function() {
	return Math.random() <= 0.5;
};

Util.prototype.getUrlParam = function( name ) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
};

// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb/5624139#5624139
Util.prototype.rgbToHex = function(r, g, b) {
    return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};