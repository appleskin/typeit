Session = function() {
	this.players = {};
	this.loops = [];
};

Session.prototype.constructor = Session;

Session.prototype.init = function( game ) {
	this.mode = UTIL.getUrlParam('mode');

	this.game = game;

	this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.world.setBounds(0, 0, CONFIG.world.x, CONFIG.world.y);
    this.game.physics.arcade.gravity.y = CONFIG.gravity.y;

    if( this.mode === 'deathmatch' ) {
    	this.game.physics.arcade.gravity.y = 0;
    }

    this.words = new WordFactory( this.game );
    this.missiles = new MissileFactory( this.game );
    this.input = new Input( game );

    var input = document.createElement('input');
    input.id = 'type';
    input.type = 'text';
    input.placeholder = 'Type here and press ENTER';

    var thisSession = this;
    var start = document.createElement('button');
    start.id = 'start';
    if( this.mode === 'deathmatch' ) {
    	start.innerHTML = 'Start Deathmatch [2 Players]';
	} else {
		start.innerHTML = 'Start Classic [1-5 Players]';
	}
    start.onclick = function() {
    	thisSession.start();
    };

    document.body.appendChild( input );
    document.body.appendChild( document.createElement('br') );
    document.body.appendChild( start );

    if( UTIL.getUrlParam('lobbyId' ) ) {
		vex.dialog.alert('Joining Session');
	} else {
		vex.dialog.alert('Session Created');
	}
};

Session.prototype.update = function() {
	this.input.update();
};

Session.prototype.drawHud = function() {
	try {
		var player_keys = Object.keys( this.players );

		var p1 = this.players[player_keys[0]];
		var p2 = this.players[player_keys[1]];

		game.debug.text('Health: ' + p1.health, 10, 20);
		game.debug.text('Health: ' + p1.health, 10, CONFIG.world.x - 30);
	} catch( ex ) { /* nom nom nom */ }
};

Session.prototype.addPlayer = function( player ) {
	this.players[player.pid] = player;
};

Session.prototype.connect = function() {
	var player = new Player( game, 0, CONFIG.world.y-25 );
	this.addPlayer( player );

	this.lobbyId = UTIL.getUrlParam('lobbyId');
	if( this.lobbyId ) {
		this.host = false;
		document.getElementById("start").style.display = "none";
		document.getElementById("invite-friends").innerHTML = "";
	} else {
		this.host = true;
		this.lobbyId = player.pid;
	}

	this.firebase = new Firebase_client( player, this.lobbyId, this.host );

	var thisSession = this;
	this.firebase.logIn.then( function() {
		
		thisSession.firebase.init();

		// Enable game type events
		if( thisSession.mode === 'deathmatch') {
			thisSession.firebase.enableDeathmatchEvents();
		} else {
			thisSession.firebase.enableClassicEvents();
		}

	}, function( error ) {
		console.log( error );
		window.location.href = window.location.origin;
	});
};

Session.prototype.start = function() {
	if( this.mode === 'deathmatch' ) {
		this.startDeathmatch();
	} else {
		this.startClassic( 'normal' );
	}
};

Session.prototype.startClassic = function( difficulty ) {
	if( this.host ) {
		this.firebase.setSetting( 'state', 'paused' );
			
		if( !difficulty ) {
			difficulty = 'normal';
		}
		this.beginClassic( CONFIG.levels[difficulty].delay, CONFIG.levels[difficulty].limit, CONFIG.levels[difficulty].gravity );

		this.firebase.setSetting( 'state',	 'playing' );
		this.firebase.setSetting( 'gravity',  CONFIG.levels[difficulty].gravity  );
	}
};

Session.prototype.beginClassic = function( timeout, limit, gravity ) {
	var loop = game.time.events.loop(timeout, function() {
		this.game.physics.arcade.gravity.y = gravity;
		this.words.setLimit( limit );
		this.words.spawnWord();
	}, this);

	document.getElementById("type").focus();
};

