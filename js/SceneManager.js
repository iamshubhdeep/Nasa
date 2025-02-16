import * as THREE from 'three';
import { MyCameraControls } from '../cameraControls/MyCameraControls.js';
import { PickHelper } from '../PickHelper.js';
import { SolarSystem } from '../sceneSubjects/SolarSystem.js';
import { AmbientLight } from '../sceneSubjects/AmbientLight.js';
import { SunLight } from '../sceneSubjects/SunLight.js';
import { Stars } from '../sceneSubjects/astronomicalBodies/Stars.js';

export class SceneManager {
    constructor(canvas) {
        this.screenDimensions = {
            width: canvas.width,
            height: canvas.height
        };
        this.scene = this.buildScene();
        this.renderer = this.buildRender(this.screenDimensions);
        this.camera = this.buildCamera(this.screenDimensions);
        this.sceneSubjects = this.createSceneSubjects(this.scene);
        this.cameraControls = new MyCameraControls(this.camera, canvas);

        this.scene.background = new THREE.Color('black');

        // Picker
        this.pickPosition = { x: 0, y: 0 };
        this.pickHelper = new PickHelper();
        this.clearPickPosition();

        this.setupEventListeners(canvas);
    }

    buildScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#000");
        return scene;
    }

    buildRender({ width, height }) {
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
        renderer.setPixelRatio(DPR);
        renderer.setSize(width, height);

        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        return renderer;
    }

    buildCamera({ width, height }) {
        const aspectRatio = width / height;
        const fieldOfView = 60;
        const nearPlane = 1;
        const farPlane = 100000;
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

        camera.position.set(100, 250, 1050);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        return camera;
    }

    createSceneSubjects(scene) {
        const sceneSubjects = [
            new SolarSystem(scene),
            new AmbientLight(scene),
            new SunLight(scene),
            new Stars(scene)
        ];

        return sceneSubjects;
    }

    update(time) {
        for (let i = 0; i < this.sceneSubjects.length; i++) {
            this.sceneSubjects[i].update(time);
        }

        const solarSystem = this.sceneSubjects[0];
        this.pickHelper.pick(this.pickPosition, solarSystem.getAstrionomicalBodies(), this.camera, time, this.scene);
        this.cameraControls.update();
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const { width, height } = canvas;

        this.screenDimensions.width = width;
        this.screenDimensions.height = height;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }

    getCanvasRelativePosition(event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) * canvas.width / rect.width,
            y: (event.clientY - rect.top) * canvas.height / rect.height,
        };
    }

    setPickPosition(event) {
        const pos = this.getCanvasRelativePosition(event);
        this.pickPosition.x = (pos.x / canvas.width) * 2 - 1;
        this.pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
    }

    clearPickPosition() {
        this.pickPosition.x = undefined;
        this.pickPosition.y = undefined;
    }

    setupEventListeners(canvas) {
        window.addEventListener('dblclick', (event) => this.setPickPosition(event));
        window.addEventListener('mouseout', () => this.clearPickPosition());
        window.addEventListener('mouseleave', () => this.clearPickPosition());

        // Mobile support
        window.addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.setPickPosition(event.touches[0]);
        }, { passive: false });

        window.addEventListener('touchmove', (event) => {
            this.setPickPosition(event.touches[0]);
        });

        window.addEventListener('touchend', () => this.clearPickPosition());

        // Modal
        const span = document.getElementsByClassName("close")[0];
        const modal = document.getElementById("myModal");

        span.onclick = () => {
            modal.style.display = "none";
        };

        span.addEventListener('touchend', () => {
            modal.style.display = "none";
        });

        window.addEventListener('touchend', (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });

        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };
    }
}
