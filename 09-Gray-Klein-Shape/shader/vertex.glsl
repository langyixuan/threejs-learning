uniform float time;
varying vec2 vUv;
varying vec4 vPosition;
uniform vec2 pixels;
varying vec3 vNormal;
attribute vec3 position1;

void main(){
  vUv=uv;
  vNormal=normal;
  
  vec3 final=mix(position,position1,.5+.5*sin(time*.5));
  gl_Position=projectionMatrix*modelViewMatrix*vec4(final,1.);
}