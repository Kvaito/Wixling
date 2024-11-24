import {PlaneGeometry} from "three";

export const sceneBackgroundColor = '#FBFBFB';
export const sceneGridColor = '#E7E7E7';
export const sceneGridCenterColor = '#D5D5D5';
export const gridSize = 1;
export const gridDivisions = 50;
export const defaultCameraType = 'perspective'; // Orthographic
export const cameraFov = 70;
export const cameraPosition = [ 0,2,2 ] as const;
export const cameraLookAt = [ 0,1.2,0 ] as const;

export const radialSegments = 8;
