Config = function() {

	this.world = {
		x: 600,
		y: 700
	};

	this.gravity = {
		x: 0,
		y: 500
	}

	this.debug = {
		word: false,
		input: true
	};

	this.app = {
		firebase: 'https://typeit-koding.firebaseio.com/',
		lag_compensation_ms: 300
	};


};

Config.prototype.constructor = Config;