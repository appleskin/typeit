Missile = function( game, x, y, text, reverse, mid, owner ) {
	Phaser.Sprite.call(this, game, x, y, 'missile');

    this.anchor.setTo( 0.5, 0.5 );
    this.reverse = reverse;
    if( reverse ) {
		this.scale.x *= -1;
		this.scale.y *= -1;
    }

    this.ownerId = owner;

    game.physics.enable( [ this ], Phaser.Physics.ARCADE);

    this.mid = mid;
    this.text = text;
    this.style = { font: "16px Tahoma", fill: "#ff0000", shadowColor:"#000000", shadowOffsetX:"1", shadowOffsetY:"1", align: "center" };
    this.display_text = new Phaser.Text( game, this.x, this.y, this.text, this.style );

    this.display_text.z = 100;

    if( reverse ) {
    	this.display_text.x += this.width/4;
    	this.display_text.y += this.height/4;
    } else {
    	this.display_text.x -= this.width/4;
    	this.display_text.y -= this.height/4;
    }

    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    this.launched = false;

    game.add.existing( this.display_text );
    game.add.existing( this );
};

Missile.prototype = Object.create(Phaser.Sprite.prototype);
Missile.prototype.constructor = Missile;

Missile.prototype.update = function() {

    if( this.reverse ) {
    	this.display_text.x = this.x + this.width/4;
    	this.display_text.y = this.y + this.height/4;
    } else {
    	this.display_text.x = this.x - this.width/4;
    	this.display_text.y = this.y - this.height/4;
    }

	if( this.x > CONFIG.world.x + 75 || this.x < -75 ) {

		this.y = -100;
		this.x = 200;
		this.body.velocity = 0;

		if( SESSION.host ) {
			
			var thisMissile = this;
			// RELOAD - New missile reslots 1 seconds later
			setTimeout( function() {
				SESSION.firebase.nukeMissile( thisMissile.mid );
				SESSION.missiles.reloadMissileBay( thisMissile.y, thisMissile.ownerId );
				thisMissile.explode();
			}, 1000 );

			
		}

		var player_keys = Object.keys(SESSION.players);
		if( this.ownerId === STORAGE.getItem('pid') ) {
			// YOU HIT ENEMY
			SESSION.players[player_keys[1]].hitBy( player_keys[0] );
		} else {
			// ENEMY HIT YOU
			SESSION.players[player_keys[0]].hitBy( player_keys[1] );
		}
	}
};

Missile.prototype.launch = function() {
	this.body.velocity.x = CONFIG.app.missile_velocity;
	if( this.reverse ) {
		this.body.velocity.x *= -1;
	}
	this.launched = true;
};

Missile.prototype.explode = function() {
	this.display_text.destroy( true );
	this.destroy( true );
};