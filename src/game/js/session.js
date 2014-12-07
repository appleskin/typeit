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
    	alert( "Joining Session" );
	} else {
		alert( "New Session Created" );
	}
};

Session.prototype.update = function() {
	this.input.update();
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

	// Enable game type events
	if( this.mode === 'deathmatch') {
		this.firebase.enableDeathmatchEvents();
	} else {
		this.firebase.enableClassicEvents();
	}
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
	} else {
		this.game.physics.arcade.gravity.y = CONFIG.levels[difficulty].gravity;
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
		alert( "You need at least two people to play Deathmatch" );
		return;
	} else if( num_players > 2 ) {
		alert( "There can only be two people in the lobby to play Deathmatch" );
		return;
	}

	// We have two players in the lobby
	// Shall we begin?

	// Step 1
	// Build and place list of missles on left - me


	// Step 2
	// Build and place list of missles on right - them

	this.beginDeathmatch();
};

Session.prototype.beginDeathmatch = function() {
	alert( 'begin deathmatch' );
};

Session.prototype.insertWord = function( x, y, text, wid ) {
	if( !this.host ) {
		this.words.insertWord( x, y, text, wid );
	}
};

Session.prototype.removeWord = function( wid ) {
	this.words.removeWord( wid );
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
		alert( 'YOU WIN!' );
		window.location.href = window.location.origin;
	} else {
		alert( 'YOU LOSE!' );
		window.location.href = window.location.origin;
	}
};

Session.prototype.processInput = function( text ) {

	this.words.forEach( function( item ) {
	    if( item && item.text === text ) {
	    	SESSION.addPoints( 1 );
	    	SESSION.firebase.nukeWord( item.wid );
	    }
	}, this);

};

























