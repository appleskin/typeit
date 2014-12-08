Bg = function( game ) {
	Phaser.Sprite.call(this, game, 0, 0, 'bg');

	game.add.existing( this );
};

Bg.prototype = Object.create(Phaser.Sprite.prototype);
Bg.prototype.constructor = Bg;

