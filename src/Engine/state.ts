import {Engine} from "~/src/Engine/Engine";

export class GlobalState{
    engine!:Engine

    constructor() {

    }

}

export const $ = new GlobalState();

declare global {
    interface Window {
        app: GlobalState
    }
}

if (window) {
    window.app = $;
}