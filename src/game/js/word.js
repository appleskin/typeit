Word = function( game, x, y, text ) {
	Phaser.Sprite.call(this, game, x, y, 'asteroid');

    this.anchor.setTo( 0.5, 0.5 );

    game.physics.enable( [ this ], Phaser.Physics.ARCADE);

    this.text = text;
    this.style = { font: "18px Arial", fill: "#ffffff", align: "center" };
    this.display_text = new Phaser.Text( game, 0, 0, this.text, this.style );
    
    game.add.existing( this.display_text );
    game.add.existing( this );
};

Word.prototype = Object.create(Phaser.Sprite.prototype);
Word.prototype.constructor = Word;

Word.prototype.update = function() {

	this.display_text.x = this.x;
	this.display_text.y = this.y - 12;

	if( this.y > CONFIG.world.y + 100 ) {
		this.explode();
	}
};

Word.prototype.explode = function() {
	if( CONFIG.debug.word ) {
		console.log( "Destroying word - " + this.text );
	}
	this.display_text.destroy( true );
	this.destroy( true );
};