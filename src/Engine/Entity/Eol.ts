import {Entity} from "~/src/Engine/Entity/Entity";
import {$} from "~/src/Engine/state";
import {Props2D} from "~/src/Engine/Environment/Props2D";
import {Group} from "three";
import {findRandomTargetPosition} from "~/src/libs/findRandomTargetPosition";

type iEolModes = 'sleep' | 'follow' | 'seek' | 'focus'

interface iMemoryProps extends Props2D {
    distance:number
}

interface iMemoryEntity extends Entity{
    distance:number
}

type iEntityMemory = {
    entities: Array<iMemoryEntity>,
    environment: Array<iMemoryProps>,
}

export class Eol extends Entity {
    currentMode = 'seek'
    decisionCooldown = 3000;
    memory: iEntityMemory = {
        entities: [],
        environment: []
    }
    visionRadius = 7;
    essenceLevel = 0;
    evaporationRadius = 0.5;

    sense() {
        this.clearMemory();
        this.checkProximity($.entities, this.memory.entities);
        this.checkProximity($.environments, this.memory.environment);
        this.memory.environment.sort((props1, props2) => {
            return props1.distance - props2.distance
        })
    }

    clearMemory() {
        this.memory = {
            entities: [],
            environment: []
        }
    }

    setMode(mode: iEolModes) {
        this.currentMode = mode;
    }

    checkProximity(items: Array<any>, memoryArray: Array<any>) {
        items.forEach(item => {
            const distance = this.model.position.distanceTo(item.model.position);
            if (distance <= this.visionRadius) {
                memoryArray.push({...item, distance: distance});
            }
        });
    }

    decide() {
        // console.log('Eol memory',this.memory)
        //Видно лужицу? Идём прямо к ней!
        if(this.currentMode === 'focus') return;
        const shard = this.memory.environment.find(props => props.model.name == 'EssencePaddle')
        if (shard) {
            //Лужица прямо передо мной? Испарить!
            if(this.model.position.distanceTo(shard.model.position)<this.evaporationRadius){
                this.setMode('focus')
            }
            const shardPosition = shard.position;
            this.goTo(shardPosition);
        } else {
            //Нет лужицы?.. Продолжаем поиски :(
            this.goTo(findRandomTargetPosition(this.position, 2,5));
        }
    }

    lightsOn() {

    }

    lightsOff() {

    }

    startLife() {
        this.lightsOn();
        this.speed = 0.02;
        setInterval(() => {
            this.sense();
            this.decide();
        }, this.decisionCooldown)
    }
}