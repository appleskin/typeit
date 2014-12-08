Missile = function( game, x, y, text, reverse, mid, owner ) {
	var sprite_name = 'missile';
	if( owner !== STORAGE.getItem('pid') ) {
		sprite_name = 'missile_2';
	}

	Phaser.Sprite.call(this, game, x, y, sprite_name);

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
    this.style = { font: "18px Tahoma", fill: "#ffffff", shadowColor:"#222222", shadowOffsetX:"1", shadowOffsetY:"1", align: "center" };
    this.display_text = new Phaser.Text( game, this.x, this.y, this.text, this.style );

    this.display_text.z = 100;

    if( reverse ) {
    	this.display_text.x += this.width/4;
    	this.display_text.y += this.height/3;
    } else {
    	this.display_text.x -= this.width/4;
    	this.display_text.y -= this.height/3;
    }

    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    this.rot = 0;

    this.launched = false;

    game.add.existing( this.display_text );
    game.add.existing( this );
};

Missile.prototype = Object.create(Phaser.Sprite.prototype);
Missile.prototype.constructor = Missile;

Missile.prototype.update = function() {

    if( this.reverse ) {
    	this.display_text.x = this.x + this.width/4;
    	this.display_text.y = this.y + this.height/3;
    } else {
    	this.display_text.x = this.x - this.width/4;
    	this.display_text.y = this.y - this.height/3;
    }

    if( this.angle > 3 || this.angle < -3 ) {
    	this.rot *= -1;
    }

    this.angle += this.rot;

	if( this.x > CONFIG.world.x + 75 || this.x < -75 ) {

		this.y = -100;
		this.x = 200;
		this.body.velocity = 0;

		if( SESSION.host ) {
			// reload right away if off screen
			try {
				SESSION.firebase.nukeMissile( missile.mid );
			} catch( ex ) {
				// TODO: trouble syncing reload
				//console.error( ex );
			}
			//SESSION.missiles.reloadMissileBay( this.y, this.ownerId );
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

    this.rot = UTIL.random(1,5)/10;
    if( UTIL.flip() ) {
    	this.rot *= -1;
    }
};

Missile.prototype.explode = function() {
	this.display_text.destroy( true );
	this.destroy( true );
};