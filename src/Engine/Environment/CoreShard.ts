import {Props2D} from "~/src/Engine/Environment/Props2D";
import {EssencePaddle} from "~/src/Engine/Environment/EssencePaddle";
import {$} from "~/src/Engine/state";

export class CoreShard extends Props2D{
    isPaddled=false;

    update(){
        if(!this.isPaddled) this.createPaddle();
    }

    createPaddle(){
        this.isPaddled=true;
        const paddle= new EssencePaddle({
            height: 1.5,
            name: "EssencePaddle",
            position: {...this.position,y:this.position.y+0.001},
            rotation:Math.random() * 2 * Math.PI,
            textureName: 'EssencePaddle.png',
            width: 1.5,
            zIndexBuff:-1
        });
        $.engine.addGameObjectToScene(paddle.model);
        $.addEnvironments(paddle);
    }
}