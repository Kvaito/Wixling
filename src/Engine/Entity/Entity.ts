import type {GameObject, iThreePosition} from "~/src/Engine/GameObject";
import {$} from "~/src/Engine/state";
import {Group, Sprite, SpriteMaterial, SRGBColorSpace, Vector3} from "three";

export type iEntity = {
    textureUrl: string,
    position: iThreePosition,
    height: number,
    width: number,
    name?:string,
}

export class Entity implements GameObject {
    model = new Group();
    position: iThreePosition;
    height: number;
    width: number;
    speed=0.1;
    velocity = new Vector3(0, 0, 0);

    constructor(props: iEntity) {
        const playerTexture = $.textureLoader.load(props.textureUrl);
        this.position = props.position;
        playerTexture.colorSpace = SRGBColorSpace
        const material = new SpriteMaterial({map: playerTexture});
        const sprite = new Sprite(material);
        this.height = props.height;
        this.width = props.width;
        sprite.scale.set(props.width, props.height, 1);
        this.model.add(sprite);
        this.setPosition(props.position);
        $.engine.addGameObjectToScene(this.model);
        this.model.renderOrder = 1000 - this.model.position.distanceTo($.engine.camera.camera.position);
        this.model.name='Player'
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

    setPosition(position: iThreePosition): void {
        this.model.position.set(position.x, position.y + this.height / 2, position.z);
        this.position = {x: this.model.position.x, y: this.model.position.y, z: this.model.position.z};
    }

    getPosition(): iThreePosition {
        return this.position;
    }

}