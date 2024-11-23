import {PlaneGeometry} from "three";

export const sceneBackgroundColor = '#FBFBFB';
export const sceneGridColor = '#E7E7E7';
export const sceneGridCenterColor = '#D5D5D5';
export const gridSize = 1;
export const gridDivisions = 50;
export const defaultCameraType = 'perspective'; // Orthographic
export const cameraFov = 70;
export const cameraPosition = [ 0,2,-5 ] as const;
export const cameraLookAt = [ 0,0,0 ] as const;

export const radialSegments = 8;
export const defaultPosition = [ 0, 0, 0 ] as xyz;
export const defaultRotation = [ 0, 0, 0 ] as xyz;
export const defaultQuaternion = [ 0, 0, 0, 1 ] as iQuart;
export const defaultScale = [ 1, 1, 1 ] as xyz;