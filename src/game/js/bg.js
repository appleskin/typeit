Bg = function( game ) {
	Phaser.Sprite.call(this, game, 0, 0, 'bg');

	game.physics.enable( [ this ], Phaser.Physics.ARCADE);

	this.body.velocity.x = 0;
	this.body.velocity.y = 0;

	game.add.existing( this );
};

Bg.prototype = Object.create(Phaser.Sprite.prototype);
Bg.prototype.constructor = Bg;

Bg.prototype.update = function() {

	this.body.velocity.y = UTIL.random(3,5);
	if( this.y < -25 ) {
		this.y = -25;
		
	}	else if( this.y > 0 ) {
		this.y = 0;
	}

	this.body.velocity.x = UTIL.random(1,2);
	if( this.x < -5 ) {
		this.x = -5;
	} else if( this.x > 5 ) {
		this.x = 5;
	}

	this.rot = UTIL.random(5,8)/10;

	if( this.body.angle > 5 ) {
    	this.body.angle = 5;
    	this.rot *= -1;
    } else if( this.body.angle < -5 ) {
    	this.body.angle = -5;
    	this.rot *= -1;
    }

};