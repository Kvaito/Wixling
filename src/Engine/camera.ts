import {PerspectiveCamera} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {$} from "~/src/Engine/state";
import type {iThreePosition} from "~/src/Engine/GameObject";

export class GameCamera {
    camera: PerspectiveCamera;
    orbit!: OrbitControls;


    constructor(camera: PerspectiveCamera) {
        this.camera=camera;
        this.orbit = new OrbitControls(this.camera, $.engine.container);
        this.orbit.target.set(0,1.2,0);
    }

    update(){
        this.orbit.update();
    }

    setPosition(position:iThreePosition) {
        this.camera.position.set(position.x,position.y,position.z);

    }

    focusOn(position:iThreePosition){
        this.orbit.target.set(position.x,position.y,position.z);
    }

    followPlayer(){
        //Получить позицию игрока
        const playerPosition=$.player.getPosition();
        //Изменить позицию камеры и точку фокуса
        this.setPosition({...playerPosition,y:playerPosition.y+0.75,z:playerPosition.z+3});
        this.focusOn({...playerPosition});
    }
}