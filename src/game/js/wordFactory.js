WordFactory = function( game ) {
	Phaser.Group.call(this, game);
	this.setLimit( 10 );

	this.currentId = 0;
};

WordFactory.prototype = Object.create(Phaser.Group.prototype);
WordFactory.prototype.constructor = WordFactory;

WordFactory.prototype.insertWord = function( x, y, text, wid ) {
	this.add( new Word( this.game, x, y, text, wid ) );
};

WordFactory.prototype.removeWord = function( wid ) {
	this.forEach( function( item ) {
	    if( item && item.wid === wid ) {
	    	item.explode();
	    }
	}, this);
};

WordFactory.prototype.spawnWord = function() {
	var count = this.length+1;
	if( this.length < this.limit ) {

		if( CONFIG.debug.word ) {
			console.log( "Spawning Word - " + count + " active of " + this.limit );
		}

		var spawn_pos = UTIL.getRandomSpawn();
		var target = new Word( this.game, spawn_pos.x, spawn_pos.y, UTIL.getRandomWord(), this.currentId++ );
		
		SESSION.firebase.insertWord( target.x, target.y, target.text, target.wid );

		var thisFactory = this;
		// naive lag compensation
		setTimeout( function() {
			thisFactory.add( target );
		}, CONFIG.app.lag_compensation_ms );

	} else {
		if( CONFIG.debug.word ) {
			console.log( "Not spawning word - limit reached" );
		}
	}
};

WordFactory.prototype.setLimit = function( limit ) {
	this.limit = limit;
};