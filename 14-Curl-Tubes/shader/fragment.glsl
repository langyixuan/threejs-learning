uniform float time;
uniform vec4 resolution;
uniform vec3 uLight;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 v_worldPosition;

// calculate light scattering
float getScatter(vec3 cameraPos,vec3 dir,vec3 lightPos,float d){
	// light to ray origin
	vec3 q=cameraPos-lightPos;
	// coefficients
	float b=dot(dir,q);
	float c=dot(q,q);
	// evaluate integral
	float t=c-b*b;
	float s=1./sqrt(max(.0001,t));
	float l=s*(atan((d+b)*s)-atan(b*s));
	return pow(max(0.,l/150.),.4);
}

float rand(vec2 co){
	return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453);
}

void main(){
	vec2 newUV=(vUv-vec2(.5))*resolution.zw+vec2(.5);
	vec3 cameraToWorld=v_worldPosition-cameraPosition;
	vec3 cameraToWorldDir=normalize(cameraToWorld);
	float cameraWorldDistance=length(cameraToWorld);
	
	vec3 lightToWorld=normalize(uLight-v_worldPosition);
	float diffusion=max(0.,dot(vNormal,lightToWorld));
	float dist=length(uLight-vPosition);
	
	float scatter=getScatter(cameraPosition,cameraToWorldDir,uLight,cameraWorldDistance);
	
	float dist2=length(vUv-vec2(.5));
	float grain=mix(-.15*sin(time*.4)+.1,.15*cos(time*.4)+.1,rand(newUV));
	vec3 bg=mix(vec3(0.,0.,0.),vec3(.5804,.1569,.0275),grain);
	vec3 color=bg+(0.,scatter,scatter);
	
	gl_FragColor=vec4(1.-dist,0.,0.,1.);
	gl_FragColor=vec4(diffusion,0.,0.,1.);
	gl_FragColor=vec4(scatter,0.,0.,1.);
	gl_FragColor=vec4(scatter,scatter,scatter,1.);
}