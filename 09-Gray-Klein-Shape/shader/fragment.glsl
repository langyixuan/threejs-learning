uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec4 resolution;
varying vec2 vUv;
varying vec4 vPosition;
varying vec3 vNormal;

void main(){
	float diff=abs(dot(normalize(vec3(1.,1.,1.)),vNormal));
	
	vec3 a=vec3(.5,.5,.5);
	vec3 b=vec3(.5,.5,.5);
	vec3 c=vec3(1.,1.,1.);
	vec3 d=vec3(.3,.2,.2);
	
	// vec3 a=vec3(.5,.5,.5);
	// vec3 b=vec3(.5,.5,.5);
	// vec3 c=vec3(1.,1.,1.);
	// vec3 d=vec3(0.,.1,.2);
	
	// vec3 a=vec3(.5,.5,.5);
	// vec3 b=vec3(.5,.5,.5);
	// vec3 c=vec3(1.,.7,.4);
	// vec3 d=vec3(0.,.15,.2);
	
	// vec3 a=vec3(.8,.5,.4);
	// vec3 b=vec3(.2,.4,.2);
	// vec3 c=vec3(2.,1.,1.);
	// vec3 d=vec3(0.,.25,.25);
	
	vec3 color=a+b*cos(2.*3.1415925*(c*diff+d+time*.3));
	
	gl_FragColor=vec4(color,1.);
}