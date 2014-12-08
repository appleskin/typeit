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
var game = new Phaser.Game( CONFIG.world.x, CONFIG.world.y, Phaser.AUTO, 'TYPE IT', { preload: preload, create: create, update: update, render: render } );

function preload() {
    game.load.image( 'bg',              'img/bg.png'                );
    game.load.image( 'player',          'img/player.png'            );
    game.load.image( 'fire_particle',   'img/fire_particle.png'     );
    game.load.image( 'smoke_particle',  'img/smoke_particle.png'    );
    
    game.load.spritesheet( 'missile',   'img/missileSpriteSheet.png',  150, 30, 4  );
    game.load.spritesheet( 'missile_2', 'img/missile2SpriteSheet.png', 150, 30, 4  );
};

function create() {
    SESSION.init( game );
    SESSION.connect();
};

function update() {
    SESSION.update();
};

function render() {
    SESSION.drawHud();
};