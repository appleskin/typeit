Bg = function( game ) {
	Phaser.Sprite.call(this, game, 0, 0, 'bg');

	game.physics.enable( [ this ], Phaser.Physics.ARCADE);

	this.body.velocity.y = UTIL.random(5,8);

	game.add.existing( this );
};

Bg.prototype = Object.create(Phaser.Sprite.prototype);
Bg.prototype.constructor = Bg;

Bg.prototype.update = function() {

	if( this.y < -25 ) {
		this.body.velocity.y *= -1;
		this.y = -24;
		
	}	else if( this.y > 0 ) {
		this.body.velocity.y *= -1;
		this.y = -1;
	}

};