import {Group} from "three";

export interface GameObject {
    uuid:string,
    position:iThreePosition,
    height:number,
    width:number,
    setPosition: (position: iThreePosition) => void,
    model:Group
    destroy:()=>void,
    getPosition:()=>iThreePosition,
}

export type iThreePosition = { x: number; y: number,z:number };