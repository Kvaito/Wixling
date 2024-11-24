import {
    AmbientLight,
    BoxGeometry,
    Camera, Color,
    GridHelper, Group,
    Mesh,
    MeshBasicMaterial, OrthographicCamera,
    PerspectiveCamera, PlaneGeometry, PointLight, RepeatWrapping,
    Scene, SRGBColorSpace, Texture, TextureLoader, Vector3,
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
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
    readonly grid: GridHelper;
    _perspCamera!: PerspectiveCamera;
    orbit!: OrbitControls;

    constructor() {
        console.log('Start engine')
        this.container = window.document.createElement('div');
        this.scene = new Scene();
        this.grid = new GridHelper(50, 50, '#62a2c4', 'rgb(118,216,255)');
        // this.scene.add(this.grid);
        this.camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 600);
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
        window.addEventListener('resize', () => {
            this.resize();
        });
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        this.camera.aspect = this.container.offsetWidth /this.container?.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.render();
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
        this._perspCamera = new PerspectiveCamera(70, this.container.offsetWidth / this.renderer.domElement.offsetHeight, 0.1, 600);
        this.camera = this._perspCamera;
        this.camera.position.set(...cameraPosition);
        this.camera.lookAt(...cameraLookAt);
        this.scene.add(this.camera);
        this.orbit = new OrbitControls(this._perspCamera, this.container);
        this.orbit.target.set(cameraLookAt[0], cameraLookAt[1], cameraLookAt[2]);
        this.orbit.update()
        console.log(this.orbit)
        this.addGround();
        $.player = new Player({
            textureUrl:'/entity/player/Wensy.png',
            position: {x:0,y:0,z:0},
            height:1.7,
            width:0.8,
        });
        $.player.eventListeners()
    }
}

export function initEngine() {
    $.engine = new Engine();
}
