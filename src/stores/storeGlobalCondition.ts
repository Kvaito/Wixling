import {defineStore} from "pinia";

type iStateType = {
    time: number,
    dayLength:number
}

export const useGlobalConditionStore = defineStore('globalStore', {
    state: () => ({
        time: 0,
        dayLength:1000
    } as iStateType),
    getters: {
        getTime: (state) => {
            return state.time;
        },
        getDayLength:(state)=>{
            return state.dayLength
        }
    },
    actions: {
        setTime(newTime: number) {
            this.time = newTime;
        },
        setDayLength(newDayLength: number) {
            this.dayLength = newDayLength;
        }
    }
})