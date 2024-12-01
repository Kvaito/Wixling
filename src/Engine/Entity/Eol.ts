import {findRandomTargetPosition} from "~/src/libs/findRandomTargetPosition";
import {Wix} from "~/src/Engine/Entity/Wix";

type iEolModes = 'sleep' | 'follow' | 'seek' | 'focus'




export class Eol extends Wix {
    currentMode = 'seek'
    essenceLevel = 0;
    evaporationRadius = 0.5;

    setMode(mode: iEolModes) {
        this.currentMode = mode;
    }

    decideFunction=()=> {
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


}