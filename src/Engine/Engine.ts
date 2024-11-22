import {BoxGeometry, Camera, GridHelper, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import {$} from "~/src/Engine/state";
import {TransformControls} from 'three/examples/jsm/controls/TransformControls';

export class Engine {
    container: HTMLElement;
    public scene: Scene;
    camera: Camera;
    renderer: WebGLRenderer;
    // transformControls!:TransformControls;
    readonly grid: GridHelper;

    constructor() {
        console.log('Start engine')
        this.container = window.document.createElement('div');
        this.scene = new Scene();
        this.grid = new GridHelper(50, 50, '#6e5353', '#862626');
        this.scene.add(this.grid);
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        const geometry = new BoxGeometry(1, 1, 1);
        const material = new MeshBasicMaterial({color: 0x00ff00});
        const cube = new Mesh(geometry, material);
        this.scene.add(cube);
        this.camera.position.z = 5;
        this.camera.position.y = 2;
        this.camera.position.x = 1;
        this.renderer.setAnimationLoop(()=>{this.render()})
        // this.transformControls = new TransformControls(this.camera, this.container);
        // this.scene.add(this.transformControls);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    setContainer(container: HTMLElement) {
        this.container = container;
        container.appendChild(this.renderer.domElement);
    }
}

export function initEngine() {
    $.engine = new Engine();
}
