import {Props2D} from "~/src/Engine/Environment/Props2D";
import {
    SRGBColorSpace,
    Texture,
    TextureLoader,
    Group,
    RepeatWrapping,
    PlaneGeometry,
    MeshBasicMaterial,
    Mesh
} from "three";
import {$} from "~/src/Engine/state";
import {Eol} from "~/src/Engine/Entity/Eol";
import {CoreShard} from "~/src/Engine/Environment/CoreShard";
import type {iChunkData, iChunkEntityData, iChunkItemsData, iChunkPropsData} from "~/src/Constants/WorldData";
import type {iThreePosition} from "~/src/Engine/GameObject";
import {chunkSize} from "~/src/Constants/gameConstants";
import {getBiomeData} from "~/src/Constants/biomes";
import {getWixDataById} from "~/src/Constants/wixes";
import {Liquice} from "~/src/Engine/Entity/Liquice";
import {getEnvironmentById} from "~/src/Constants/environments";
import {getItemById} from "~/src/Constants/items";
import {Item} from "~/src/Engine/Items/Item";

export class Chunk {
    propsInside: Array<any> = []
    chunkGroup = new Group();
    position: iThreePosition;
    biome_id = 0
    entities: Array<iChunkEntityData> = []
    props: Array<iChunkPropsData> = []
    items:Array<iChunkItemsData>=[]

    constructor(props: iChunkData) {
        this.entities = props.entities;
        this.props = props.props;
        this.items=props.items;
        this.biome_id = props.biome_id;
        const biomeData = getBiomeData(this.biome_id);
        this.position = {x: props.position.x * chunkSize, y: 0, z: props.position.z * chunkSize}
        const texture = $.textureLoader.load(biomeData.groundTexture);
        texture.colorSpace = SRGBColorSpace
        texture.wrapS = RepeatWrapping; // Повтор по горизонтали
        texture.wrapT = RepeatWrapping; // Повтор по вертикали
        texture.repeat.set(biomeData.groundWrapping, biomeData.groundWrapping);
        const planeGeometry = new PlaneGeometry(chunkSize, chunkSize);
        const planeMaterial = new MeshBasicMaterial({map: texture, transparent: true});
        const groundModel = new Mesh(planeGeometry, planeMaterial);
        groundModel.rotateX(-Math.PI / 2);
        groundModel.name = 'Ground'
        groundModel.position.set(chunkSize / 2, 0, chunkSize / 2);
        this.chunkGroup.position.set(this.position.x, this.position.y, this.position.z);
        this.chunkGroup.add(groundModel);
        this.chunkGroup.name = 'Chunk group'
        this.initializeChunk();
        $.engine.addGameObjectToScene(this.chunkGroup);
    }

    initializeChunk() {
        this.createEntities(this.entities);
        this.generateEnvironment(this.props);
        this.makeItems(this.items);
    }

    createEntities(entitiesData: Array<iChunkEntityData>) {
        entitiesData.forEach(entityData => {
            const wixData = getWixDataById(entityData.entity_id)
            let entity;
            const wixProps = {
                height: wixData.height,
                position: this.getGlobalPos({...entityData.position}),
                textureUrl: "/entity/" + wixData.name + ".png",
                width: wixData.width,
                name: wixData.name,
                floatY: wixData.floatY
            }
            switch (wixData.name) {
                case 'Eol':
                    entity = new Eol(wixProps);
                    entity.decide = entity.decideFunction;
                    break;
                case 'Liquice':
                    entity = new Liquice(wixProps);
                    break;
                default:
                    entity = new Eol(wixProps);
            }
            $.addEntity(entity);
            entity.startLife();
        })
    }

    getGlobalPos(localPos: { x: number, z: number }): iThreePosition {
        return {x: this.position.x + localPos.x, y: this.position.y, z: this.position.z + localPos.z};
    }

    makeItems(itemsChunkData:Array<iChunkItemsData>){
        itemsChunkData.forEach(item => {
            const itemData=getItemById(item.item_id);
            const itemProps = {
                textureName: itemData.textureUrl,
                position: this.getGlobalPos(item.position),
                name: itemData.name,
                height: itemData.height,
                isSprite: true,
                width: itemData.width,
            }
            const itemObject=new Item(itemProps);
            itemObject.model.userData.type='Item'
            $.addItem(itemObject)
            $.engine.addGameObjectToScene(itemObject.model);
        })
    }

    generateEnvironment(propsData: Array<iChunkPropsData>) {
        propsData.forEach((propsData, index) => {
            const envirData = getEnvironmentById(propsData.props_id);
            //hehe
            const propsProps = {
                textureName: envirData.textureUrl,
                position: this.getGlobalPos(propsData.position),
                name: envirData.name,
                rotation: 0,
                height: envirData.height,
                isSprite: true,
                width: envirData.width,
            }
            let props;
            switch (envirData.name) {
                case 'core_shard_1':
                    props = new CoreShard(propsProps);
                    if (index == 1) props.update()
                    break;
                case 'crystal_geyser_1':
                    props = new Props2D(propsProps);
                    break;
                default:
                    props = new CoreShard(propsProps);
            }
            this.propsInside.push(props)
            $.addEnvironments(props);
        })
        this.propsInside.forEach(propsObject => {
            propsObject.model.renderOrder = 1000 - propsObject.model.position.distanceTo($.engine.camera.camera.position);
            $.engine.addGameObjectToScene(propsObject.model);
        })
    }

}