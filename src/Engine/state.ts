import {Engine} from "~/src/Engine/Engine";
import type {Player} from "~/src/Engine/Entity/Player";
import {TextureLoader} from "three";
import type {Entity} from "~/src/Engine/Entity/Entity";
import type {Environment} from "unenv";
import type {Effect} from "~/src/Engine/Effect/Effect";
import type {Props2D} from "~/src/Engine/Environment/Props2D";
import {Chunk} from "~/src/Engine/Environment/Chunk";

export class GlobalState{
    engine!:Engine
    player!:Player
    textureLoader = new TextureLoader();
    entities:Array<Entity>=[];
    environments:Array<Props2D>=[];
    effects:Array<Effect>=[];
    ground!:Chunk;

    constructor() {

    }

    addEntity(entity:Entity){
        this.entities.push(entity);
    }

    addEnvironments(environment:Props2D){
        this.environments.push(environment)
    }

    addEffect(effect:Effect){
        this.effects.push(effect)
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