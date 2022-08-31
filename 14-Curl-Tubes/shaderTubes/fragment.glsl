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
	return pow(max(0.,l/15.),.4);
}

void main(){
	// vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
	
	float dash=sin(vUv.x*50.+time/3.);
	if(dash<.3)discard;;
	vec3 cameraToWorld=v_worldPosition-cameraPosition;
	vec3 cameraToWorldDir=normalize(cameraToWorld);
	float cameraWorldDistance=length(cameraToWorld);
	
	vec3 lightToWorld=normalize(uLight-v_worldPosition);
	float diffusion=max(0.,dot(vNormal,lightToWorld));
	float dist=length(uLight-vPosition);
	
	float scatter=getScatter(cameraPosition,cameraToWorldDir,uLight,cameraWorldDistance);
	
	gl_FragColor=vec4(1.-dist,0.,0.,1.);
	gl_FragColor=vec4(0.,diffusion+scatter,scatter+diffusion,1.);
	// gl_FragColor=vec4(scatter,scatter,0.,1.);
}