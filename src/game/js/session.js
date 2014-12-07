Session = function() {
	this.players = {};
	this.loops = [];
};

Session.prototype.constructor = Session;

Session.prototype.goHome = function() {
	window.location.href = window.location.origin + "/welcome.html";
};

Session.prototype.init = function( game ) {
	this.mode = UTIL.getUrlParam('mode');

	if( this.mode !== 'deathmatch' ) {
		this.goHome();
	}

	this.game = game;
	this.started = false;
	this.auto_started = false;

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
    input.placeholder = 'Type and press ENTER to FIRE';

    var thisSession = this;
    var start = document.getElementById('start');
    start.onclick = function() {
    	thisSession.start();
    };

    var invite = document.getElementById('invite');
    invite.onclick = function() {
    	thisSession.showInvite('Invite');
    };

    var home = document.getElementById('welcome');
    home.onclick = function() {
    	thisSession.goHome();
    };

    document.body.appendChild( input );

    if( UTIL.getUrlParam('lobbyId' ) ) {
		vex.dialog.alert('Joining Session');
	} else {
		this.showInvite('Session Reset');
	}
};

Session.prototype.showInvite = function( message ) {
	var join_url = window.location.href + "&lobbyId=" + STORAGE.getItem('pid');
	var content = $('<div>Email this URL to a friend to play with them</div><input onclick="this.select()" style="width:100%;" value="' + join_url + '">');

	vex.dialog.open({
		message: message,
		afterOpen: function($vexContent) {
			return content.insertAfter( $vexContent.find('.vex-dialog-message') );
		},
		callback: function() {

		}
	});
};

Session.prototype.update = function() {
	this.input.update();

	if( !this.auto_started && !this.started && this.host && Object.keys( this.players ).length === 2 ) {
		this.auto_started = true;
		this.startDeathmatch();
	}
};

Session.prototype.drawHud = function() {
	var player_keys = Object.keys( this.players );
	
	if( this.started ) {
		try {
			var p1 = this.players[player_keys[0]];

			if( this.mode === 'deathmatch' ) {
				game.debug.text('Your Health: ' + p1.health, 10, 20);
			}
		} catch( ex ) { /* nom nom nom */ }

		try {
			var p2 = this.players[player_keys[1]];
			if( this.mode === 'deathmatch' ) {
				game.debug.text('Enemy Health: ' + p2.health, CONFIG.world.x - 150, 20);
			}
		} catch( ex ) { /* nom nom nom */ }

		if( this.mode === 'classic' ) {
			try {
				for( var i=0; i<player_keys.length; i++ ) {
					var p = this.players[player_keys[i]];

					var text = p.pid === STORAGE.getItem('pid') ? 'Your Score:' + p.score : 'Other Guy ' + i + ' Score: ' + p.score;

					game.debug.text( text, 10, 25*(i+1) );
				}
			} catch( ex ) { console.error( ex ); }
		}
	}

	if( !this.started && this.mode === 'deathmatch' ) {
		var x = CONFIG.world.x/2 - 140;
		var text = "Waiting for opponent to join...";
		if( !this.host ) {
			text = "Waiting for host to start the game...";
			x -= 20;
		}
		game.debug.text( text, x, CONFIG.world.y/2 - 50 );
	}
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
	} else {
		this.host = true;
		this.lobbyId = player.pid;
	}

	this.firebase = new Firebase_client( player, this.lobbyId, this.host );

	var thisSession = this;
	this.firebase.logIn.then( function() {
		
		thisSession.firebase.init();

		if( !thisSession.host ) {
			document.getElementById('invite').style.display = 'none';
		}

		// Enable game type events
		if( thisSession.mode === 'deathmatch') {
			thisSession.firebase.enableDeathmatchEvents();
		} else {
			thisSession.firebase.enableClassicEvents();
		}

	}, function( error ) {
		console.log( error );
		this.goHome("Connection error");
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
	var thisSession = this;
	vex.dialog.confirm({
		message: 'Begin with ' + Object.keys(this.players).length + ' player(s)?',
		callback: function( result ) {
			if( result ) {
				if( thisSession.host ) {
					thisSession.firebase.setSetting( 'state', 'paused' );
						
					if( !difficulty ) {
						difficulty = 'normal';
					}
					thisSession.beginClassic( CONFIG.levels[difficulty].delay, CONFIG.levels[difficulty].limit, CONFIG.levels[difficulty].gravity );

					thisSession.firebase.setSetting( 'state',	 'playing' );
					thisSession.firebase.setSetting( 'gravity',  CONFIG.levels[difficulty].gravity  );
				}
				thisSession.started = true;
			}
		}
	});

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

	var thisSession = this;
	vex.dialog.confirm({
		message: 'Someone joined you. Get ready!',
		callback: function( result ) {
			// We have two players in the lobby
			// "Now...Shall we begin?" - https://www.youtube.com/watch?v=RuX5nw0rzVc
			document.getElementById('start').style.display = "none";
			document.getElementById('invite').style.display = "none";
			if( thisSession.host ) {
				thisSession.missiles.spawnMissileBays();
			}
			thisSession.started = true;
		}
	});

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

Session.prototype.playerRemoved = function( player ) {
	var thisSession = this;

	
	if( this.mode === 'classic' ) {
		// In classic and you were removed - kicked
		if( player.pid === STORAGE.getItem('pid') ) {
			vex.dialog.open({
				message: 'You were kicked from the session',
				callback: function() {
					thisSession.goHome();
				}
			});
		} 
		// In classic and someone else was connected - dropped player
		else {
			console.log( 'Dropped Player:' + player.pid );
			var player_keys = Object.keys( this.players );
			var new_player_list = {};
			for( var i=0; i<player_keys.length; i++ ) {
				if( this.players[player_keys[i]].pid !== player.pid ) {
					new_player_list[player_keys[i].pid] = this.players[player_keys[i]];
				}
			}
			this.players = new_player_list;
		}
		return;
	}

	// Losing anyone from deathmatch - disconnected
	if( this.mode === 'deathmatch' ) {
		vex.dialog.open({
			message: 'You were disconnected from the match',
			callback: function() {
				thisSession.goHome();
			}
		});
		return;
	}
};

Session.prototype.win = function( pid ) {
	var thisSession = this;
	if( pid === STORAGE.getItem('pid') ) {
		vex.dialog.open({
		  	message: 'You Win!',
		  	callback: function(data) {
		  		thisSession.goHome("Woot! GG Mate!");
		  	}
		});
	} else {
		vex.dialog.alert({
			message: 'You Lose!',
			callback: function() {
				thisSession.goHome("Dang! Sorry about the loss...");	
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
		this.started = true;
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
		// RELOAD - New missile reslots 1 seconds later
		setTimeout( function() {
			thisSession.missiles.reloadMissileBay( missile.y, missile.ownerId );
		}, 1000 );
	}
};

























