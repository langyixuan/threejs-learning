import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";
import * as dat from "dat.gui";

import { TimelineMax } from "gsap";
let OrbitControls = require("three-orbit-controls")(THREE);

let colors = require("nice-color-palettes");
let randomNum = Math.floor(Math.random() * colors.length);
let randomArr = [5, 13, 10, 11, 7, 15, 17, 18, 20];
let pallete = colors[5];
pallete = pallete.map((color) => new THREE.Color(color));

import roseModel from "./model/rose/scene-processed.glb";
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load(
  "https://makio135.com/matcaps/64/2D2D2F_C6C2C5_727176_94949B-64px.png"
);

import "./utils/bottomAnimation";

export default class Sketch {
  constructor(selector) {
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x454545, 1);

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

    // var frustumSize = 10;
    // var aspect = window.innerWidth / window.innerHeight;
    // this.camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000 );
    this.camera.position.set(0, 0, 0.3);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.paused = false;

    this.setupResize();
    this.addObjects();
    this.resize();
    this.render();
    this.mouseEvnets();
    // this.settings();

    this.loader = new GLTFLoader();
    this.loader.load(roseModel, (gltf) => {
      this.scene.add(gltf.scene);
      this.model = gltf.scene;

      gltf.scene.scale.set(0.02, 0.02, 0.02);
      gltf.scene.position.y = 0.02;
      gltf.scene.position.z = 0.2;

      gltf.scene.rotation.y = Math.PI / 2;
      gltf.scene.rotation.x = Math.PI / 5;

      gltf.scene.traverse((o) => {
        if (o.isMesh) {
          o.material = this.material2;
        }
      });
    });
  }

  mouseEvnets() {
    this.mouse = new THREE.Vector2();
    document.addEventListener("mousemove", (e) => {
      this.mouse.x = e.pageX / this.width - 0.5;
      this.mouse.y = -e.pageY / this.height + 0.5;
      this.model.rotation.y = Math.sin(this.mouse.x) * 3.14 * 1.8;
      this.model.position.z = 0.2 + 0.05 * Math.sin(this.mouse.x);
    });

    document.addEventListener("click", () => {
      const index = randomArr[Math.floor(Math.random() * randomArr.length)];
      pallete = colors[index];
      pallete = pallete.map((color) => new THREE.Color(color));
      this.material.uniforms.uColor.value = pallete;
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

    // image cover
    this.imageAspect = 853 / 1280;
    let a1;
    let a2;
    if (this.height / this.width > this.imageAspect) {
      a1 = (this.width / this.height) * this.imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = this.height / this.width / this.imageAspect;
    }

    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = a1;
    this.material.uniforms.resolution.value.w = a2;

    // optional - cover with quad
    // const dist  = this.camera.position.z;
    // const height = 1;
    // this.camera.fov = 2*(180/Math.PI)*Math.atan(height/(2*dist));

    // // if(w/h>1) {
    // if(this.width/this.height>1){
    //   this.plane.scale.x = this.camera.aspect;
    //   // this.plane.scale.y = this.camera.aspect;
    // } else{
    //   this.plane.scale.y = 1/this.camera.aspect;
    // }

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
        uColor: { value: pallete },
        uMouse: { value: new THREE.Vector2() },
      },
      wireframe: true,
      flatShading: true,
      transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new THREE.PlaneGeometry(2.6, 2.6, 350, 350);

    this.plane = new THREE.Mesh(this.geometry, this.material);
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
    this.time += 0.0005;
    this.material.uniforms.time.value = this.time;
    if (this.mouse) {
      this.material.uniforms.uMouse.value = this.mouse;
    }
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch("container");
