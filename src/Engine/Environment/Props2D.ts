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
import {
    Plane,Body,Cylinder
} from 'cannon-es'
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
    hitbox=new Body({mass:0});
    model = new Group();

    constructor(props: iProps2D) {
        this.texture = $.textureLoader.load('/environment/' + props.textureName + '.png');
        this.texture.colorSpace = SRGBColorSpace
        this.position = props.position;
        if (props.rotation) this.rotation = props.rotation;
        this.model.name = props.name;
        this.zIndexBuff=props.zIndexBuff??0;
        let propsModel;
        if (props.isSprite) {
            const material = new SpriteMaterial({map: this.texture});
            propsModel = new Sprite(material);
            propsModel.center.set(0.5, 0);
            const cylShape = new Cylinder()
            this.hitbox.addShape(cylShape);
        } else {
            const planeGeometry = new PlaneGeometry(props.width, props.height);
            if(props.wrapping){
                this.texture.wrapS = RepeatWrapping; // Повтор по горизонтали
                this.texture.wrapT = RepeatWrapping; // Повтор по вертикали
                this.texture.repeat.set(100, 100);
            }
            const planeMaterial = new MeshBasicMaterial({map: this.texture, transparent: true});
            propsModel = new Mesh(planeGeometry, planeMaterial);
            propsModel.rotateY(this.rotation);
            propsModel.rotateX(-Math.PI/2);
            const planeShape = new Plane()
            this.hitbox.addShape(planeShape);
            this.hitbox.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        }
        if (propsModel) {
            this.model.add(propsModel);
            $.engine.addBodyToGravityWorld(this.hitbox)
            this.hitbox.position.set(this.position.x, this.position.y, this.position.z);
            this.syncWithHitbox();
        } else console.error('PROPS ' + props.name + ' CAN NOT BE ADDED')

    }

    destroy(): void {

    }

    syncWithHitbox(){
        const hitboxPos=this.hitbox.position;
        this.model.position.set(hitboxPos.x, hitboxPos.y, hitboxPos.z);
        this.position={x:hitboxPos.x,y:hitboxPos.y,z:hitboxPos.z}
    }

    setPosition(position: iThreePosition): void {
        this.position = position;
    }

    getPosition(): iThreePosition {
        return this.position;
    }

}