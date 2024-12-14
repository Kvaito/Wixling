import {useGlobalConditionStore} from "~/src/stores/storeGlobalCondition";

export const morningTimePercent=20;
export const dayTimePercent=40;
export const afternoonTimePercent=70;
export const nightTimePercent=90;
export const msInTimeTick=1000;

export function getDayPeriod(time:number){
    const dayPercent=useGlobalConditionStore().dayLength/time*100;
    if(dayPercent>morningTimePercent) return 'morning';
    if(dayPercent>dayTimePercent) return 'day';
    if(dayPercent>afternoonTimePercent) return 'afternoon';
    if(dayPercent>nightTimePercent||nightTimePercent<morningTimePercent) return 'night';
    return 'day';
}