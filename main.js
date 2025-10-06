import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Renderer
const canvas = document.getElementById('sphere-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 50;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Create outer sphere wireframe to visualize the search space
const sphereGeometry = new THREE.SphereGeometry(10, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0x444444,
  wireframe: true,
  transparent: true,
  opacity: 0.2
});
const outerSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(outerSphere);

// Dummy test points in 3D space
const testPoints = [];
const pointGeometry = new THREE.SphereGeometry(0.2, 16, 16);

for (let i = 0; i < 10; i++) {
  const pointMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(i / 10, 1, 0.5),
    emissive: new THREE.Color().setHSL(i / 10, 1, 0.3)
  });

  const point = new THREE.Mesh(pointGeometry, pointMaterial);

  // Random position within sphere
  const phi = Math.random() * Math.PI * 2;
  const theta = Math.random() * Math.PI;
  const radius = 3 + Math.random() * 5;

  point.position.x = radius * Math.sin(theta) * Math.cos(phi);
  point.position.y = radius * Math.sin(theta) * Math.sin(phi);
  point.position.z = radius * Math.cos(theta);

  scene.add(point);
  testPoints.push(point);
}

// Handle form submission
const searchForm = document.getElementById('search-form');
const searchBar = document.querySelector('.bar');

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const query = document.getElementById('query-input').value;
  const layers = parseInt(document.getElementById('layer-input').value);

  console.log('Search query:', query);
  console.log('Layers:', layers);

  // Hide search UI
  searchBar.classList.add('hidden');

  // TODO: Generate search results based on query and layers
  // For now, just hide the UI and allow exploration
});

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate test points slightly for visual interest
  testPoints.forEach((point, i) => {
    point.rotation.y += 0.01;
    point.rotation.x += 0.005;
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();
