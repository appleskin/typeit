Player = function( game, x, y ) {
	Phaser.Sprite.call(this, game, x, y, 'box');

    this.anchor.setTo( 0.5, 0.5 );

    game.physics.enable( [ this ], Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;

    this.pid = this.getPlayerId();
    this.score = 0;

    game.add.existing( this );
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

Player.prototype.getPlayerId = function() {
	var stored_id = STORAGE.getItem('pid' );
	if( stored_id ) {
		return stored_id;
	} else {
		var new_id = this.generatePlayerId();
		STORAGE.setItem( 'pid', new_id, false );
	}
};