import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";

import * as dat from "dat.gui";
let OrbitControls = require("three-orbit-controls")(THREE);

// Load Model and Texture
import peopleModel from "./model/crystalline/scene-processed.glb";
import f_texture from "./textures/bg_texture.jpg";
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load(
  "https://makio135.com/matcaps/64/660505_F2B090_DD4D37_AA1914-64px.png"
);

export default class Sketch {
  constructor(selector) {
    this.scene = new THREE.Scene();
    this.scene2 = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearAlpha(0.2);
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.autoClear = false;

    this.container = document.getElementById("container");
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );
    this.camera.position.set(0, 0, 2.0);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;
    this.paused = false;

    this.setupResize();
    this.addObjects();
    this.resize();
    this.render();
    // this.settings();

    this.loader = new GLTFLoader();
    this.loader.load(peopleModel, (gltf) => {
      this.scene.add(gltf.scene);
      this.model = gltf.scene;
      gltf.scene.position.z = 0.4;
      // gltf.scene.position.x = 1.2;
      gltf.scene.rotation.y = Math.PI;
      gltf.scene.traverse((o) => {
        if (o.isMesh) {
          o.geometry.center();
          o.scale.set(3, 3, 3);
          o.material = this.material2;
        }
      });
    });
  }

  settings() {
    let that = this;
    this.settings = {
      time: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "time", 0, 100, 0.01);
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    let that = this;
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
        fTexture: {
          type: "t",
          value: new THREE.TextureLoader().load(f_texture),
        },
        matcap: {
          value: new THREE.TextureLoader().load(
            "https://makio135.com/matcaps/64/537387_75BBB9_152E5B_0E85E8-64px.png"
          ),
        },
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new THREE.PlaneGeometry(10, 5, 5, 1);
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.plane.position.x = 1;
    this.scene.add(this.plane);

    this.material2 = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
    });
  }

  stop() {
    this.paused = true;
  }

  play() {
    this.paused = false;
    this.render();
  }

  render() {
    if (this.paused) return;
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    requestAnimationFrame(this.render.bind(this));

    this.renderer.clear();
    this.renderer.render(this.scene2, this.camera);
    this.renderer.clearDepth();
    this.renderer.render(this.scene, this.camera);
  }
}
