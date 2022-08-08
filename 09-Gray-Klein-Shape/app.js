import * as THREE from "three";
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";
import * as dat from "dat.gui";

import { TimelineMax } from "gsap";
let OrbitControls = require("three-orbit-controls")(THREE);

// 【ParametricGeometry的使用】：https://blog.csdn.net/qq_30100043/article/details/78898102
// 【几何形数学公式】paulbourke.net

export default class Sketch {
  constructor(selector) {
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x273838, 1);

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
    this.camera.position.set(0, 0, 6);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.paused = false;

    this.setupResize();

    this.addObjects();
    this.resize();
    this.render();
    // this.settings();
    console.log(this.geometry);
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
      },
      wireframe: true,
      // transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 10, 10);
    this.geometry = new THREE.ParametricBufferGeometry(
      this.grayKleinFunction,
      100,
      100
    );
    this.geometry1 = new THREE.ParametricBufferGeometry(
      this.tourFunction,
      100,
      100
    );

    this.geometry.setAttribute(
      "position1",
      new THREE.BufferAttribute(this.geometry1.attributes.position.array, 3)
    );

    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  // 生成平面的参数方程
  planeFunction(u, v, target) {
    let x = u;
    let y = v;
    let z = 0;
    target.set(x, y, 0);
  }

  // 生成球体的参数方法
  sphereFunction(u, v, target) {
    u *= Math.PI * 2;
    v *= -Math.PI;
    let x = Math.sin(u) * Math.cos(v);
    let y = Math.sin(u) * Math.sin(v);
    let z = Math.cos(u);
    target.set(x, y, z);
  }

  // 生成Klein形状的参数方法
  kleinFunction(u, v, target) {
    let a = 1;
    u *= Math.PI * 2;
    v *= Math.PI * 2;
    let x =
      Math.cos(u) *
      (a +
        Math.sin(v) * Math.cos(u / 2) -
        (Math.sin(2 * v) * Math.sin(u / 2)) / 2);
    let y =
      Math.sin(u) *
      (a +
        Math.sin(v) * Math.cos(u / 2) -
        (Math.sin(2 * v) * Math.sin(u / 2)) / 2);
    let z =
      Math.sin(u / 2) * Math.sin(v) + (Math.cos(u / 2) * Math.sin(2 * v)) / 2;
    target.set(x, y, z);
  }

  // 生成Gray's Klein 形状函数
  grayKleinFunction(u, v, target) {
    u *= Math.PI * 4;
    v *= Math.PI * 2;
    let a = 2.5;
    let n = 3;
    let m = 3;
    let x =
      (a +
        Math.cos((n * u) / 2.0) * Math.sin(v) -
        Math.sin((n * u) / 2.0) * Math.sin(2 * v)) *
      Math.cos((m * u) / 2.0);
    let y =
      (a +
        Math.cos((n * u) / 2.0) * Math.sin(v) -
        Math.sin((n * u) / 2.0) * Math.sin(2 * v)) *
      Math.sin((m * u) / 2.0);
    let z =
      Math.sin((n * u) / 2.0) * Math.sin(v) +
      Math.cos((n * u) / 2.0) * Math.sin(2 * v);

    target.set(x, y, z);
  }

  // 生成tour 形状的参数方法
  tourFunction(u, v, target) {
    u *= Math.PI * 2;
    v *= Math.PI * 2;

    let x = Math.cos(v) + Math.sin(u) * Math.cos(v);
    let y = Math.sin(v) + Math.sin(u) * Math.sin(v);
    let z = Math.cos(u);

    target.set(x, y, z);
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
    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch("container");
