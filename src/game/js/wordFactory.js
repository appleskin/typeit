WordFactory = function( game ) {
	Phaser.Group.call(this, game);
	this.setLimit( 10 );

	this.word_list = [
		"the",
		"cat",
		"hat",
		"ball",
		"time",
		"hunter",
		"kim",
		"happy",
		"sad",
		"mad",
		"wrong",
		"right",
		"black",
		"white",
		"five"
	];
};

WordFactory.prototype = Object.create(Phaser.Group.prototype);
WordFactory.prototype.constructor = WordFactory;

WordFactory.prototype.getRandomWord = function() {
	return this.word_list[ UTIL.random( 0, 14 ) ];
};

WordFactory.prototype.getRandomSpawn = function() {
	return {
		x: UTIL.random( 0, CONFIG.world.x - 100 ),
		y: UTIL.random( -200, -10 )
	};
};

WordFactory.prototype.spawnWord = function() {
	var count = this.length+1;
	if( this.length < this.limit ) {

		if( CONFIG.debug.word ) {
			console.log( "Spawning Word - " + count + " active of " + this.limit );
		}

		var spawn_pos = this.getRandomSpawn();

		var target = new Word( this.game, spawn_pos.x, spawn_pos.y );
		this.add( target );

	} else {
		if( CONFIG.debug.word ) {
			console.log( "Not spawning word - limit reached" );
		}
	}
};

WordFactory.prototype.setLimit = function( limit ) {
	this.limit = limit;
};