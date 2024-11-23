import {
    AmbientLight,
    BoxGeometry,
    Camera, Color,
    GridHelper, Group,
    Mesh,
    MeshBasicMaterial, OrthographicCamera,
    PerspectiveCamera, PlaneGeometry, PointLight, RepeatWrapping,
    Scene, SRGBColorSpace, Texture, TextureLoader,
    WebGLRenderer
} from "three";
import {$} from "~/src/Engine/state";
import {TransformControls} from 'three/examples/jsm/controls/TransformControls';
import {cameraLookAt, cameraPosition} from "~/src/Constants/scene";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {Props2D} from "~/src/Engine/Environment/Props2D";
import type {iThreePosition} from "~/src/Engine/GameObject";
import {Chunk} from "~/src/Engine/Environment/Chunk";
import {Player} from "~/src/Engine/Entity/Player";

export class Engine {
    container: HTMLElement;
    public scene: Scene;
    camera: Camera;
    renderer: WebGLRenderer;
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
        this.grid = new GridHelper(50, 50, '#62a2c4', 'rgb(118,216,255)');
        // this.scene.add(this.grid);
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new WebGLRenderer();
        this.renderer.setClearColor(new Color('#3c4b5b'));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        const light = new AmbientLight('#44494f', 0); // soft white light
        // this.scene.add(light);
        // const light2 = new PointLight(0xffffff, 500, 1000);
        // light2.position.set(100, 100, 100);
        this.renderer.setAnimationLoop(() => {
            this.render()
        })
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    addGameObjectToScene(object: Group) {
        this.scene.add(object);
    }

    addGround() {
        const textureLoader = new TextureLoader();
        const groundTexture = textureLoader.load('/textures/ground.jpg');
        groundTexture.colorSpace = SRGBColorSpace
        groundTexture.wrapS = RepeatWrapping; // Повтор по горизонтали
        groundTexture.wrapT = RepeatWrapping; // Повтор по вертикали
        groundTexture.repeat.set(100, 100);
        const ground = new Chunk({
            texture: groundTexture,
            position: {x: 0, y: 0, z: 0},
            name: 'Ground',
            rotation: -Math.PI / 2,
            height: 100,
            width: 100
        })
        this.addGameObjectToScene(ground.model);
        ground.generateEnvironment()
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
        $.player = new Player({
            position: {
                x: 0, y: 1, z: 3
            }
        });
    }
}

export function initEngine() {
    $.engine = new Engine();
}
