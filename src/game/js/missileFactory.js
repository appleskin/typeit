MissileFactory = function( game ) {
	Phaser.Group.call(this, game);
	this.currentId = 0;
};

MissileFactory.prototype = Object.create(Phaser.Group.prototype);
MissileFactory.prototype.constructor = MissileFactory;

MissileFactory.prototype.insertMissile = function( missile ) {
	var tempX = missile.x;
	if( missile.reverse ) {
		tempX += 75;
	}
	this.add( new Missile( this.game, tempX, missile.y, missile.text, missile.reverse, missile.mid, missile.ownerId ) );
};

MissileFactory.prototype.removeMissile = function( mid ) {
	this.forEach( function( item ) {
	    if( item && item.mid === mid ) {
	    	item.explode();
	    }
	}, this);
};

MissileFactory.prototype.reloadMissileBay = function( missile ) {
	var new_missile = new Missile( this.game, missile.x, missile.y, UTIL.getRandomWord(), missile.reverse, this.currentId++, missile.ownerId );
	if( missile.ownerId === STORAGE.getItem('pid') ) {
		new_missile.reverse = false;
		new_missile.x = 75;
	} else {
		new_missile.reverse = true;
		new_missile.x = CONFIG.world.x - 75;
	}
	return new_missile;
};

MissileFactory.prototype.spawnMissileBays = function() {
	
	var keys = Object.keys( SESSION.players );
	var p1 = SESSION.players[keys[0]];
	var p2 = SESSION.players[keys[1]];

	var gap = 85;
	var max = 6;
	var offset = 75;
	
	// Spawn 10 for host
	var x = offset;
	var y = 50;
	for( var i=0; i<max; i++ ) {
		var target = new Missile( this.game, x, y, UTIL.getRandomWord(), false, this.currentId++, p1.pid );
		SESSION.firebase.insertMissile( target );
		this.add( target );
		y += gap;
	}

	// Spawn 10 for client
	x = CONFIG.world.x - offset;
	y = 100;
	for( var i=0; i<max; i++ ) {
		var target = new Missile( this.game, x, y, UTIL.getRandomWord(), true, this.currentId++, p2.pid );
		SESSION.firebase.insertMissile( target );
		this.add( target );
		y += gap;
	}

};

MissileFactory.prototype.setLimit = function( limit ) {
	this.limit = limit;
};