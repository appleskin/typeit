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
    	thisSession.start( 'easy' );
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

	var player = new Player( game, (CONFIG.world.x/2), CONFIG.world.y-25 );
	this.addPlayer( Player );

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
		this.firebase.setSetting( 'gravity',  100  		);
		this.firebase.setSetting( 'state',    'paused' 	);
	} else {
		this.firebase.syncSetting( 'gravity' );
	}
};

Session.prototype.start = function( difficulty ) {
	var gravity = 100;
	if( this.host ) {

		this.firebase.setSetting( 'state',	 'playing' );
		this.firebase.setSetting( 'gravity',  gravity  );

		switch( difficulty ) {
			case 'easy':
				this.begin( Phaser.Timer.SECOND*3, 10, gravity );
			    break;
			case 'normal':
				gravity *= 2;
				this.begin( Phaser.Timer.SECOND, 15, gravity );
			    break;
			case 'hard':
				gravity *= 3;
				this.begin( Phaser.Timer.SECOND/2, 10, gravity );
			    break;
			default:
				this.begin( Phaser.Timer.SECOND, 15, gravity );
		};
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

Session.prototype.processInput = function( text ) {

	this.words.forEach( function( item ) {
	    if( item && item.text === text ) {
	    	SESSION.firebase.nukeWord( item.wid );
	    }
	}, this);

};

























