Firebase_client = function( player, lobbyId, host ) {
    if( !host ) {
    	document.getElementById("lobby").value = "In lobby: " + lobbyId;
    	document.getElementById("lobby").disabled = "disabled";
    } else {
    	document.getElementById("lobby").value = window.location.origin + '?lobbyId=' + lobbyId;
    }

    this.lobbyURL = CONFIG.app.firebase + lobbyId;
    this.lobby = new Firebase( this.lobbyURL );

	this.players 	= this.lobby.child("players");
	this.words   	= this.lobby.child("words");
	this.settings 	= this.lobby.child("settings");

	// Start a new lobby for your own game
	if( host ) {
		this.players.set(null);
		this.words.set(null);
		this.settings.set(null);
	} else {
		// If you are not host you must listen
		// for words being added to the world
		this.words.on("child_added", function( snapshot ) {
			var word = snapshot.val();
			SESSION.insertWord( word.x, word.y, word.text, word.id );
		});
	}

	this.words.on("child_removed", function( snapshot ) {
		var word = snapshot.val();
		SESSION.removeWord( word.wid );
	});

	this.players.child(player.pid).set({
		id: player.pid,
		score: player.score
	});

};

Firebase_client.prototype.constructor = Firebase_client;

Firebase_client.prototype.insertWord = function( x, y, text, wid ) {
	this.words.child(wid).set({
		x: x,
		y: y,
		text: text,
		wid: wid
	});
};

Firebase_client.prototype.nukeWord = function( wid ) {
	this.words.child(wid).set(null);
};

Firebase_client.prototype.setSetting = function( key, value ) {
	this.settings.child(key).set({
		value:value
	});
};

Firebase_client.prototype.syncSetting = function( key ) {
	var ref = new Firebase(this.lobbyURL + '/settings/' + key);
	ref.on('value', function( snapshot ) {
		if( key === 'gravity' ) {
			SESSION.game.physics.arcade.gravity.y = snapshot.val().value;
		}
	}, function( error ) {
		console.error( error );
	});
};