import "./style/main.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as dat from "dat.gui";
const gui = new dat.GUI();

const roseImg = document.querySelector(".logo");

const h1Els = document.getElementsByTagName("h1");
[...h1Els].forEach((el) => {
  let text = new Blotter.Text(el.innerText, {
    family: "Monument",
    size: 80,
    fill: "#fff",
  });
  let material = new Blotter.RollingDistortMaterial();
  material.uniforms.uSineDistortSpread.value = 0.035;
  material.uniforms.uSineDistortCycleCount.value = 2;
  material.uniforms.uSineDistortAmplitude.value = 0.03;
  material.uniforms.uNoiseDistortVolatility.value = 15;
  material.uniforms.uNoiseDistortAmplitude.value = 0.01;
  material.uniforms.uRotation.value = 170;
  material.uniforms.uSpeed.value = 0.08;
  var blotter = new Blotter(material, {
    texts: text,
  });
  var scope = blotter.forText(text);
  scope.appendTo(el);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.IcosahedronGeometry(20, 1);
const material = new THREE.MeshNormalMaterial();
// Material Props.
material.wireframe = true;
material.flatShading = true;
// Create Mesh & Add To Scene
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.001,
  5000
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 40;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // 将其设置为true以启用阻尼（惯性），这将给控制器带来重量感。
controls.autoRotate = true; // 以自动围绕目标旋转。
controls.enableZoom = false;
controls.enablePan = false; // 启用或禁用摄像机平移
controls.dampingFactor = 0.05; // 当.enableDamping设置为true的时候，阻尼惯性有多大。
controls.maxDistance = 1000;
controls.minDistance = 30;
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animation GSAP
 */

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.defaults({
  scrub: 3,
  ease: "none",
});
const sections = document.querySelectorAll(".section");
gsap.from(mesh.position, {
  y: 1,
  duration: 1,
  ease: "expo",
});
gsap.from("h1", {
  yPercent: 100,
  autoAlpha: 0,
  ease: "back",
  delay: 0.3,
});
gsap.to(mesh.rotation, {
  x: Math.PI * 2,
  scrollTrigger: {
    trigger: sections[1],
  },
});
gsap.to(mesh.scale, {
  x: 2,
  y: 2,
  scrollTrigger: {
    trigger: sections[2],
  },
});
gsap.to(mesh.rotation, {
  y: Math.PI * 2,
  scrollTrigger: {
    trigger: sections[3],
  },
});

/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  mesh.rotation.x += 0.01 * Math.sin(1);
  mesh.rotation.y += 0.01 * Math.sin(1);
  mesh.rotation.z += 0.01 * Math.sin(1);

  // Update controls
  controls.update();
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
/*------------------------------
MouseMove
------------------------------*/
function onMouseMove(e) {
  const x = e.clientX;
  const y = e.clientY;

  gsap.to(scene.rotation, {
    y: gsap.utils.mapRange(0, window.innerWidth, 1, -1, x),
    x: gsap.utils.mapRange(0, window.innerHeight, 1, -1, y),
  });
}
window.addEventListener("mousemove", onMouseMove);

tick();

window.addEventListener("scroll", (event) => {
  roseImg.style.transform = `rotate(${window.scrollY * 0.01}deg)`;
});
