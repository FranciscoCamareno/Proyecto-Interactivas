
//const Phaser = require('phaser'); //carga el motor de desarrollo de juegos Phaser

var config = { //objeto config, determina las propiedades del juego
    type : Phaser.AUTO, //indica que usar para mostar el juego (CANVAS, WebGL, AUTO)
    width : 800,        //anchura en la que se muestra el juego
    height : 600,       //altura en la que se muestra el juego
    scene : {
        preload : preload,
        create : create,
        update : update
    },
    physics : {
        default : 'arcade', //tipo de fisica
        arcade : {
            gravity : {y : 300}, //gravedad
            debug : false
        }
    }
};

var game = new Phaser.Game(config); //se pasan las variables de config al juego

function preload (){    
    this.load.image('background', 'assets/background/background01.png');
    this.load.image('platform', 'assets/background/plataforma.png');
    this.load.image('character', 'assets/character/character_walking.png');
}

function create () {
    this.add.image(400, 300, 'background'); //añade la imagen al canvas en la posición x:400, y:300 
    platforms = this.physics.add.staticGroup(); //crea un grupo de plataformas
    platforms.create(400, 300, 'platform').setScale(1).refreshBody(); //crea una plataforma en la posición x:400, y:568, escala:2, y refresca su cuerpo
    
}

function update () {}