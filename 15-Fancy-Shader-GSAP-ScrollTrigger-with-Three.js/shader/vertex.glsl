uniform float time;
varying vec2 vUv;
varying vec4 vPosition;
varying vec3 vNormal;

void main(){
  vUv=uv;
  vNormal=normal;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}