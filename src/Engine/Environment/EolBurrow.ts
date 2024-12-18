import {Props2D} from "~/src/Engine/Environment/Props2D";

export class EolBurrow extends Props2D{
    eolCount=0;

    putEolInside(){
        this.eolCount+=1;
    }
}