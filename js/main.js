/*
the main has three basic responsibilities:
    * create the SceneManager, while passing a canvas to it (so that SceneManager won’t have to meddle with the DOM).
    * attach listeners to the DOM events we care about (such as windowresize or mousemove).
    * start the render loop, by calling requestAnimationFrame().

*/

// run node server:  http-server --cors -o -c-1

const canvas = document.querySelector('#canvas');
const sceneManager = new SceneManager(canvas);

bindEventListeners();
render();

function bindEventListeners() {
    window.onresize = resizeCanvas;
    resizeCanvas();
}

function resizeCanvas() {
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    sceneManager.onWindowResize();
}

function render(time) {
    // convert time into seconds
    time *= 0.001;
    requestAnimationFrame(render);
    sceneManager.update(time);
}

// Import Three.js and other dependencies
import * as THREE from './libs/three_r120.min.js';
import { OrbitControls } from './libs/OrbitControls.js';
import { OBJLoader } from './libs/OBJLoader.js';
import { MTLLoader } from './libs/MTLLoader.js';
import { MyCameraControls } from './cameraControls/MyCameraControls.js';
import { PickHelper } from './PickHelper.js';
import { ColorGUIHelper } from './gui/ColorGUIHelper.js';
import { AmbientLight } from './sceneSubjects/AmbientLight.js';
import { SunLight } from './sceneSubjects/SunLight.js';
import { SolarSystem } from './sceneSubjects/SolarSystem.js';
import { Stars } from './sceneSubjects/astronomicalBodies/Stars.js';
import { SceneManager } from './SceneManager.js';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// Initialize SceneManager
const sceneManager = new SceneManager(scene, camera);

// Add lights
const ambientLight = new AmbientLight();
scene.add(ambientLight);

const sunLight = new SunLight();
scene.add(sunLight);

// Add the solar system
const solarSystem = new SolarSystem();
scene.add(solarSystem);

// Add stars
const stars = new Stars();
scene.add(stars);

// Set up camera position
camera.position.z = 50;

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update controls
  controls.update();

  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
