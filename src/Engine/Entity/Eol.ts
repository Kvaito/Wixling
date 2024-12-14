import {findRandomTargetPosition} from "~/src/libs/findRandomTargetPosition";
import {Wix} from "~/src/Engine/Entity/Wix";
import {getWixDataById} from "~/src/Constants/wixes";

type iEolModes = 'sleep' | 'follow' | 'seek' | 'focus'|'goHome'

export class Eol extends Wix {
    currentMode = 'seek'
    essenceLevel = 0;
    evaporationRadius = 0.5;

    setMode(mode: iEolModes) {
        this.currentMode = mode;
    }

    decideFunction=()=> {
        console.log('Eol memory',this.memory)
        //Если время суток уже вечер или ночь, то надо сжаться и вернуться в норку
        if(this.currentMode=='goHome'&&['afternoon','night'].includes(this.memory.dayPeriod)){
            this.setMode('seek');
            this.becomeBig();
        }

        if(this.currentMode=='goHome') return;

        if( ['morning','day'].includes(this.memory.dayPeriod)){
            this.setMode('goHome');
            this.becomeMini();
            return;
        }

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

    becomeMini(){
        // console.log('Eol becomes mini',this.data);
        const miniFormData=this.data.mini;
        this.setNewTexture(miniFormData.imageSrc,miniFormData.height,miniFormData.width);
        this.floatY = miniFormData.floatY;
    }

    becomeBig(){
        // console.log('Eol becomes big');
        const originalData=getWixDataById(this.originalDataId);
        this.setNewTexture('/entity/Eol.png',originalData.height,originalData.width);
        this.floatY = originalData.floatY;
    }
}