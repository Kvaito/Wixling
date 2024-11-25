import {Group, Mesh, MeshBasicMaterial, PlaneGeometry, Sprite, SpriteMaterial, Texture} from "three";
import type {Environment} from "~/src/Engine/Environment/Environment";
import type {iThreePosition} from "~/src/Engine/GameObject";
import {$} from "~/src/Engine/state";

export type iProps2D = {
    texture: Texture;
    position: iThreePosition;
    name: string;
    rotation?: number;
    width: number;
    height: number;
    isSprite?: boolean,
}

export class Props2D implements Environment {
    rotation: number = 0;
    texture: Texture;
    position: iThreePosition;
    model = new Group();

    constructor(props: iProps2D) {
        this.texture = props.texture;
        this.position = props.position;
        if (props.rotation) this.rotation = props.rotation;
        this.model.name = props.name;

        let propsModel;
        if (props.isSprite) {
            const material = new SpriteMaterial({map: props.texture});
            propsModel = new Sprite(material);
            propsModel.center.set(0.5,0);
        } else {
            const planeGeometry = new PlaneGeometry(props.width, props.height);
            const planeMaterial = new MeshBasicMaterial({map: this.texture, transparent: true});
            propsModel = new Mesh(planeGeometry, planeMaterial);
            propsModel.rotateX(this.rotation);
        }
        if (propsModel) {
            this.model.add(propsModel);
            this.model.position.set(this.position.x, this.position.y, this.position.z);
        } else console.error('PROPS ' + props.name + ' CAN NOT BE ADDED')

    }

    destroy(): void {

    }

    setPosition(position: iThreePosition): void {
        this.position = position;
    }

    getPosition(): iThreePosition {
        return this.position;
    }

}