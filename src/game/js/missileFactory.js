MissileFactory = function( game ) {
	Phaser.Group.call(this, game);
	this.currentId = 0;
};

MissileFactory.prototype = Object.create(Phaser.Group.prototype);
MissileFactory.prototype.constructor = MissileFactory;

MissileFactory.prototype.insertMissile = function( missile ) {
	this.add( new Missile( this.game, missile.x, missile.y, missile.text, missile.reverse, missile.mid ) );
};

MissileFactory.prototype.removeMissile = function( mid ) {
	this.forEach( function( item ) {
	    if( item && item.mid === mid ) {
	    	item.explode();
	    }
	}, this);
};

MissileFactory.prototype.spawnMissileBays = function() {
	
	var gap = 85;
	var max = 6;
	var offset = 75;
	
	// Spawn 10 for host
	
	var x = offset;
	var y = 50;
	for( var i=0; i<max; i++ ) {
		var target = new Missile( this.game, x, y, UTIL.getRandomWord(), false, this.currentId++ );
		SESSION.firebase.insertMissile( target );
		this.add( target );
		y += gap;
	}

	// Spawn 10 for client
	x = CONFIG.world.x - offset;
	y = 100;
	for( var i=0; i<max; i++ ) {
		var target = new Missile( this.game, x, y, UTIL.getRandomWord(), true, this.currentId++ );
		SESSION.firebase.insertMissile( target );
		this.add( target );
		y += gap;
	}

};

MissileFactory.prototype.setLimit = function( limit ) {
	this.limit = limit;
};