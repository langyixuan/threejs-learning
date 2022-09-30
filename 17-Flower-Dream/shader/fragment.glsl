uniform float time;
uniform vec4 resolution;

varying vec2 vUv;
varying vec4 vPosition;
varying vec3 vColor;

float rand(vec2 co){
	return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453);
}

void main(){
	vec2 newUV=(vUv-vec2(.5))*resolution.zw+vec2(.5);
	float dist=length(vUv-vec2(.5));
	float grain=mix(-1.5*sin(time*.4)+.1,.35*cos(time*.4)+.1,rand(newUV));
	vec3 bg=mix(vec3(.0157,.0941,.4824),vec3(.702,1.,0.),grain+dist+.2*sin(time));
	
	gl_FragColor=vec4(vColor+bg,1.);
}