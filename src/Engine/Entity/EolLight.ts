import {Entity} from "~/src/Engine/Entity/Entity";
import {$} from "~/src/Engine/state";

export const EolLightClassProps = {
    textureUrl: '/entity/LightRound.png',
    name: 'EolLight',
    position: {x: 0, y: 0, z: 0},
    height: 1,
    width: 1,
    speed: 0,
    floatY: 0.001,
    data: {
        isPlane: true,
        autoAdd: false,
    }
}

export class EolLight extends Entity {
    isOn: boolean = false;
    evaporateCheckTimer=setInterval(()=>{},1000);

    switch(value: boolean) {
        if (this.isOn === value) return;
        this.isOn = value;
        if (this.isOn) {
            this.evaporateCheckTimer = setInterval(()=>{this.checkEvaporate()}, 3000);
        } else clearInterval(this.evaporateCheckTimer);
        // console.log('switch eol light',this.isOn,this.evaporateCheckTimer)
    }

    checkEvaporate() {
        console.log('checkEvaporate');
        //Получить объекты
        [...$.items, ...$.environments].forEach(item => {
            const distance = this.model.position.distanceTo(item.model.position);
            if (distance <= this.width) {
                //Если объект испаримый, то вызвать в нём функцию перехода на следующую стадию
            }
        });
    }
}