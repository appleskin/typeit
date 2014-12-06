/**
 *
 *     TYPE IT - LIKE A BOSS
 *
 */

var CONFIG      = new Config();
var SESSION     = new Session();
var STORAGE     = new Storage();
var UTIL        = new Util();
var WORD_LIST   = new WordList();

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
    SESSION.connect();
};

function update() {
    SESSION.update();
};