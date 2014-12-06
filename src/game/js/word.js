Word = function( game, x, y, text, wid ) {

	var asteroid = 'asteroid_' + UTIL.random(0,3);
	Phaser.Sprite.call(this, game, x, y, asteroid);

    this.anchor.setTo( 0.5, 0.5 );

    game.physics.enable( [ this ], Phaser.Physics.ARCADE);

    this.wid = wid;
    this.text = text;
    this.style = { font: "18px Arial", fill: "#ffffff", shadowColor:"#000000", shadowOffsetX:"2", shadowOffsetY:"2", shadowBlur:"1", align: "center" };
    this.display_text = new Phaser.Text( game, 0, 0, this.text, this.style );

    this.rotSpeed = UTIL.random(1,5);
    if( UTIL.flip() ) {
    	this.rotSpeed *= -1;
    }

    this.scale.setTo( UTIL.random(4,10)/10, UTIL.random(6,10)/10 );
    
    game.add.existing( this.display_text );
    game.add.existing( this );
};

Word.prototype = Object.create(Phaser.Sprite.prototype);
Word.prototype.constructor = Word;

Word.prototype.update = function() {

	this.display_text.x = this.x - this.width/4;
	this.display_text.y = this.y;

	this.angle += this.rotSpeed;

	if( this.y > CONFIG.world.y + 100 ) {
		this.explode();
	}

};

Word.prototype.explode = function() {
	if( CONFIG.debug.word ) {
		console.log( "Destroying word - " + this.text );
	}

	SESSION.firebase.nukeWord( this.wid );

	this.display_text.destroy( true );
	this.destroy( true );
};