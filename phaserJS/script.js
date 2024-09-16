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
var score = 0;


function displayScore(x, y, score) {
    const scoreString = score.toString(); // Convierte el puntaje a una cadena
    const digits = scoreString.split(''); // Divide la cadena en dígitos individuales

    digits.forEach((digit, index) => {
        this.add.image(x + index * 18, y, digit); // Coloca cada dígito en pantalla
    });
}


function preload (){    
    const scoreNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    scoreNumbers.forEach((num, index) => {
        this.load.image(num, `assets/items/score/score0${index}.png`);
    });

    this.load.image('background', 'assets/background/background01.png');
    this.load.image('platform01', 'assets/background/platform01.png');
    this.load.image('platform02', 'assets/background/platform02.png');
    this.load.image('platform03', 'assets/background/platform03.png');
    this.load.image('platform03_2', 'assets/background/platform03_2.png');
    this.load.image('platform04', 'assets/background/platform04.png');
    this.load.image('coin', 'assets/items/coin.png');
    this.load.spritesheet('character', 'assets/character/character_Walk.png', {frameWidth : 32, frameHeight : 32});
    this.load.spritesheet('character_reverse', 'assets/character/character_Walk_reverse.png', {frameWidth : 32, frameHeight : 32});
    this.load.spritesheet('character_idle', 'assets/character/character_idle.png', {frameWidth : 32, frameHeight : 32});
    this.load.spritesheet('character_idle_reverse', 'assets/character/character_idle_reverse.png', {frameWidth : 32, frameHeight : 32});
    this.load.spritesheet('character_jump', 'assets/character/character_Jump.png', {frameWidth : 32, frameHeight : 32});
    this.load.spritesheet('character_jump_reverse', 'assets/character/character_jump_reverse.png', {frameWidth : 32, frameHeight : 32});
    this.load.spritesheet('enemy', 'assets/enemies/enemy_sprite.png', {frameWidth : 24, frameHeight : 24});
}

function create () {
    //background
    this.add.image(400, 300, 'background'); //añade la imagen al canvas en la posición x:400, y:300 
    
    //platform
    platforms = this.physics.add.staticGroup(); //crea un grupo de plataformas estaticas
    platforms.create(102, 479, 'platform03').setScale(0.9).refreshBody(); //crea una plataforma en la posición x:400, y:568, escala:1, y la refresca
    platforms.create(481, 479, 'platform03_2').setScale(0.9).refreshBody();
    platforms.create(319, 515, 'platform01').setScale(0.9).refreshBody();
    platforms.create(650, 462, 'platform04').setScale(0.9).refreshBody();
    [ [237, 497], [401, 497] ].forEach(([x, y]) => 
        platforms.create(x, y, 'platform02').setScale(0.9).refreshBody()
    );
    

    //coins
    coins = this.physics.add.staticGroup();
    [ [350, 400], [250, 300] ].forEach(([x, y]) => 
        coins.create(x, y, 'coin').setScale(1).refreshBody()
    );
    
    
    //player
    player = this.physics.add.sprite(50, 380, 'character_idle'); // usa la animación de idle por defecto y crea un personaje en la ubicación x:400, y:568
    player.setCollideWorldBounds(true); //para que el personaje colisione con el mundo
    player.setBounce(0.2); //para que el personaje rebote en la plataforma
    player.setVelocityX(0);
    //console.log('Posición inicial:', player.x, player.y);
    //console.log('Velocidad inicial:', player.body.velocity.x, player.body.velocity.y);

    //enemigos
    enemy = this.physics.add.sprite(670, 422, 'enemy');
    enemy.setCollideWorldBounds(true);
    moveEnemy(enemy, 90, 580, 700);

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

    this.anims.create({
        key : 'enemy',
        frames : this.anims.generateFrameNumbers('enemy', {start : 0, end : 1}),
        frameRate : 10,
        repeat : -1
    });

    
    this.physics.add.collider(player, platforms);
    this.physics.add.overlap(player, coins, collectCoin, null, this);
    this.physics.add.collider(enemy, platforms);
    cursor = this.input.keyboard.createCursorKeys();

    // Actualiza el puntaje en la pantalla
    displayScore.call(this, 16, 16, score);
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
        player.setVelocityY(-160);  
        if (lastDirection === 'left') {
            player.anims.play('jump_reverse', true);
        } else {
            player.anims.play('jump', true);
        } 
    }

    //enemigos
    enemy.anims.play('enemy', true);
    enemy.update();
}

//función para detectar colisiones entre el personaje y las monedas
function collectCoin(player, coin) {
    coin.disableBody(true, true);
    score += 5;
    displayScore.call(this, 16, 16, score); //actualiza el puntaje en la pantalla
}

function moveEnemy(enemy, speed, minX, maxX) {
    enemy.setVelocityX(speed);
    // Función para invertir la dirección cuando el enemigo alcanza un límite
    enemy.update = function() {
        // Si el enemigo llega al borde izquierdo
        if (enemy.x <= minX) {
            enemy.setVelocityX(speed); // Mover a la derecha
            enemy.anims.play('enemy', true);
            enemy.flipX = true; // Ajustar el sprite si es necesario (opcional)
        }

        // Si el enemigo llega al borde derecho
        if (enemy.x >= maxX) {
            enemy.setVelocityX(-speed); // Mover a la izquierda
            enemy.anims.play('enemy', true);
            enemy.flipX = false; // Voltear el sprite horizontalmente (opcional)
        }
    };
}