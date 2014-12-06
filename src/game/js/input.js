Input = function( game ) {
	this.game = game;
	this.enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
	this.wasDown = false;
};

Input.prototype.constructor = Input;

Input.prototype.update = function() {
	var type = document.getElementById("type");
	
	if( this.enter.isDown && type.value && type.value.length > 0 ) {
		if( CONFIG.debug.input ) {
			console.log( "Entered " + type.value );
		}
		type.value = null;
	}
};

