import {Props2D} from "~/src/Engine/Environment/Props2D";
import {SRGBColorSpace, Texture, TextureLoader} from "three";
import {$} from "~/src/Engine/state";
import {Eol} from "~/src/Engine/Entity/Eol";
import {CoreShard} from "~/src/Engine/Environment/CoreShard";

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
            }
        ];
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
        positions.forEach((position,index) => {
            const props = new CoreShard({
                textureName: 'core_shard_1',
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
            if([3,4].includes(index)) props.update();
        })
        this.propsInside.forEach(propsObject => {
            this.model.add(propsObject.model)
        })
        // console.log('Ground after generation',this.model)
    }

}