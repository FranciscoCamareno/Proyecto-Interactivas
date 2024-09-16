let lastDirection = 'right'; //estado inicial de la dirección

export function moves() {
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
    
}