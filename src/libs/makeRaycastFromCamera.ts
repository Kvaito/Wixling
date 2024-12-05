import {$} from "~/src/Engine/state";
import {Vector2} from "three";


export function getClickedObject(mouseEvent: MouseEvent) {
    const point2D = new Vector2()

    point2D.x = (mouseEvent.clientX / window.innerWidth) * 2 - 1;
    point2D.y = -(mouseEvent.clientY / window.innerHeight) * 2 + 1;

    // Устанавливаем raycaster с позицией камеры и направление взгляда
    $.engine.raycaster.setFromCamera(point2D, $.engine.camera.camera);

    // Получаем массив объектов, которые пересекаются с лучом
    const intersects = $.engine.raycaster.intersectObjects($.engine.scene.children);
    console.log('intersects',intersects);
    let clickedObject;
    // Проверяем, есть ли пересечения
    if (intersects.length > 0) {
        // Получаем первый пересеченный объект
        clickedObject = intersects[0].object.parent;
        return clickedObject;
    }
    if (!clickedObject) return null;
}