uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec4 resolution;
varying vec2 vUv;
varying vec4 vPosition;
varying float vProgress;

void main(){
	float dist=length(gl_PointCoord-vec2(.5));
	float alpha=1.-smoothstep(.45,.5,dist);
	// vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
	gl_FragColor=vec4(1.,1.,1.,alpha*.5+.5*vProgress);
}