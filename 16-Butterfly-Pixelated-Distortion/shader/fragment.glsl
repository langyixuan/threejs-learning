uniform float time;
uniform sampler2D uTexture;
uniform sampler2D uDataTexture;
uniform vec4 resolution;
varying vec2 vUv;
varying vec4 vPosition;

float rand(vec2 co){
	return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453);
}

void main(){
	vec2 newUV=(vUv-vec2(.5))*resolution.zw+vec2(.5);
	vec4 color=texture2D(uTexture,newUV);
	vec4 offset=texture2D(uDataTexture,vUv);
	
	float dist=length(vUv-vec2(1.4));
	float grain=mix(-.55*sin(time*.05)+.1,.55*cos(time*.05)+.1,rand(newUV));
	vec3 bg=mix(vec3(.6471,.6471,.6471),vec3(0.,0.,0.),grain+dist+.05*sin(time));
	
	// gl_FragColor=vec4(vUv,0.,1.);
	// gl_FragColor=color;
	// gl_FragColor=offset;
	gl_FragColor=texture2D(uTexture,newUV-.1*vec2(offset.r))+vec4(bg,1.);
}