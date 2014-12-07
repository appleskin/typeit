Firebase_client = function( player, lobbyId, host ) {
    if( !host ) {
    	document.getElementById("lobby").value = "In lobby: " + lobbyId;
    	document.getElementById("lobby").disabled = "disabled";
    } else {
    	if( SESSION.mode === 'deathmatch' ) {
    		document.getElementById("lobby").value = window.location.origin + '?lobbyId=' + lobbyId + '&mode=deathmatch';
    	} else {
    		document.getElementById("lobby").value = window.location.origin + '?lobbyId=' + lobbyId;
    	}
    }

    this.lobbyURL = CONFIG.app.firebase + lobbyId;
    this.lobby = new Firebase( this.lobbyURL );

	this.players 	= this.lobby.child("players");
	this.words   	= this.lobby.child("words");
	this.settings 	= this.lobby.child("settings");
	this.missiles   = this.lobby.child("missles");

	// Start a new lobby for your own game
	if( host ) {
		this.players.set(null);
		this.settings.set(null);
		this.words.set(null);
		this.missiles.set(null);
	}

	// Add yourself to network
	this.players.child(player.pid).set({
		pid: player.pid,
		score: player.score
	});
};

Firebase_client.prototype.enableClassicEvents = function() {
	if( !SESSION.host ) {
		this.words.on("child_added", function( snapshot, prevName ) {
			var word = snapshot.val();
			SESSION.insertWord( word.x, word.y, word.text, word.wid );
		});
	}

	this.words.on("child_removed", function( snapshot ) {
		var word = snapshot.val();
		SESSION.removeWord( word.wid );
	});

	this.players.on("child_changed", function( snapshot, prevName ) {
		SESSION.addOrUpdateNetworkPlayer( snapshot.val() );
	});

	this.players.on("child_added", function( snapshot, prevName ) {
		SESSION.addOrUpdateNetworkPlayer( snapshot.val() );
	});
};

Firebase_client.prototype.enableDeathmatchEvents = function() {
	// if( !SESSION.host ) {
	// 	this.words.on("child_added", function( snapshot, prevName ) {
	// 		var word = snapshot.val();
	// 		SESSION.insertWord( word.x, word.y, word.text, word.wid );
	// 	});
	// }

	// this.words.on("child_removed", function( snapshot ) {
	// 	var word = snapshot.val();
	// 	SESSION.removeWord( word.wid );
	// });

	this.players.on("child_changed", function( snapshot, prevName ) {
		SESSION.addOrUpdateNetworkPlayer( snapshot.val() );
	});

	this.players.on("child_added", function( snapshot, prevName ) {
		SESSION.addOrUpdateNetworkPlayer( snapshot.val() );
	});
};

Firebase_client.prototype.setPlayerPoints = function( player ) {
	this.players.child(player.pid).set({
		pid: player.pid,
		score: player.score
	});
};

Firebase_client.prototype.constructor = Firebase_client;

Firebase_client.prototype.insertWord = function( x, y, text, wid ) {
	if( SESSION.host ) {
		this.words.child(wid).set({
			x: x,
			y: y,
			text: text,
			wid: wid
		});
	}
};

Firebase_client.prototype.nukeWord = function( wid ) {
	try {
		this.words.child(wid).set(null);
	} catch( ex ) {
		console.error( ex );
	}
};

Firebase_client.prototype.setSetting = function( key, value ) {
	this.settings.child(key).set({
		value:value
	});
};