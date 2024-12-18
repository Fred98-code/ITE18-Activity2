import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";




const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

// Sphere Geometry
const geo = new THREE.SphereGeometry(1, 32, 32); 
const mat = new THREE.MeshStandardMaterial({
    color: 0x00FF00, // Neon green color
    roughness: 0.5, 
    metalness: 0.1, 
});
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

//Removed wireframe mesh

const hemiLight = new THREE.HemisphereLight(0x0099ff, 0xaa5500);
scene.add(hemiLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); //Brighter white light
scene.add(directionalLight);
directionalLight.position.set(1, 2, 1); // Adjust position for better lighting
directionalLight.castShadow = true; // Enable shadows
mesh.castShadow = true; // Make the sphere cast shadows
renderer.shadowMap.enabled = true; // Enable shadow map


const platformGeometry = new THREE.BoxGeometry(10, 0.2, 10); // Increased width and depth to 6
const platformMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 }); 
const platform = new THREE.Mesh(platformGeometry, platformMaterial);
platform.receiveShadow = true; 
platform.position.y = -1; 
scene.add(platform);

const numStars = 500;
const stars = [];
const starGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(numStars * 3);
const starColors = new Float32Array(numStars * 3);

for (let i = 0; i < numStars; i++) {
    const x = (Math.random() - 0.5) * 100;
    const y = (Math.random() - 0.5) * 100;
    const z = (Math.random() - 0.5) * 100;

    starPositions.set([x, y, z], i * 3);
    starColors.set([1, 1, 1], i * 3);
}

starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
const starMaterial = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
});
const starField = new THREE.Points(starGeometry, starMaterial);
scene.add(starField);

function animate(t = 0) {
    requestAnimationFrame(animate);
    mesh.rotation.y = t * 0.0001;

    renderer.render(scene, camera);
    controls.update();
}

animate();