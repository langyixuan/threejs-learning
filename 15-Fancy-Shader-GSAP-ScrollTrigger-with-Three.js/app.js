import Sketch from "./module";
import { SplitText } from "./utils/splitText";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

let sketch = new Sketch("container");

// Titles Animation
let titles = [...document.querySelectorAll("h1")];
titles.forEach((title) => {
  let mySplitTitle = new SplitText(title);
  gsap.from(mySplitTitle.chars, {
    scrollTrigger: {
      trigger: title,
      scrub: true,
      toggleActions: "restart pause reverse pause",
    },
    duration: 0.5,
    stagger: 0.07,
    scale: 1.2,
    autoAlpha: 0.3,
    rotation: 30,
  });
});

// Content Animation
let contents = [...document.querySelectorAll(".text p")];
let t1 = gsap.timeline({
  repeat: -1,
  repeatDelay: 0.5,
  yoyo: true,
});
t1.set(".text p", { perspective: 400 });
contents.forEach((content) => {
  let splitContent = new SplitText(content);
  t1.from(splitContent.words, {
    duration: 0.5,
    opacity: 1.0,
    x: gsap.utils.random(-300, 300, true),
    y: gsap.utils.random(0, 0, true),
    z: gsap.utils.random(-500, 800, true),
    stagger: {
      amount: 3,
    },
    backgroundColor: "#31B816",
    color: "#000",
  });
});

let o = { a: 0 };
gsap.to(o, {
  a: 2,
  scrollTrigger: {
    trigger: ".text",
    markers: false,
    start: "top top",
    end: "bottom bottom",
    snap: 1 / (titles.length - 1),
    onUpdate: (self) => {
      if (sketch) {
        sketch.model.rotation.y = 2.0 * 3.14 * self.progress + Math.PI;
        sketch.camera.position.z = 2.0 - Math.sin(3.14 * self.progress) * 0.9;
        sketch.plane.rotation.y = Math.PI * self.progress * 0.1;
        sketch.plane.rotation.z = Math.PI * self.progress * 0.1;
      }
    },
  },
});

// Bottom Desc Animation
// Variables
const el = document.querySelector(".desc p");

// Variables ~ Widths
let elWidth = el.offsetWidth;
let windowWidth = window.innerWidth;

// Variables ~ Mouse
let mouseX = 0;
let prevMouseX = 0;

// Target: value we want to animate to
let skewTarget = 0;
let translateTarget = 0;

// WithEasing: value we use to animate
let skewWithEasing = 0;
let translateWithEasing = 0;

// EasingFactor: determines how quick the animation/interpolation goes
let skewEasingFactor = 0.1;
let translateEasingFactor = 0.05;

// Events
window.addEventListener("scroll", handleMouseMove);
window.addEventListener("resize", handleWindowResize);

// Functions
function handleMouseMove(e) {
  console.log(222);
  let scrollTop =
    document.documentElement.scrollTop ||
    window.pageYOffset ||
    document.body.scrollTop;
  console.log(scrollTop);
  mouseX = scrollTop * 2.0;
}

function handleWindowResize(e) {
  elWidth = el.offsetWidth;
  windowWidth = window.innerWidth;
}

function lerp(start, end, factor) {
  return (1 - factor) * start + factor * end;
}

function animateMe() {
  // Get difference between current and previous mouse position
  skewTarget = mouseX - prevMouseX;
  prevMouseX = mouseX;

  // Calc how much we need to translate our el
  translateTarget = ((elWidth - windowWidth) / windowWidth) * mouseX * -1;

  // Ease between start and target values (skew)
  skewWithEasing = lerp(skewWithEasing, skewTarget, skewEasingFactor);

  // Limit our skew to a range of 75 degrees so it doesn't "over-skew"
  skewWithEasing = Math.min(Math.max(parseInt(skewWithEasing), -75), 75);

  // Ease between start and target values (translate)
  translateWithEasing = lerp(
    translateWithEasing,
    translateTarget,
    translateEasingFactor
  );

  el.style.transform = `
    translateX(${translateWithEasing}px)
    skewX(${skewWithEasing}deg)
  `;

  // RAF
  window.requestAnimationFrame(animateMe);
}

window.requestAnimationFrame(animateMe);
