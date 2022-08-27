uniform float time;
uniform vec2 mouse;
uniform vec4 resolution;
varying vec2 vUv;
varying vec4 vPosition;

float PI=3.141592653589793238;
mat4 rotation3d(vec3 axis,float angle){
	axis=normalize(axis);
	float s=sin(angle);
	float c=cos(angle);
	float oc=1.-c;
	
	return mat4(
		oc*axis.x*axis.x+c,oc*axis.x*axis.y-axis.z*s,oc*axis.z*axis.x+axis.y*s,0.,
		oc*axis.x*axis.y+axis.z*s,oc*axis.y*axis.y+c,oc*axis.y*axis.z-axis.x*s,0.,
		oc*axis.z*axis.x-axis.y*s,oc*axis.y*axis.z+axis.x*s,oc*axis.z*axis.z+c,0.,
		0.,0.,0.,1.
	);
}

vec3 rotate(vec3 v,vec3 axis,float angle){
	mat4 m=rotation3d(axis,angle);
	return(m*vec4(v,1.)).xyz;
}

float sphere(vec3 p){
	return length(p)-.8;
}

float sdBox(vec3 p,vec3 b){
	vec3 q=abs(p)-b;
	return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.);
}

float SineCrazy(vec3 p){
	return.5-(sin(p.x)+sin(p.y)+sin(p.z))/2.;
}

float sdf(vec3 p){
	vec3 p1=rotate(p,vec3(1.),time/6.);
	float scale=25.+15.*sin(time/6.);
	return max(sphere(p1),(.85-SineCrazy(p1*scale))/scale);
}

vec3 calcNormal(in vec3 p)// for function f(p)
{
	const float eps=.0001;// or some other value
	const vec2 h=vec2(eps,0);
	return normalize(vec3(sdf(p+h.xyy)-sdf(p-h.xyy),
	sdf(p+h.yxy)-sdf(p-h.yxy),
	sdf(p+h.yyx)-sdf(p-h.yyx)));
}

vec3 getColor(float amount){
	vec3 col=.5+.5*cos(6.28318530718*(vec3(1.,1.,1.)+amount*vec3(1.,1.,1.)));
	return col*amount;
}

vec3 getColorAmount(vec3 p){
	float amount=clamp((1.5-length(p))/2.,.2,1.);
	// vec3 col=.5+.5*cos(6.28318530718*(vec3(1.,1.,1.)+amount*vec3(.5725,.4039,.0941)));
	vec3 col=vec3(0.,0.,0.)+vec3(1.,1.,1.)*cos(6.28319*(vec3(1.,0.,0.)+amount*vec3(1.,1.,1.)));
	return col*amount;
}

float rand(vec2 co){
	return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453);
}

void main(){
	float dist=length(vUv-vec2(.5));
	vec2 newUV=(vUv-vec2(.5))*resolution.zw+vec2(.5);
	float grain=mix(-.15*sin(time*.4)+.1,.15*cos(time*.4)+.1,rand(newUV));
	vec3 bg=mix(vec3(0.,0.,0.),vec3(.5804,.1569,.0275),grain);
	
	vec2 p=newUV-vec2(.5);
	p.x+=mouse.x*.03;
	p.y+=mouse.y*.03;
	
	vec3 camPos=vec3(0.,0.,2.+.8*sin(time/4.));
	// vec3 ray=normalize(vec3(newUV-vec2(.5),-1.));
	vec3 ray=normalize(vec3(p,-1));
	
	vec3 rayPos=camPos;
	float curDist=0.;
	float rayLen=0.;
	
	vec3 color=vec3(.0078,.2471,.4431);
	vec3 light=vec3(-1.,1.,1.);
	
	for(int i=0;i<=64;i++){
		curDist=sdf(rayPos);
		rayLen+=.6*curDist;
		rayPos=camPos+ray*rayLen;
		
		if(abs(curDist)<.001){
			vec3 n=calcNormal(rayPos);
			float diff=dot(n,light);
			// color=getColor(diff);
			// color=getColor(2.*length(rayPos));
			break;
		}
		color+=.04*vec3(getColorAmount(rayPos))+bg*.2;
		
	}
	gl_FragColor=vec4(color,1.);
	gl_FragColor.r-=abs(mouse.x)*.6;
}