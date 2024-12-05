import {defineStore} from "pinia";

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
            this.inventory.push(item);
            console.log('Player inventory', this.inventory);
        },
    }
})