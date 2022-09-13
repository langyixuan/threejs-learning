import CircleType from "circletype";

const t1 = document.querySelector(".circle-text .t1");
const circleType1 = new CircleType(t1);
circleType1.radius(300);

const t2 = document.querySelector(".circle-text .t2");
const circleType2 = new CircleType(t2);
circleType2.radius(350);

window.addEventListener("mousemove", (e) => {
  t1.style.transform = `rotate(-${e.pageY * 0.05}deg)`;
  t2.style.transform = `rotate(${e.pageY * 0.03}deg)`;
});
