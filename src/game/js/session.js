Session = function() {
	this.players = {};
	this.loops = [];
};

Session.prototype.constructor = Session;

Session.prototype.init = function( game ) {
	this.game = game;

	// Is this session hosting the game
	this.host = true;

	this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.world.setBounds(0, 0, CONFIG.world.x, CONFIG.world.y);
    this.game.physics.arcade.gravity.y = CONFIG.gravity.y;

    this.words = new WordFactory( this.game );
    this.input = new Input( game );

    var input = document.createElement('input');
    input.id = 'type';
    input.type = 'text';

    var thisSession = this;
    var start = document.createElement('button');
    start.id = 'start';
    start.innerHTML = 'Start';
    start.onclick = function() {
    	thisSession.start( 'normal' );
    };

    document.body.appendChild( input );
    document.body.appendChild( document.createElement('br') );
    document.body.appendChild( start );
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
		var start = document.getElementById('start');
		start.parentNode.removeChild(start);
	} else {
		this.lobbyId = player.pid;
	}

	this.firebase = new Firebase_client( player, this.lobbyId, this.host );
	
	// Seed host and client
	if( this.host ) {
		this.firebase.setSetting( 'gravity',  CONFIG.levels.normal.gravity );
		this.firebase.setSetting( 'state',    'paused' 	);
	} else {
		this.firebase.syncSetting( 'gravity' );
	}
};

Session.prototype.start = function( difficulty ) {
	if( this.host ) {
			
		if( !difficulty ) {
			difficulty = 'normal';
		}
		this.begin( CONFIG.levels[difficulty].delay, CONFIG.levels[difficulty].limit, CONFIG.levels[difficulty].gravity );

		this.firebase.setSetting( 'state',	 'playing' );
		this.firebase.setSetting( 'gravity',  CONFIG.levels[difficulty].gravity  );

	} else {
		this.firebase.syncSetting( 'gravity' );
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

Session.prototype.begin = function( timeout, limit, gravity ) {
	var loop = game.time.events.loop(timeout, function() {
		this.game.physics.arcade.gravity.y = gravity
		this.words.setLimit( limit );
		this.words.spawnWord();
	}, this);

	this.loops.push( loop );

	document.getElementById("type").focus();
};

Session.prototype.addPoints = function( value ) {
	var player = this.players[STORAGE.getItem("pid")];

	player.addPoints( value );

	this.firebase.players.child(player.pid).set({
		id: player.pid,
		score: player.score
	});
};

Session.prototype.addOrUpdateNetworkPlayer = function( player ) {
	if( player.pid === STORAGE.getItem('pid') ) {
		return;
	}
	if( !this.players[player.pid] ) {

		var num_players = Object.keys(this.players).length + 1;
		var x_pos = num_players * 100;

		var new_player = new Player( this.game, x_pos, CONFIG.world.y-25, player.score, player.pid );
		new_player.display_text.x -= 25;

		this.addPlayer( new_player );
	} else {
		this.players[player.pid].setScore( player.score );
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

























