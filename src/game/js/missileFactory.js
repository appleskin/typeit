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

MissileFactory.prototype.reloadMissileBay = function( missile_y, missile_owner ) {
	var new_id = this.currentId++;
	var new_missile = new Missile( this.game, 75, missile_y, UTIL.getRandomWord(), false, new_id, missile_owner );
	if( missile_owner !== STORAGE.getItem('pid') ) {
		new_missile = new Missile( this.game, CONFIG.world.x - 75, UTIL.getRandomWord(), true, new_id, missile_owner );
	}

	if( !reload.ownerId ) {
		debugger;
	}

	if( SESSION.host ) {
		SESSION.firebase.insertMissile( reload );
		SESSION.missiles.add( reload );
	}
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