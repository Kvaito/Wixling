import {Entity} from "~/src/Engine/Entity/Entity";
import type {iThreePosition} from "~/src/Engine/GameObject";

export const EolLightClassProps={
    textureUrl: '/entity/LightRound.png',
    name:'EolLight',
    position: { x: 0, y: 0,z:0 },
    height: 1,
    width: 1,
    speed: 0,
    floatY:0.001,
    data:{
        isPlane:true,
        autoAdd:false,
    }
}

export class EolLight extends Entity{
    checkEvaporate(){

    }
}