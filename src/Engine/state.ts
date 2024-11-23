import {Engine} from "~/src/Engine/Engine";
import type {Player} from "~/src/Engine/Entity/Player";
import {TextureLoader} from "three";

export class GlobalState{
    engine!:Engine
    player!:Player
    textureLoader = new TextureLoader();

    constructor() {

    }

}

export const $ = new GlobalState();

declare global {
    interface Window {
        app: GlobalState
    }
}

if (window) {
    window.app = $;
}