Word = function( game, x, y ) {
	Phaser.Sprite.call(this, game, x, y, 'asteroid');

    this.anchor.setTo( 0.5, 0.5 );

    game.physics.enable( [ this ], Phaser.Physics.ARCADE);
    //this.body.collideWorldBounds = true;

    game.add.existing( this );
};

Word.prototype = Object.create(Phaser.Sprite.prototype);
Word.prototype.constructor = Word;

Word.prototype.update = function() {
	if( this.y > CONFIG.world.y + 100 ) {
		
		if( CONFIG.debug.word ) {
			console.log( "Destroying word" );
		}
		
		this.destroy(true);
	}
};