import {Engine} from "~/src/Engine/Engine";
import type {Player} from "~/src/Engine/Entity/Player";
import {TextureLoader} from "three";
import type {Entity} from "~/src/Engine/Entity/Entity";
import type {Environment} from "unenv";
import type {Effect} from "~/src/Engine/Effect/Effect";
import type {Props2D} from "~/src/Engine/Environment/Props2D";
import {Chunk} from "~/src/Engine/Environment/Chunk";
import type {Item} from "~/src/Engine/Items/Item";
import type {EolBurrow} from "~/src/Engine/Environment/EolBurrow";

export class GlobalState {
    engine!: Engine
    player!: Player
    textureLoader = new TextureLoader();
    entities: Array<Entity> = [];
    environments: Array<Props2D|EolBurrow> = [];
    effects: Array<Effect> = [];
    items: Array<Item> = [];
    currentTime=0;
    ground!: Chunk;

    constructor() {

    }

    addEntity(entity: Entity) {
        this.entities.push(entity);
    }

    addEnvironments(environment: Props2D) {
        this.environments.push(environment)
    }

    addItem(item: Item) {
        this.items.push(item)
    }

    addEffect(effect: Effect) {
        this.effects.push(effect)
    }

    deleteObjectFrom(type:'items'|'entity'|'environment',objectUUID:string){
        let objectIndex
        if(type=='items'){
           objectIndex=this.items.findIndex(item=>item.uuid==objectUUID);
           this.items.splice(objectIndex,1);
        }
    }

    getObjectByUUID(uuid: string):Props2D|Item|Entity {
        return [...this.environments, ...this.items, ...this.entities].find(object => {
            return object.uuid == uuid;
        })
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