import {Entity} from "~/src/Engine/Entity/Entity";
import {Props2D} from "~/src/Engine/Environment/Props2D";
import {$} from "~/src/Engine/state";
interface iMemoryEntity extends Entity{
    distance:number
}
interface iMemoryProps extends Props2D {
    distance:number
}

type iEntityMemory = {
    entities: Array<iMemoryEntity>,
    environment: Array<iMemoryProps>,
}
export class Wix extends Entity{
    decisionCooldown = 3000;
    memory: iEntityMemory = {
        entities: [],
        environment: []
    }
    visionRadius = 7;
    decide=() => {};

    sense() {
        this.clearMemory();
        this.checkProximity($.entities, this.memory.entities);
        this.checkProximity($.environments, this.memory.environment);
        this.memory.environment.sort((props1, props2) => {
            return props1.distance - props2.distance
        })
    }

    checkProximity(items: Array<any>, memoryArray: Array<any>) {
        items.forEach(item => {
            const distance = this.model.position.distanceTo(item.model.position);
            if (distance <= this.visionRadius) {
                memoryArray.push({...item, distance: distance});
            }
        });
    }

    clearMemory() {
        this.memory = {
            entities: [],
            environment: []
        }
    }

    startLife() {
        this.speed = 0.02;
        setInterval(() => {
            this.sense();
            this.decide();
        }, this.decisionCooldown)
    }
}