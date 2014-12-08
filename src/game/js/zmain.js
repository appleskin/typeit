/**
 *
 *     TYPE IT - REAL GOOD
 *
 */

var UTIL        = new Util();
var CONFIG      = new Config();
var SESSION     = new Session();
var STORAGE     = new Storage();
var WORD_LIST   = new WordList();

/*
 *
 *      PHASER TIME
 *
 */
var game = new Phaser.Game( CONFIG.world.x, CONFIG.world.y, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render } );

function preload() {
    game.load.image( 'bg',          'img/bg.png'            );
    game.load.image( 'player',      'img/player.png'        );
    game.load.image( 'missile',     'img/missile.png'       );
    game.load.image( 'missile_2',   'img/missile2.png'      );
    game.load.image( 'asteroid_0',  'img/asteroid_1.png'    );
    game.load.image( 'asteroid_1',  'img/asteroid_2.png'    );
    game.load.image( 'asteroid_2',  'img/asteroid_3.png'    );
};
    
function create(){
    SESSION.init( game );
    SESSION.connect();
};

function update() {
    SESSION.update();
};

function render() {
    SESSION.drawHud();
};