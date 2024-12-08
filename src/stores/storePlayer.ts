import {defineStore} from "pinia";
import {getItemById} from "~/src/Constants/items";

type iStateType = {
    inventory: Array<any>
}

export const usePlayerStore = defineStore('playerStore', {
    state: () => ({
        inventory: []
    } as iStateType),
    getters: {
        getInventory: (state) => {
            return state.inventory;
        },
    },
    actions: {
        addToInventory(item: any) {
            this.inventory.push(item.itemData);
            console.log('Player inventory', this.inventory);
        },
    }
})