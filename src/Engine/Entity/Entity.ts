import type {GameObject, iThreePosition} from "~/src/Engine/GameObject";
import {$} from "~/src/Engine/state";
import {Group, Sprite, SpriteMaterial, SRGBColorSpace, Vector3} from "three";
import {Body,Cylinder} from "cannon-es";

export type iEntity = {
    textureUrl: string,
    position: iThreePosition,
    height: number,
    width: number,
    name?: string,
}

export class Entity implements GameObject {
    model = new Group();
    position: iThreePosition;
    height: number;
    width: number;
    speed:number=0.1;
    hitbox=new Body({mass:10});
    isMoving = false;
    velocity = new Vector3(0, 0, 0);

    constructor(props: iEntity) {
        const playerTexture = $.textureLoader.load(props.textureUrl);
        this.position = props.position;
        playerTexture.colorSpace = SRGBColorSpace
        const material = new SpriteMaterial({map: playerTexture});
        const sprite = new Sprite(material);
        sprite.center.set(0.5,0);
        this.height = props.height;
        this.width = props.width;
        sprite.scale.set(props.width, props.height, 1);
        this.model.add(sprite);
        $.engine.addGameObjectToScene(this.model);
        this.model.renderOrder = 1000 - this.model.position.distanceTo($.engine.camera.camera.position);
        if (props.name) this.model.name = props.name;
        const cylShape = new Cylinder(this.width/2,this.width/2,this.height,8)
        this.hitbox.addShape(cylShape);
        $.engine.addBodyToGravityWorld(this.hitbox);
        this.setPosition(props.position);
        this.syncWithHitbox();
    }

    destroy(): void {
    }

    move(direction: Vector3) {
        direction.y = 0;
        this.velocity.add(direction);
        const vector3=new Vector3(this.position.x,this.position.y,this.position.z);
        vector3.add(this.velocity);
        this.hitbox.position.set(vector3.x,vector3.y,vector3.z)
        this.velocity.set(0, 0, 0); // Сбросить скорость после движения
        this.syncWithHitbox();
    }

    syncWithHitbox(){
        const hitboxPos=this.hitbox.position.clone();
        this.model.position.set(hitboxPos.x,hitboxPos.y-this.height/2,hitboxPos.z);
        this.model.renderOrder = 1000 - this.model.position.distanceTo($.engine.camera.camera.position);
        this.position={x:hitboxPos.x, y:hitboxPos.y,z:hitboxPos.z};
    }

    goTo(position:iThreePosition){
        const targetPosition=new Vector3(position.x,position.y,position.z);
        if (this.isMoving) {
            this.model.position.copy(this.model.position);
            this.isMoving = false;
        }

        this.isMoving = true;
        const startPosition = this.hitbox.position.clone();
        const distance = targetPosition.clone().sub(startPosition);
        const totalDistance = distance.length();
        const direction = distance.normalize();
        let traveledDistance = 0;

        const moveStep = () => {
            if (traveledDistance < totalDistance) {
                const step = Math.min(this.speed, totalDistance - traveledDistance);
                const vector3=new Vector3(this.position.x,this.position.y,this.position.z);
                vector3.add(direction.clone().multiplyScalar(step));
                traveledDistance += step;
                this.hitbox.position.set(vector3.x,vector3.y,vector3.z)
                requestAnimationFrame(moveStep);
                this.syncWithHitbox();
            } else {
                this.isMoving = false;
            }
        };

        moveStep();
    }

    setPosition(position: iThreePosition): void {
        this.model.position.set(position.x, position.y, position.z);
        this.hitbox.position.set(position.x, position.y+this.height/2, position.z)
        this.position = {x: this.model.position.x, y: this.model.position.y, z: this.model.position.z};
    }

    getPosition(): iThreePosition {
        return this.position;
    }


}