Player = function( game, x, y, score, pid ) {
	Phaser.Sprite.call(this, game, x, y, 'player');

    this.anchor.setTo( 0.5, 0.5 );

    game.physics.enable( [ this ], Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;

    this.pid = null;
    if( pid ) {
    	this.pid = pid;
    } else {
    	this.pid = this.getNewPlayerId();
	}

    this.score = 0;

    if( score ) {
    	this.score += score;
    }

    this.style = { font: "12px Arial", fill: "#ffffff", shadowColor:"#000000", shadowOffsetX:"1", shadowOffsetY:"1", shadowBlur:"1", align: "center" };
    this.display_text = new Phaser.Text( game, x+this.width/4, y-10, '0', this.style );

    game.add.existing( this );
    game.add.existing( this.display_text );
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.generatePlayerId = function() {
	//http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	});
};

Player.prototype.addPoints = function( value ) {
	this.score += value;
	this.display_text.text = '' + this.score;

	SESSION.firebase.setPlayerPoints( this );
};

Player.prototype.getNewPlayerId = function() {
	var stored_id = STORAGE.getItem('pid' );
	if( stored_id ) {
		return stored_id;
	} else {
		var new_id = this.generatePlayerId();
		STORAGE.setItem( 'pid', new_id, false );
		return new_id;
	}
};