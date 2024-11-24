import {Group} from "three";

export interface GameObject {
    position:iThreePosition,
    setPosition: (position: iThreePosition) => void,
    model:Group
    destroy:()=>void,
}

export type iThreePosition = { x: number; y: number,z:number };