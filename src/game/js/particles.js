Particles = function( game ) {
	this.smoke_emitter = game.add.emitter( 100, 100, 100 );
	this.smoke_emitter.makeParticles( 'smoke_particle' );
	this.smoke_emitter.gravity = 10;

	this.fire_emitter  = game.add.emitter( 100, 100, 100 );
	this.fire_emitter.makeParticles( 'fire_particle' );
	this.fire_emitter.gravity = 10;
};

Particles.prototype.constructor = Particles;


Particles.prototype.emitExplosion = function( x, y ) {
	this.fire_emitter.x = x;
	this.fire_emitter.y = y;

	this.smoke_emitter.x = x;
	this.smoke_emitter.y = y;

	this.fire_emitter.start( true, 800, null, 10 );
	var thatSmokeEmitter = this.smoke_emitter;
	setTimeout( function() {
		thatSmokeEmitter.start( true, 1000, null, 10 );
	}, 500 );
};
