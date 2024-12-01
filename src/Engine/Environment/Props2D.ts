import {
    Group,
    Mesh,
    MeshBasicMaterial,
    PlaneGeometry,
    RepeatWrapping,
    Sprite,
    SpriteMaterial,
    SRGBColorSpace,
    Texture
} from "three";
import type {Environment} from "~/src/Engine/Environment/Environment";
import type {iThreePosition} from "~/src/Engine/GameObject";
import {$} from "~/src/Engine/state";
import {chunkSize} from "~/src/Constants/gameConstants";

export type iProps2D = {
    textureName: string;
    position: iThreePosition;
    name: string;
    rotation?: number;
    width: number;
    height: number;
    isSprite?: boolean,
    wrapping?:{
        wrapS:number,
        wrapT:number,
    },
    zIndexBuff?:number,
}

export class Props2D implements Environment {
    rotation: number = 0;
    texture: Texture;
    zIndexBuff:number
    position: iThreePosition;
    model = new Group();

    constructor(props: iProps2D) {
        this.texture = $.textureLoader.load('/environment/' + props.textureName);
        this.texture.colorSpace = SRGBColorSpace
        this.position = props.position;
        if (props.rotation) this.rotation = props.rotation;
        this.model.name = props.name;
        this.zIndexBuff=props.zIndexBuff??0;
        let propsModel;
        if (props.isSprite) {
            const material = new SpriteMaterial({map: this.texture});
            propsModel = new Sprite(material);
            propsModel.scale.set(props.width, props.height,1 );
            propsModel.center.set(0.5, 0);
        } else {
            const planeGeometry = new PlaneGeometry(props.width, props.height);
            const planeMaterial = new MeshBasicMaterial({map: this.texture, transparent: true});
            propsModel = new Mesh(planeGeometry, planeMaterial);
            propsModel.rotateY(this.rotation);
            propsModel.rotateX(-Math.PI/2)
        }
        if (propsModel) {
            this.model.add(propsModel);
            this.model.position.set(this.position.x, this.position.y, this.position.z);
            $.engine.addGameObjectToScene(this.model);
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