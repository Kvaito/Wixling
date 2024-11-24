import type {GameObject, iThreePosition} from "~/src/Engine/GameObject";
import {Group, Mesh, MeshBasicMaterial, PlaneGeometry, Sprite, SpriteMaterial, SRGBColorSpace} from "three";
import {$} from "~/src/Engine/state";

export type iEffect = {
    lifetime?: number,
    position: iThreePosition,
    textureName: string,
    isSprite?: boolean,
    rotation?: number,
    width:number,
    height:number,
}

export class Effect implements GameObject {
    model = new Group;
    position: iThreePosition;

    constructor(props: iEffect) {
        this.position = props.position;
        const effectTexture = $.textureLoader.load('/effects/' + props.textureName + '.png');
        effectTexture.colorSpace = SRGBColorSpace
        let propsModel;
        if (props.isSprite) {
            const material = new SpriteMaterial({map: effectTexture});
            propsModel = new Sprite(material);
        } else {
            const planeGeometry = new PlaneGeometry(props.width, props.height);
            const planeMaterial = new MeshBasicMaterial({map: effectTexture, transparent: true});
            propsModel = new Mesh(planeGeometry, planeMaterial);
            propsModel.rotateX(-Math.PI/2);
        }
        if (props.lifetime) {
            setTimeout(() => {
                this.destroy()
            }, props.lifetime)
        }
        this.model.position.set(props.position.x, 0.001, props.position.z);
        this.model.renderOrder=1000-this.model.position.distanceTo($.engine.camera.camera.position)
        this.model.add(propsModel);
        $.engine.addGameObjectToScene(this.model);
        $.addEffect(this);
    }


    destroy(): void {
        $.engine.deleteModelFromScene(this.model);
    }

    getPosition(): iThreePosition {
        return this.position;
    }

    setPosition(position: iThreePosition): void {
    }


}