uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;
uniform float uTime;

varying float vElevation;

void main(){
  float mixStrength=(vElevation+uColorOffset)*uColorMultiplier;
  
  vec3 color=mix(uDepthColor,uSurfaceColor,mixStrength+sin(uTime)*.001);
  gl_FragColor=vec4(color,1.);
}