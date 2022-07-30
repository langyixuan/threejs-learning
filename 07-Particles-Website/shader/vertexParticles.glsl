uniform float time;
varying vec2 vUv;
varying vec2 vUv1;
varying vec4 vPosition;
varying float vAlpha;

uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec2 pixels;
uniform vec2 uvRate1;
uniform vec2 uMouse;

attribute float angle;
attribute float life;
attribute float offset;

void main(){
  vUv=uv;
  
  float current=mod(offset+time/2.,life);
  float percent=current/life;
  
  // vAlpha=smoothstep(0.,.05,percent);
  // vAlpha-=smoothstep(.85,1.,percent);
  
  vec3 newPosition=position;
  float dir=angle+sin(time/20.);
  newPosition.x+=cos(dir)*current*.15;
  newPosition.y+=sin(dir)*current*.15;
  
  vec3 currentPosition=newPosition;
  float mouseRadius=.85;
  float dist=distance(currentPosition.xy,uMouse);
  float strength=dist/mouseRadius;
  strength=1.-smoothstep(0.,1.,strength);
  float dx=uMouse.x-currentPosition.x;
  float dy=uMouse.y-currentPosition.y;
  float angleangle=atan(dy,dx);
  
  newPosition.x+=cos(angleangle)*strength*.42;
  newPosition.y+=sin(angleangle)*strength*.42;
  
  vec4 mvPosition=modelViewMatrix*vec4(newPosition,1.);
  gl_PointSize=20.*dx*(1./-mvPosition.z);
  gl_Position=projectionMatrix*mvPosition;
}