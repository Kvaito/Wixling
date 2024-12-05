import {Entity} from "~/src/Engine/Entity/Entity";
import {$} from "~/src/Engine/state";
import {Vector3} from "three";
import {Effect} from "~/src/Engine/Effect/Effect";
import {footPrintCooldown} from "~/src/Constants/scene";
import type {iThreePosition} from "~/src/Engine/GameObject";
import {getClickedObject} from "~/src/libs/makeRaycastFromCamera";
import {usePlayerStore} from "~/src/stores/storePlayer";
import {Item} from "~/src/Engine/Items/Item";


export class Player extends Entity {
    keysPressed = {
        KeyW: false,
        KeyA: false,
        KeyS: false,
        KeyD: false
    }
    isFootprintCooldown = false
    footPrintCooldownTimer: any;
    movement: Vector3 = new Vector3();
    reachRadius=2;

    eventListeners() {
        console.log('listeners activated')
        document.addEventListener('click', (event: MouseEvent) => {
            //Вызвать функцию проверки, на что кликнули. Вернёт объект
            const clickedModel = getClickedObject(event);
            if (clickedModel && clickedModel.userData.type == 'Item') this.tryToTakeItem(clickedModel);
        });
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (!this.keysPressed.hasOwnProperty(event.code)) return;
            this.keysPressed[event.code] = true;
            this.updatePlayer()
        });
        document.addEventListener('keyup', (event: KeyboardEvent) => {
            if (!this.keysPressed.hasOwnProperty(event.code)) return;
            this.keysPressed[event.code] = false;
            this.updatePlayer()
        });
    }

    tryToTakeItem(itemModel) {
        //Проверить дистанцию до предмета. Если Венси дотягивается, добавляем
        console.log('can i take?',itemModel.position,this.model.position,this.reachRadius)
        if(itemModel.position.distanceTo(this.model.position)>this.reachRadius) return;
        const itemObject=$.getObjectByUUID(itemModel.uuid);
        usePlayerStore().addToInventory(itemObject);
        if (itemObject instanceof Item) {
            itemObject.taken()
        }
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
            rotation: angleFunction([-position.z, -position.x], [-futurePosition.z, -futurePosition.x]),
            position: position
        });
    }


    updatePlayer() {
        const oldPosition = this.position;
        const cameraDirection = new Vector3();
        $.engine.camera.camera.getWorldDirection(cameraDirection);
        this.movement = new Vector3();

        if (this.keysPressed.KeyW) {
            this.movement.add(cameraDirection);
        }
        if (this.keysPressed.KeyS) {
            this.movement.add(cameraDirection.clone().negate());
        }
        if (this.keysPressed.KeyD) {
            const rightDirection = new Vector3();
            rightDirection.crossVectors(cameraDirection, new Vector3(0, 1, 0));
            this.movement.add(rightDirection);
        }
        if (this.keysPressed.KeyA) {
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
        $.engine.camera.followPlayer();
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