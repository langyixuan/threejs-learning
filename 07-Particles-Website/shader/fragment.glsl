uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec4 resolution;
varying vec2 vUv;
varying vec4 vPosition;

void main(){
	// vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
	float d=length(gl_PointCoord-vec2(.5));
	float a=1.-smoothstep(0.,.5,d);
	gl_FragColor=vec4(fract(sin(time*.1)*.6),0,0,a);
}
// fract(sin(time*.1)*.6)