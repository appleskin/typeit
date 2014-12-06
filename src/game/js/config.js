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
		input: false
	};

	this.app = {
		firebase: 'https://typeit-koding.firebaseio.com/',
		lag_compensation_ms: 300
	};

	this.levels = {
		easy: {
			gravity: 25,
			limit: 10,
			delay: Phaser.Timer.SECOND*3
		},
		normal: {
			gravity: 50,
			limit: 10,
			delay: Phaser.Timer.SECOND*2
		},
		hard: {
			gravity: 100,
			limit: 10,
			delay: Phaser.Timer.SECOND
		}
	};

};

Config.prototype.constructor = Config;