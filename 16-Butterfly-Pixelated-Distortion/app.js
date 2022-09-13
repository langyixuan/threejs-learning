import * as THREE from "three";
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";
import * as dat from "dat.gui";

import { TimelineMax } from "gsap";
let OrbitControls = require("three-orbit-controls")(THREE);

import uTexture1 from "./img/t1.jpg";
import uTexture2 from "./img/t2.jpg";
import uTexture3 from "./img/t3.jpg";
import uTexture4 from "./img/t4.jpg";

import "./utils/bottomAnimation";

export default class Sketch {
  constructor(selector) {
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xc2bfba, 1);
    // a3a37a
    // bd242b

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

    var frustumSize = 1;
    var aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.OrthographicCamera(
      frustumSize / -2,
      frustumSize / 2,
      frustumSize / 2,
      frustumSize / -2,
      -1000,
      1000
    );
    this.camera.position.set(0, 0, 2);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;
    this.paused = false;

    this.setupResize();
    this.addObjects();
    this.resize();
    this.render();
    // this.settings();

    this.mouse = {
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      vX: 0,
      vY: 0,
    };
    this.mouseEvents();

    this.changeTexture();
    this.textureArrIndex = 0;
  }

  mouseEvents() {
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX / this.width;
      this.mouse.y = e.clientY / this.height;
      // console.log(this.mouse.x, this.mouse.y);
      this.mouse.vX = this.mouse.x - this.mouse.prevX;
      this.mouse.vY = this.mouse.y - this.mouse.prevY;
      // console.log(this.mouse.vX, this.mouse.vY);
      this.mouse.prevX = this.mouse.x;
      this.mouse.prevY = this.mouse.y;
      // console.log(this.mouse.prevX, this.mouse.prevY);
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
    this.imageAspect = 800 / 1280;
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

    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    this.nums = 100;
    const width = this.nums;
    const height = this.nums;

    const size = width * height;
    const data = new Float32Array(3 * size);
    const color = new THREE.Color(0xffffff);

    const r = Math.floor(color.r * 255);
    const g = Math.floor(color.g * 255);
    const b = Math.floor(color.b * 255);

    for (let i = 0; i < size; i++) {
      let r = Math.random() * 100;
      const stride = i * 3;
      data[stride] = r;
      data[stride + 1] = r;
      data[stride + 2] = r;
    }

    // used the buffer to create a DataTexture
    this.texture = new THREE.DataTexture(
      data,
      width,
      height,
      THREE.RGBFormat,
      THREE.FloatType
    );
    this.texture.magFilter = this.texture.minFilter = THREE.NearestFilter;

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
        uTexture: {
          type: "t",
          value: new THREE.TextureLoader().load(uTexture1),
        },
        uDataTexture: { value: this.texture },
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  stop() {
    this.paused = true;
  }

  play() {
    this.paused = false;
    this.render();
  }

  updateDataTexture() {
    let data = this.texture.image.data;
    for (let i = 0; i < data.length; i += 3) {
      data[i] *= 0.9;
      data[i + 1] *= 0.9;
    }
    if (this.mouse) {
      let gridMouseX = this.nums * this.mouse.x;
      let gridMouseY = this.nums * (1 - this.mouse.y);
      let maxDist = 8;
      // console.log(gridMouseX, gridMouseY);

      for (let i = 0; i < this.nums; i++) {
        for (let j = 0; j < this.nums; j++) {
          let distance = (gridMouseX - i) ** 2 + (gridMouseY - j) ** 2;
          let maxDistSq = maxDist ** 2;
          // console.log(distance, maxDistSq);
          if (distance < maxDistSq) {
            let index = 3 * (i + this.nums * j);
            let power = maxDist / Math.sqrt(distance);
            power = 1.2;
            // data[index] = 0;
            // data[index + 1] = 0;
            data[index] += 100 * this.mouse.vX * power;
            data[index + 1] -= 100 * this.mouse.vY * power;
          }
        }
      }
      this.mouse.vX *= 0.9;
      this.mouse.vY *= 0.9;
    }
    this.texture.needsUpdate = true;
  }

  changeTexture() {
    let textureArr = [uTexture1, uTexture2, uTexture3, uTexture4];
    window.addEventListener("click", () => {
      if (this.textureArrIndex < textureArr.length - 1) {
        this.textureArrIndex++;
        this.material.uniforms.uTexture.value = new THREE.TextureLoader().load(
          textureArr[this.textureArrIndex]
        );
      } else {
        this.textureArrIndex = 0;
        this.material.uniforms.uTexture.value = new THREE.TextureLoader().load(
          textureArr[this.textureArrIndex]
        );
      }
      console.log(this.textureArrIndex);
    });
  }

  render() {
    if (this.paused) return;
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
    this.updateDataTexture();
  }
}

new Sketch("container");
