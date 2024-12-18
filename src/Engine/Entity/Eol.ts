import {findRandomTargetPosition} from "~/src/libs/findRandomTargetPosition";
import {Wix} from "~/src/Engine/Entity/Wix";
import {getWixDataById} from "~/src/Constants/wixes";
import {Vector3} from "three";

type iEolModes = 'sleep' | 'follow' | 'seek' | 'focus' | 'goHome'

export class Eol extends Wix {
    currentMode = 'seek'
    essenceLevel = 0;
    evaporationRadius = 0.5;
    burrowGlobalPoint = {x: 7, z: 2}
    actionDistance = 0.5

    setMode(mode: iEolModes) {
        this.currentMode = mode;
    }

    decideFunction = () => {
        // console.log('Eol memory',this.memory)
        //Если время суток уже вечер или ночь, то надо сжаться и вернуться в норку

        //Не пора ли просыпаться?
        if(this.currentMode == 'sleep') {
            if(['afternoon', 'night'].includes(this.memory.dayPeriod)){
                this.becomeVisible();
                this.awake();
            }
            return;
        }

        //Идти к запомненной точке гнезда, пока не будет достигнуто необходимое расстояние
        if (this.currentMode == 'goHome') {
            this.goTo({y: 0, ...this.burrowGlobalPoint});
            if (this.model.position.distanceTo(new Vector3(this.burrowGlobalPoint.x, 0, this.burrowGlobalPoint.z)) <= this.actionDistance) {
                const burrow = this.memory.environment.find(envir => envir.item.name = 'eol_burrow')
                console.log('Eol: I am near my burrow!', burrow);
                if (burrow) {
                    burrow.item.putEolInside();
                    this.becomeInvisible();
                    this.sleep();
                }
            }
            return;
        }

        if (['morning', 'day'].includes(this.memory.dayPeriod)) {
            this.setMode('goHome');
            this.becomeMini();
            return;
        }

        //Видно лужицу? Идём прямо к ней!
        if (this.currentMode === 'focus') return;
        const shard = this.memory.environment.find(props => props.item.model.name == 'EssencePaddle')
        if (shard) {
            //Лужица прямо передо мной? Испарить!
            if (this.model.position.distanceTo(shard.item.model.position) < this.evaporationRadius) {
                this.setMode('focus')
            }
            const shardPosition = shard.item.position;
            this.goTo(shardPosition);
        } else {
            //Нет лужицы?.. Продолжаем поиски :(
            this.goTo(findRandomTargetPosition(this.position, 2, 5));
        }
    }

    lightsOn() {

    }

    lightsOff() {

    }

    awake(){
        this.setMode('seek');
        this.decisionCooldown = 3000;
        this.becomeBig();
    }

    sleep() {
        this.setMode('sleep');
        this.decisionCooldown = 13000;
    }

    becomeMini() {
        // console.log('Eol becomes mini',this.data);
        const miniFormData = this.data.mini;
        this.setNewTexture(miniFormData.imageSrc, miniFormData.height, miniFormData.width);
        this.floatY = miniFormData.floatY;
    }

    becomeBig() {
        // console.log('Eol becomes big');
        const originalData = getWixDataById(this.originalDataId);
        this.setNewTexture('/entity/Eol.png', originalData.height, originalData.width);
        this.floatY = originalData.floatY;
    }
}