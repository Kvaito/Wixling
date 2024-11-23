import type {GameObject, iThreePosition} from "~/src/Engine/GameObject";
import {Group, Sprite, SpriteMaterial, SRGBColorSpace} from "three";
import {$} from "~/src/Engine/state";

export type iPlayer={
    position:iThreePosition
}

export class Player implements GameObject {
    model=new Group();
    position: iThreePosition;

    constructor(props:iPlayer) {
        const playerTexture = $.textureLoader.load('/entity/player/Wensy.png');
        this.position = props.position;
        playerTexture.colorSpace = SRGBColorSpace
        const material = new SpriteMaterial({map:playerTexture});
        const sprite=new Sprite(material);
        console.log(material);
        sprite.scale.set(1,2,1);
        this.model.renderOrder=1000-this.model.position.distanceTo($.engine.camera.position);
        this.model.add(sprite);
        this.setPosition(props.position);
        $.engine.addGameObjectToScene(this.model);
    }

    setPosition(position: iThreePosition): void {
        this.model.position.set(position.x,position.y,position.z);
    }

    destroy(): void {
    }
}