Session.prototype.startDeathmatch = function() {
	var num_players = Object.keys( this.players ).length;
	if( num_players < 2 ) {
		vex.dialog.alert('You need at least two people to play Deathmatch');
		return;
	} else if( num_players > 2 ) {
		vex.dialog.alert('There can only be two people in the lobby to play Deathmatch');
		return;
	}

	// We have two players in the lobby
	// "Now...Shall we begin?" - https://www.youtube.com/watch?v=RuX5nw0rzVc
	if( this.host ) {
		this.missiles.spawnMissileBays();
	}
};

Session.prototype.beginDeathmatch = function() {
	
};

Session.prototype.addPoints = function( value ) {
	var player = this.players[STORAGE.getItem("pid")];

	player.addPoints( value );
};

Session.prototype.addOrUpdateNetworkPlayer = function( player ) {
	if( player.pid === STORAGE.getItem('pid') ) {
		return;
	} else {
		if( !this.players[player.pid] ) {

			var num_players = Object.keys(this.players).length + 1;
			var x_pos = num_players * 50;

			var new_player = new Player( this.game, x_pos, CONFIG.world.y-25, player.score, player.pid );
			new_player.display_text.x -= 25;

			this.addPlayer( new_player );
		} else {
			this.players[player.pid].setScore( player.score );
		}
	}
};

Session.prototype.win = function( player ) {
	if( player.pid === STORAGE.getItem('pid') ) {
		vex.dialog.open({
		  	message: 'You Win!',
		  	callback: function(data) {
		  		window.location.href = window.location.origin;
		  	}
		});
	} else {
		vex.dialog.alert({
			message: 'You Lose!',
			callback: function() {
				window.location.href = window.location.origin;		
			}
		});
	}
};

Session.prototype.processInput = function( text ) {
	if( this.mode === 'deathmatch' ) {
		this.missiles.forEach( function( item ) {
			var text_matches = item && (item.text === text);
			var launched = item && item.launched;
			var enemy_missile = item && item.ownerId != STORAGE.getItem('pid');

			// check enemy flying missiles
		    if( item && text_matches && launched && enemy_missile ) {
		    	SESSION.firebase.nukeMissile( item );
		    } else if( item && text_matches ) {
		    	this.firebase.launchMissile( item );
		    }
		}, this );
	} else {
		this.words.forEach( function( item ) {
		    if( item && item.text === text ) {
		    	SESSION.addPoints( 1 );
		    	SESSION.firebase.nukeWord( item.wid );
		    }
		}, this );
	}
};

Session.prototype.insertWord = function( x, y, text, wid ) {
	if( !this.host ) {
		this.words.insertWord( x, y, text, wid );
	}
};

Session.prototype.removeWord = function( wid ) {
	this.words.removeWord( wid );
};

Session.prototype.insertMissile = function( missile ) {
	if( !this.host ) {
		this.missiles.insertMissile( missile );
	}
};

Session.prototype.launchMissile = function( missile ) {
	this.missiles.forEach( function( item ) {
		if( item && item.mid === missile.mid && item.ownerId === missile.ownerId ) {
			item.launch();
		}
	});
};

Session.prototype.removeMissile = function( missile ) {
	this.missiles.removeMissile( missile.mid );

	var thisSession = this;
	if( this.host ) {
		// RELOAD - New missile reslots 2 seconds later
		setTimeout( function() {
			var reload = null;
			if( missile.ownerId === STORAGE.getItem('pid') ) {
				// Make missile for host - left side
				reload = SESSION.missiles.reloadMissileBay( missile );
				SESSION.firebase.insertMissile( reload );
			} else {
				// Make missile fo client - right side
				reload = SESSION.missiles.reloadMissileBay( missile );
				SESSION.firebase.insertMissile( reload );
			}
			thisSession.missiles.add( reload );
		}, 2000 );
	}
};

























