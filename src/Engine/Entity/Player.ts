import {Entity} from "~/src/Engine/Entity/Entity";
import {$} from "~/src/Engine/state";
import {Vector3} from "three";


export class Player extends Entity {
    keysPressed = {
        w: false,
        a: false,
        s: false,
        d: false
    }

    eventListeners() {
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if(!this.keysPressed.hasOwnProperty(event.key)) return;
            this.keysPressed[event.key] = true;
            this.updatePlayer()
        });
        document.addEventListener('keyup', (event: KeyboardEvent) => {
            if(!this.keysPressed.hasOwnProperty(event.key)) return;
            this.keysPressed[event.key] = false;
            this.updatePlayer()
        });
    }

    updatePlayer() {
        const cameraDirection = new Vector3();
        $.engine.camera.camera.getWorldDirection(cameraDirection);
        const movement = new Vector3();

        if (this.keysPressed.w) {
            movement.add(cameraDirection);
        }
        if (this.keysPressed.s) {
            movement.add(cameraDirection.clone().negate());
        }
        if (this.keysPressed.d) {
            const rightDirection = new Vector3();
            rightDirection.crossVectors(cameraDirection, new Vector3(0, 1, 0));
            movement.add(rightDirection);
        }
        if (this.keysPressed.a) {
            const rightDirection = new Vector3();
            rightDirection.crossVectors(cameraDirection, new Vector3(0, 1, 0)).negate();
            movement.add(rightDirection);
        }

        // Нормализуем и масштабируем, если хотя бы одна клавиша нажата
        if (movement.length() > 0) {
            movement.normalize().multiplyScalar(this.speed); // Вы можете изменить скорость, изменив множитель
            this.move(movement);
        }

        $.engine.camera.followPlayer();
    }
}