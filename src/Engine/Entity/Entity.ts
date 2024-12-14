import type {GameObject, iThreePosition} from "~/src/Engine/GameObject";
import {$} from "~/src/Engine/state";
import {Group, Sprite, SpriteMaterial, SRGBColorSpace, Vector3} from "three";

export type iEntity = {
    textureUrl: string,
    position: iThreePosition,
    height: number,
    width: number,
    name?: string,
    floatY?: number,
    speed?: number,
    data?:any,
    originalId?:number,
}

export class Entity implements GameObject {
    originalDataId=0;
    model = new Group();
    position: iThreePosition;
    height: number=0;
    width: number=0;
    uuid:string;
    data:any={};
    speed: number = 0.1;
    floatY: number;
    isMoving = false;
    velocity = new Vector3(0, 0, 0);

    constructor(props: iEntity) {
        this.position = props.position;
        if(props.hasOwnProperty('originalId')) this.originalDataId=props.originalId;
        if(props.hasOwnProperty('data')) this.data=props.data;
        if (props.speed) this.speed = props.speed
        this.setNewTexture(props.textureUrl,props.height,props.width)
        this.floatY = props.floatY ?? 0;
        this.setPosition(props.position);
        $.engine.addGameObjectToScene(this.model);
        this.uuid=this.model.uuid;
        this.model.renderOrder = 1000 - this.model.position.distanceTo($.engine.camera.camera.position);
        if (props.name) this.model.name = props.name;
    }

    destroy(): void {
    }

    move(direction: Vector3) {
        direction.y = 0;
        this.velocity.add(direction);
        this.model.position.add(this.velocity);
        this.position = {x: this.model.position.x, y: this.model.position.y, z: this.model.position.z};
        this.velocity.set(0, 0, 0); // Сбросить скорость после движения
    }

    setNewTexture(textureUrl: string,height:number,width:number): void {
        this.model.clear();
        const playerTexture = $.textureLoader.load(textureUrl);
        playerTexture.colorSpace = SRGBColorSpace;
        const material = new SpriteMaterial({map: playerTexture});
        const sprite = new Sprite(material);
        sprite.center.set(0.5, 0);
        sprite.scale.set(width,height, 1);
        this.height = height;
        this.width = width;
        this.model.add(sprite);
    }

    goTo(position: iThreePosition) {
        const targetPosition = new Vector3(position.x, position.y, position.z);
        if (this.isMoving) {
            this.model.position.copy(this.model.position);
            this.isMoving = false;
        }

        this.isMoving = true;
        const startPosition = this.model.position.clone();
        const distance = targetPosition.clone().sub(startPosition);
        const totalDistance = distance.length();
        const direction = distance.normalize();
        let traveledDistance = 0;

        const moveStep = () => {
            if (traveledDistance < totalDistance) {
                const step = Math.min(this.speed, totalDistance - traveledDistance);
                this.model.position.add(direction.clone().multiplyScalar(step));
                traveledDistance += step;
                this.model.renderOrder = 1000 - this.model.position.distanceTo($.engine.camera.camera.position);
                requestAnimationFrame(moveStep);
            } else {
                this.isMoving = false;
            }
        };

        moveStep();
    }

    setPosition(position: iThreePosition): void {
        this.model.position.set(position.x, position.y + this.floatY, position.z);
        this.position = {x: this.model.position.x, y: this.model.position.y, z: this.model.position.z};
    }

    getPosition(): iThreePosition {
        return this.position;
    }

    // Генерируем случайное расстояние в пределах заданного диапазона радиусов
    findRandomTargetPosition(minRadius: number, maxRadius: number) {
        const angle = Math.random() * 2 * Math.PI;
        const center = this.position;

        const distance = Math.random() * (maxRadius - minRadius) + minRadius;
        const x = center.x + Math.cos(angle) * distance;
        const z = center.z + Math.sin(angle) * distance;

        return {x: x, y: center.y, z: z};
    }
}