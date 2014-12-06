Player = function( game, x, y ) {
	Phaser.Sprite.call(this, game, x, y, 'box');

	//this.scale.setTo( 0.5, 0.5 );
    this.anchor.setTo( 0.5, 0.5 );

    game.physics.enable( [ this ], Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;

    game.add.existing( this );
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;