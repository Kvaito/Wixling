// Генерируем случайное расстояние в пределах заданного диапазона радиусов
import type {iThreePosition} from "~/src/Engine/GameObject";

export function findRandomTargetPosition(centerPosition:iThreePosition, minRadius: number,maxRadius:number) {
    const angle = Math.random() * 2 * Math.PI;
    const center=centerPosition;

    const distance = Math.random() * (maxRadius - minRadius) + minRadius;
    const x = center.x + Math.cos(angle) * distance;
    const z = center.z + Math.sin(angle) * distance;

    return {x:x, y:center.y, z:z};
}