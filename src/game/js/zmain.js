/**
 *
 *     TYPE IT
 *
 */

 

var CONFIG  = new Config();
var UTIL    = new Util();

var SESSION = new Session();

/*
 *
 *      PHASER TIME
 *
 */
var game = new Phaser.Game( CONFIG.world.x, CONFIG.world.y, Phaser.CANVAS, '', { preload: preload, create: create, update: update } );

function preload() {
    game.load.image( 'box', 'img/red_box.png' );
    game.load.image( 'asteroid_0', 'img/asteroid_1.png' );
    game.load.image( 'asteroid_1', 'img/asteroid_2.png' );
    game.load.image( 'asteroid_2', 'img/asteroid_3.png' );
};
    
function create(){
    SESSION.init( game );
    SESSION.addPlayer( new Player( game, (CONFIG.world.x/2)-25, CONFIG.world.y-25 ) );

    SESSION.start( 'normal' );
};

function update() {
    SESSION.update();
};