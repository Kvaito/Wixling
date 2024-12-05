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
    wrapping?: {
        wrapS: number,
        wrapT: number,
    },
    zIndexBuff?: number,
}

export class Props2D implements Environment {
    rotation: number = 0;
    texture: Texture;
    zIndexBuff: number;
    uuid: string;
    position: iThreePosition;
    model = new Group();
    height: number;
    width: number;

    constructor(props: iProps2D) {
        this.texture = $.textureLoader.load('/environment/' + props.textureName);
        this.texture.colorSpace = SRGBColorSpace
        this.position = props.position;
        this.height = props.height;
        this.width = props.width;
        if (props.rotation) this.rotation = props.rotation;
        this.model.name = props.name;
        this.zIndexBuff = props.zIndexBuff ?? 0;
        let propsModel;
        if (props.isSprite) {
            const material = new SpriteMaterial({map: this.texture});
            propsModel = new Sprite(material);
            propsModel.scale.set(this.width, this.height, 1);
            propsModel.center.set(0.5, 0);
        } else {
            const planeGeometry = new PlaneGeometry(this.width, this.height);
            const planeMaterial = new MeshBasicMaterial({map: this.texture, transparent: true});
            propsModel = new Mesh(planeGeometry, planeMaterial);
            propsModel.rotateY(this.rotation);
            propsModel.rotateX(-Math.PI / 2)
        }
        if (propsModel) {
            this.model.add(propsModel);
            this.model.position.set(this.position.x, this.position.y, this.position.z);
            $.engine.addGameObjectToScene(this.model);
        } else console.error('PROPS ' + props.name + ' CAN NOT BE ADDED')
        this.uuid = this.model.uuid;
    }

    destroy(): void {
        $.engine.deleteModelFromScene(this.model);
        if (this.model.userData.type == 'Item') $.deleteObjectFrom('items', this.uuid);
    }

    setPosition(position: iThreePosition): void {
        this.position = position;
    }

    getPosition(): iThreePosition {
        return this.position;
    }


}