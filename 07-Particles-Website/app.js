import * as THREE from "three";
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertexParticles.glsl";
import * as dat from "dat.gui";

import { TimelineMax } from "gsap";
import threeOrbitControls from "three-orbit-controls";
import { MeshMatcapMaterial } from "three";
let OrbitControls = require("three-orbit-controls")(THREE);

export default class Sketch {
  constructor(selector) {
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: true,
      alpha: true,
    });
    this.renderer.autoClear = false;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1);

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
    this.camera.position.set(0, 0, 2);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.paused = false;

    // 光线投射来设置鼠标交互
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.clock = new THREE.Clock();

    this.setupResize();

    this.addObjects();
    this.resize();
    this.render();
    this.mousemove();
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
    /**
     * Box
     */
    const textureLoader = new THREE.TextureLoader();
    const matcapTexture = textureLoader.load(
      "https://makio135.com/matcaps/64/4F4C45_A7AEAA_7A8575_9D97A2-64px.png"
    );
    const matcapTexture2 = textureLoader.load(
      "https://makio135.com/matcaps/64/515151_DCDCDC_B7B7B7_9B9B9B-64px.png"
    );
    this.box = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.8, 30, 30),
      new MeshMatcapMaterial({
        matcap: matcapTexture2,
      })
    );
    this.box.rotation.y = Math.PI * 0.5;
    this.box.rotation.x = Math.PI * 0.15;
    // this.scene.add(this.box);

    /**
     * Particles
     */
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        uMouse: { type: "v2", value: new THREE.Vector2(0, 0) },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      // wireframe: true,
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    this.geometry = new THREE.BufferGeometry();
    const count = 20000; // 粒子的个数
    const positions = new Float32Array(count * 3);
    const angles = new Float32Array(count);
    const life = new Float32Array(count); // 粒子的生命周期
    const offset = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions.set(
        [Math.random() * 0.3, Math.random() * 0.3, Math.random() * 0.3],
        3 * i
      );
      angles.set([Math.random() * Math.PI * 2], i);
      life.set([Math.random() * 10 + 4], i);
      offset.set([1000 * Math.random()], i);
    }

    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    this.geometry.setAttribute("angle", new THREE.BufferAttribute(angles, 1));
    this.geometry.setAttribute("life", new THREE.BufferAttribute(life, 1));
    this.geometry.setAttribute("offset", new THREE.BufferAttribute(offset, 1));

    this.dot = new THREE.Points(this.geometry, this.material);
    // this.dot.position.set(-1, -1, 0);
    this.scene.add(this.dot);

    /**
     * Plane
     */
    this.clearPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 7),
      new THREE.MeshBasicMaterial({
        transparent: true,
        color: 0x00ccff,
        opacity: 0.01,
      })
    );
    this.scene.add(this.clearPlane);
  }

  mousemove() {
    let self = this;
    function onMouseMove(event) {
      self.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      self.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      self.raycaster.setFromCamera(self.mouse, self.camera);

      let intersects = self.raycaster.intersectObjects([self.clearPlane]);

      if (intersects[0]) {
        let point = intersects[0].point;
        self.material.uniforms.uMouse.value = new THREE.Vector2(
          point.x,
          point.y
        );
      }
    }
    window.addEventListener("mousemove", onMouseMove);
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
