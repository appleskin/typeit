Firebase_client = function( player, lobbyId, host ) {
    if( !host ) {
    	alert( "Joining Game : " + lobbyId );
    } else {
    	alert( "Starting Game : " + window.location.origin + '?lobbyId=' + lobbyId );
    }

    var lobbyURL = CONFIG.app.firebase + lobbyId;
    this.lobby = new Firebase( lobbyURL );

	this.players = this.lobby.child("players");
	this.words   = this.lobby.child("words");

	// Start a new lobby for your own game
	if( host ) {
		this.players.set(null);
		this.words.set(null);
	} else {
		// If you are not host you must listen
		// for words being added to the world
		this.words.on("child_added", function( snapshot ) {
			var word = snapshot.val();
			SESSION.insertWord( word.x, word.y, word.text );
		});
	}

	this.players.child(player.pid).set({
		id: player.pid,
		score: player.score
	});

};

Firebase_client.prototype.constructor = Firebase_client;

Firebase_client.prototype.insertWord = function( x, y, text ) {
	this.words.push({
		x: x,
		y: y,
		text: text
	});
};