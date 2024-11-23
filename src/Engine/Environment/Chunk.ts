import {Props2D} from "~/src/Engine/Environment/Props2D";
import {Texture, TextureLoader} from "three";
import {$} from "~/src/Engine/state.ts";

export class Chunk extends Props2D {
    propsInside: Array<any> = []

    generateEnvironment() {
        //Разместить пять одинаковых спрайтов
        //В будущем где-нибудь хранить для каждого чанка его внутренние данные
        const positions = [
            {x: 1, y: 0, z: 1},
            {x: 2, y: 0, z: 2},
            {x: -1, y: 0, z: 1},
            {x: 1, y: 0, z: -1},
            {x: -1, y: 0, z: -2.5},
        ];
        positions.forEach(position => {
            const textureLoader = new TextureLoader();
            const shardTexture = textureLoader.load('/environment/core_shard_1.png');
            const props=new Props2D({
                texture: shardTexture,
                position: position,
                name: 'Shard',
                rotation: 0,
                height:1,
                isSprite:true,
                width:1,
            })
            props.model.renderOrder=1000-props.model.position.distanceTo($.engine.camera.position)
            this.propsInside.push(props)
        })
        this.propsInside.forEach(propsObject => {
            this.model.add(propsObject.model)
        })
        console.log('Ground after generation',this.model)
    }

}