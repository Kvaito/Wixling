import {Entity} from "~/src/Engine/Entity/Entity";
import {$} from "~/src/Engine/state";
import {Vector3} from "three";
import {Effect} from "~/src/Engine/Effect/Effect";
import {footPrintCooldown} from "~/src/Constants/scene";
import type {iThreePosition} from "~/src/Engine/GameObject";


export class Player extends Entity {
    keysPressed = {
        w: false,
        a: false,
        s: false,
        d: false
    }
    isFootprintCooldown = false
    footPrintCooldownTimer: any;
    movement: Vector3 = new Vector3();

    eventListeners() {
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (!this.keysPressed.hasOwnProperty(event.key)) return;
            this.keysPressed[event.key] = true;
            this.updatePlayer()
        });
        document.addEventListener('keyup', (event: KeyboardEvent) => {
            if (!this.keysPressed.hasOwnProperty(event.key)) return;
            this.keysPressed[event.key] = false;
            this.updatePlayer()
        });
    }

    makeFootPrint(position: iThreePosition, futurePosition: iThreePosition) {
        const angleFunction = (oldPosition: [number, number], newPosition: [number, number]) => {
            const deltaX = newPosition[0] - oldPosition[0];
            const deltaY = newPosition[1] - oldPosition[1];
            return Math.atan2(deltaY, deltaX);
        }
        new Effect({
            textureName: 'Footprint',
            lifetime: 5000,
            width: 0.4,
            height: 0.4,
            isSprite: false,
            rotation: angleFunction([-position.z,-position.x], [-futurePosition.z,-futurePosition.x ]),
            position: position
        });
    }

    updatePlayer() {
        const oldPosition = this.position;
        const cameraDirection = new Vector3();
        $.engine.camera.camera.getWorldDirection(cameraDirection);
        this.movement = new Vector3();

        if (this.keysPressed.w) {
            this.movement.add(cameraDirection);
        }
        if (this.keysPressed.s) {
            this.movement.add(cameraDirection.clone().negate());
        }
        if (this.keysPressed.d) {
            const rightDirection = new Vector3();
            rightDirection.crossVectors(cameraDirection, new Vector3(0, 1, 0));
            this.movement.add(rightDirection);
        }
        if (this.keysPressed.a) {
            const rightDirection = new Vector3();
            rightDirection.crossVectors(cameraDirection, new Vector3(0, 1, 0)).negate();
            this.movement.add(rightDirection);
        }

        // Нормализуем и масштабируем, если хотя бы одна клавиша нажата
        if (this.movement.length() > 0) {
            this.movement.normalize().multiplyScalar(this.speed);
            this.move(this.movement);
            if (!this.isFootprintCooldown) {
                this.makeFootPrint(oldPosition, this.position);
                this.isFootprintCooldown = true;
                this.setFootPrintCooldown();
            }
        }
        $.engine.recalcRenderOrderForEnvironment();
        $.engine.recalcRenderOrderForEffects();
        $.engine.recalcRenderOrderForEntities();
        // $.engine.camera.followPlayer();
    }

    setFootPrintCooldown() {
        if (!this.footPrintCooldownTimer) {
            this.footPrintCooldownTimer = setTimeout(() => {
                this.isFootprintCooldown = false
                this.footPrintCooldownTimer = null;
            }, footPrintCooldown)
        }
    }
}