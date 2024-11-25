import {
    Color,
    GridHelper, Group,
    PerspectiveCamera, RepeatWrapping,
    Scene, SRGBColorSpace, TextureLoader,
    WebGLRenderer
} from "three";
import {$} from "~/src/Engine/state";
import {Chunk} from "~/src/Engine/Environment/Chunk";
import {Player} from "~/src/Engine/Entity/Player";
import {GameCamera} from "~/src/Engine/camera";
import {toKeyAlias} from "@babel/types";
import uid = toKeyAlias.uid;

export class Engine {
    container: HTMLElement;
    public scene: Scene;
    renderer: WebGLRenderer;
    camera!: GameCamera
    readonly grid: GridHelper;

    constructor() {
        console.log('Start engine')
        this.container = window.document.createElement('div');
        this.scene = new Scene();
        this.grid = new GridHelper(50, 50, '#62a2c4', 'rgb(118,216,255)');

        this.renderer = new WebGLRenderer();
        this.renderer.setClearColor(new Color('#3c4b5b'));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setAnimationLoop(() => {
            this.render()
        })

    }


    render() {
        this.renderer.render(this.scene, this.camera.camera);
    }

    resize() {
        this.camera.camera.aspect = this.container.offsetWidth / this.container?.offsetHeight;
        this.camera.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.render();
    }

    addGameObjectToScene(object: Group) {
        this.scene.add(object);
    }

    deleteModelFromScene(model: Group) {
        this.scene.remove(model);
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
        $.ground = ground;
    }

    getObjectFromSceneByID(id: number) {
        return this.scene.getObjectById(id)
    }

    recalcRenderOrderForEnvironment() {
        $.environments.forEach(props => {
            const modelOnScene = this.getObjectFromSceneByID(props.model.id);
            if (!modelOnScene) return;
            modelOnScene.renderOrder = 1000 - modelOnScene.position.distanceTo($.engine.camera.camera.position)
        })
    }

    recalcRenderOrderForEffects() {
        $.effects.forEach(props => {
            const modelOnScene = this.getObjectFromSceneByID(props.model.id);
            if (!modelOnScene) return;
            modelOnScene.renderOrder = 1000 - modelOnScene.position.distanceTo($.engine.camera.camera.position)
        })
    }

    recalcRenderOrderForEntities(){
        $.entities.forEach(props => {
            const modelOnScene = this.getObjectFromSceneByID(props.model.id);
            if (!modelOnScene) return;
            modelOnScene.renderOrder = 1000 - modelOnScene.position.distanceTo($.engine.camera.camera.position)
        })
    }

    setContainer(container: HTMLElement) {
        this.container = container;
        container.appendChild(this.renderer.domElement);
        const perspCamera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 600);
        this.camera = new GameCamera(perspCamera);
        this.scene.add(this.camera.camera);
        this.camera.setPosition({x: 0, y: 1.7, z: 2.5});
        this.camera.update()
        this.addGround();

        $.player = new Player({
            textureUrl: '/entity/player/Wensy.png',
            position: {x: 0, y: 0, z: 0},
            height: 1.7,
            width: 0.8,
            name:'Player'
        });
        $.addEntity($.player);
        $.player.eventListeners();
        this.camera.followPlayer();
        $.ground.generateEnvironment();
        $.ground.createEntities();
        window.addEventListener('resize', () => {
            this.resize();
        });
        console.log('Scene after setContainer',this.scene);
        console.log('State of game',$);
    }
}

export function initEngine() {
    $.engine = new Engine();
}
