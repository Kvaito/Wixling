import {useGlobalConditionStore} from "~/src/stores/storeGlobalCondition";

export const morningTimePercent=20;
export const dayTimePercent=40;
export const afternoonTimePercent=70;
export const nightTimePercent=90;
export const msInTimeTick=500;

export type iDayPeriodType='day'|'morning'|'afternoon'|'night'

export function getDayPeriod(time:number):iDayPeriodType{
    const dayPercent=(time/useGlobalConditionStore().dayLength)*100;
    // console.log('dayPercent',dayPercent,useGlobalConditionStore().dayLength,time)
    if(dayPercent>nightTimePercent) return 'night';
    if(dayPercent>afternoonTimePercent) return 'afternoon';
    if(dayPercent>dayTimePercent) return 'day';
    if(dayPercent>morningTimePercent) return 'morning';
    if(dayPercent<morningTimePercent) return 'night';
    return 'day';
}