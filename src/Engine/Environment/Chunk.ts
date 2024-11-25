import {Props2D} from "~/src/Engine/Environment/Props2D";
import {SRGBColorSpace, Texture, TextureLoader} from "three";
import {$} from "~/src/Engine/state";
import {Eol} from "~/src/Engine/Entity/Eol";

export class Chunk extends Props2D {
    propsInside: Array<any> = []

    createEntities() {
        const entities = [{
            name: 'Eol',
            position: {x: 5, y: 0, z: -9},
        },
            {
                name: 'Eol',
                position: {x: -5, y: 0, z: 1},
            }];
        entities.forEach(entityData => {
            const eol = new Eol({
                height: 2.2,
                position: entityData.position,
                textureUrl: "/entity/Eol.png",
                width: 1.45,
                name: 'Eol'
            })
            $.addEntity(eol);
            eol.startLife();
        })
    }

    generateEnvironment() {
        //Разместить пять одинаковых спрайтов
        //В будущем где-нибудь хранить для каждого чанка его внутренние данные
        const positions = [
            {x: -5, y: 0, z: -1},
            {x: 4, y: 0, z: 2},
            {x: -1, y: 0, z: 3},
            {x: 3, y: 0, z: -1.5},
            {x: -1.2, y: 0, z: -2.5},
        ];
        const shardTexture = $.textureLoader.load('/environment/core_shard_1.png');
        shardTexture.colorSpace = SRGBColorSpace
        positions.forEach(position => {
            const props = new Props2D({
                texture: shardTexture,
                position: position,
                name: 'Shard',
                rotation: 0,
                height: 1,
                isSprite: true,
                width: 1,
            })
            props.model.renderOrder = 1000 - props.model.position.distanceTo($.engine.camera.camera.position)
            this.propsInside.push(props)
            $.addEnvironments(props);
        })
        this.propsInside.forEach(propsObject => {
            this.model.add(propsObject.model)
        })
        // console.log('Ground after generation',this.model)
    }

}