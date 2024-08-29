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
            debug : true
        }
    }
};

var game = new Phaser.Game(config); //se pasan las variables de config al juego

function preload (){    
    this.load.image('background', 'assets/background/background01.png');
    this.load.image('platform', 'assets/background/plataforma2.png');
    this.load.spritesheet('character', 'assets/character/character_Walk.png', {frameWidth : 32, frameHeight : 32});
    this.load.spritesheet('character_reverse', 'assets/character/character_Walk_reverse.png', {frameWidth : 32, frameHeight : 32});
    this.load.spritesheet('character_idle', 'assets/character/character_idle.png', {frameWidth : 32, frameHeight : 32});
    this.load.spritesheet('character_idle_reverse', 'assets/character/character_idle_reverse.png', {frameWidth : 32, frameHeight : 32});
    this.load.spritesheet('character_jump', 'assets/character/character_Jump.png', {frameWidth : 32, frameHeight : 32});
    this.load.spritesheet('character_jump_reverse', 'assets/character/character_jump_reverse.png', {frameWidth : 32, frameHeight : 32});
}

function create () {
    //background
    this.add.image(400, 300, 'background'); //añade la imagen al canvas en la posición x:400, y:300 
    
    //platform
    platforms = this.physics.add.staticGroup(); //crea un grupo de plataformas estaticas
    platforms.create(400, 490, 'platform').setScale(1).refreshBody(); //crea una plataforma en la posición x:400, y:568, escala:1, y la refresca
    
    //player
    player = this.physics.add.sprite(50, 380, 'character_idle'); // usa la animación de idle por defecto y crea un personaje en la ubicación x:400, y:568
    player.setCollideWorldBounds(true); //para que el personaje colisione con el mundo
    player.setBounce(0.2); //para que el personaje rebote en la plataforma
    player.setVelocityX(0);
    //console.log('Posición inicial:', player.x, player.y);
    //console.log('Velocidad inicial:', player.body.velocity.x, player.body.velocity.y);

    //animaciones
    this.anims.create({
        key : 'left',
        frames : this.anims.generateFrameNumbers('character_reverse', {start : 0, end : 5}),
        frameRate : 10,
        repeat : -1
    });

    this.anims.create({
        key : 'right',
        frames : this.anims.generateFrameNumbers('character', {start : 5, end : 0}),
        frameRate : 10,
        repeat : -1
    });

    this.anims.create({
        key : 'idle',
        frames : this.anims.generateFrameNumbers('character_idle', {start : 0, end : 3}),
        frameRate : 10,
        repeat : -1
    });

    this.anims.create({
        key : 'idle_reverse',
        frames : this.anims.generateFrameNumbers('character_idle_reverse', {start : 3, end : 0}),
        frameRate : 10,
        repeat : -1
    });

    this.anims.create({
        key : 'jump',
        frames : this.anims.generateFrameNumbers('character_jump', {start : 3, end : 5}),
        frameRate : 5,
        repeat : -1
    });

    this.anims.create({
        key : 'jump_reverse',
        frames : this.anims.generateFrameNumbers('character_jump_reverse', {start : 4, end : 2}),
        frameRate : 5,
        repeat : -1
    });

    
    this.physics.add.collider(player, platforms);
    cursor = this.input.keyboard.createCursorKeys();
}

let lastDirection = 'right'; //estado inicial de la dirección

function update() {
    if (cursor.left.isDown) {
        player.setVelocityX(-150);
        if (player.body.touching.down) {
            player.anims.play('left', true);
        }
        lastDirection = 'left'; //actualiza la última dirección
    } 
    else if (cursor.right.isDown) {
        player.setVelocityX(150);
        if (player.body.touching.down) {
            player.anims.play('right', true);
        }
        lastDirection = 'right';
    } else {
        player.setVelocityX(0);
        //reproduce la animación de reposo según la última dirección
        if (player.body.touching.down) {
            if (lastDirection === 'left') {
                player.anims.play('idle_reverse', true);
            } else {
                player.anims.play('idle', true);
            }
        }
    }

    //salto
    if (cursor.space.isDown && player.body.touching.down) {
        player.setVelocityY(-140);  
        if (lastDirection === 'left') {
            player.anims.play('jump_reverse', true);
        } else {
            player.anims.play('jump', true);
        } 
    } 
    
}