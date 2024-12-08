import {Props2D} from "~/src/Engine/Environment/Props2D";
import type {iItemData} from "~/src/Constants/items";
import {gameItems} from "~/src/Constants/items";

export class Item extends Props2D {
    itemData: iItemData = gameItems[0]

    taken() {
        this.destroy();
    }
}