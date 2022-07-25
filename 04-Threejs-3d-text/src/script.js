import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Axes Helper
 */
const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load(
  "https://makio135.com/matcaps/64/4F4C45_A7AEAA_7A8575_9D97A2-64px.png"
);
const matcapTexture2 = textureLoader.load(
  "https://makio135.com/matcaps/64/A0A8B0_424336_E7E9EF_545C5C-64px.png"
);

/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader();
fontLoader.load("./fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new THREE.TextGeometry("RUNNING", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
    // font — THREE.Font的实例。
    // size — Float。字体大小，默认值为100。
    // height — Float。挤出文本的厚度。默认值为50。
    // curveSegments — Integer。（表示文本的）曲线上点的数量。默认值为12。
    // bevelEnabled — Boolean。是否开启斜角，默认为false。
    // bevelThickness — Float。文本上斜角的深度，默认值为20。
    // bevelSize — Float。斜角与原始文本轮廓之间的延伸距离。默认值为8。
    // bevelSegments — Integer。斜角的分段数。默认值为3。
  });
  textGeometry.computeBoundingBox();
  // textGeometry.translate(
  //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
  //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
  //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5
  // );
  textGeometry.center();

  const textMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture2,
  });
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);
});

/**
 * Object
 */
const graphicGeometry1 = new THREE.IcosahedronGeometry(0.3, 0);
const graphicGeometry2 = new THREE.BoxGeometry(0.3, 0.3, 0.3);
const graphicGeometry3 = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 24);
const graphicGeometry4 = new THREE.TorusGeometry(0.2, 0.1, 32, 24);
const graphicArr = [
  graphicGeometry1,
  graphicGeometry2,
  graphicGeometry3,
  graphicGeometry4,
];
const graphicMaterial = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture,
});

for (let i = 0; i < 300; i++) {
  const graphicGeometry =
    graphicArr[Math.floor(Math.random() * graphicArr.length)];
  const graphic = new THREE.Mesh(graphicGeometry, graphicMaterial);
  graphic.position.x = (Math.random() - 0.5) * 10;
  graphic.position.y = (Math.random() - 0.5) * 10;
  graphic.position.z = (Math.random() - 0.5) * 10;

  graphic.rotation.x = Math.random() * Math.PI;
  graphic.rotation.Y = Math.random() * Math.PI;

  const scale = Math.random();
  graphic.scale.set(scale, scale, scale);

  scene.add(graphic);
}

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
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
