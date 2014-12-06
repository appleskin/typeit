Session = function() {
	this.players = [];
	this.loops = [];
};

Session.prototype.constructor = Session;

Session.prototype.init = function( game ) {
	this.game = game;

	this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.world.setBounds(0, 0, CONFIG.world.x, CONFIG.world.y);
    this.game.physics.arcade.gravity.y = CONFIG.gravity.y;

    this.words = new WordFactory( this.game );
    this.input = new Input( game );

    var input = document.createElement("input");
    input.id = "type";
    input.type = "text";

    document.body.appendChild( input );
};

Session.prototype.update = function() {
	this.input.update();
};

Session.prototype.addPlayer = function( player ) {
	this.players.push( player );
};

Session.prototype.start = function( difficulty ) {

	switch( difficulty ) {
		case 'easy':
			this.begin( Phaser.Timer.SECOND*3, 10, 100 );
		    break;
		case 'normal':
			this.begin( Phaser.Timer.SECOND, 15, 100 );
		    break;
		case 'hard':
			this.begin( Phaser.Timer.SECOND/2, 10, 400 );
		    break;
		default:
			this.begin( Phaser.Timer.SECOND, 15, 200 );
	};

};

Session.prototype.begin = function( timeout, limit, gravity ) {
	var loop = game.time.events.loop(timeout, function() {
		this.game.physics.arcade.gravity.y = gravity
		this.words.setLimit( limit );
		this.words.spawnWord();
	}, this);

	this.loops.push( loop );
};

Session.prototype.processInput = function( text ) {

	this.words.forEach( function( item ) {
	    if( item && item.text === text ) {
	    	item.explode();
	    }
	}, this);

};

























