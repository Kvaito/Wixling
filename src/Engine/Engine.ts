import {
    AmbientLight,
    BoxGeometry,
    Camera, Color,
    GridHelper,
    Mesh,
    MeshBasicMaterial, OrthographicCamera,
    PerspectiveCamera, PlaneGeometry, PointLight, RepeatWrapping,
    Scene, TextureLoader,
    WebGLRenderer
} from "three";
import {$} from "~/src/Engine/state";
import {TransformControls} from 'three/examples/jsm/controls/TransformControls';
import {cameraLookAt, cameraPosition} from "~/src/Constants/scene";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class Engine {
    container: HTMLElement;
    public scene: Scene;
    camera: Camera;
    renderer: WebGLRenderer;
    transformControls!:TransformControls;
    readonly grid: GridHelper;
    _perspCamera!: PerspectiveCamera;
    _ortoCamera!: OrthographicCamera;
    orbitOrtho!: OrbitControls;
    orbitPersp!: OrbitControls;
    orbit!: OrbitControls;

    constructor() {
        console.log('Start engine')
        this.container = window.document.createElement('div');
        this.scene = new Scene();
        this.grid = new GridHelper(50, 50, '#5b8fab', 'rgba(139,212,231,0.15)');
        this.scene.add(this.grid);
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new WebGLRenderer();
        this.renderer.setClearColor(new Color('#FBFBFB'));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        const light = new AmbientLight(0x404040, 20); // soft white light
        this.scene.add(light);
        const light2 = new PointLight(0xffffff, 10000, 1000);
        light2.position.set(100, 100, 100);
        this.renderer.setAnimationLoop(()=>{this.render()})
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    addGround(){
        const planeGeometry = new PlaneGeometry(100, 100);
        const textureLoader = new TextureLoader();
        const groundTexture = textureLoader.load('/textures/ground.jpg');
        groundTexture.wrapS = RepeatWrapping; // Повтор по горизонтали
        groundTexture.wrapT = RepeatWrapping; // Повтор по вертикали
        groundTexture.repeat.set(300, 300);
        const planeMaterial = new MeshBasicMaterial({ map: groundTexture });
        const plane = new Mesh(planeGeometry, planeMaterial);
        plane.rotateX( -Math.PI/2);
        plane.position.set(0,-0.001,0)
        this.scene.add(plane);
    }

    setContainer(container: HTMLElement) {
        this.container = container;
        container.appendChild(this.renderer.domElement);
        const aspect = this.container.offsetWidth / this.container.offsetHeight;
        this._perspCamera = new PerspectiveCamera(70, this.container.offsetWidth / this.renderer.domElement.offsetHeight, 0.1, 10000);
        this._ortoCamera = new OrthographicCamera(10 * aspect / -2, 10 * aspect / 2, 10 / 2, 10 / -2, 0.01, 1000);
        this.camera = this._perspCamera;
        this.camera.position.set(...cameraPosition);
        this.camera.lookAt(...cameraLookAt);
        this.scene.add(this.camera);
        this.orbitOrtho = new OrbitControls(this._ortoCamera, this.container);
        this.orbitOrtho.enabled = false;
        this.orbitPersp = new OrbitControls(this._perspCamera, this.container);
        this.orbit = this.orbitPersp;
        this.addGround();
    }
}

export function initEngine() {
    $.engine = new Engine();
}
