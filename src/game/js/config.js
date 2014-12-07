Config = function() {

	this.world = {
		x: UTIL.getUrlParam('mode') === 'deathmatch' ? 800 : 600,
		y: UTIL.getUrlParam('mode') === 'deathmatch' ? 600 : 700
	};

	this.gravity = {
		x: 0,
		y: 50
	}

	this.debug = {
		word: false,
		input: false
	};

	this.app = {
		firebase: 'https://typeit-koding.firebaseio.com/',
		lag_compensation_ms: 200,
		score_to_win: 15,
		missile_velocity: 50
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