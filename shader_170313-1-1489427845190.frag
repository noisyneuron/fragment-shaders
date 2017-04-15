// Author: playdo.io
// Title: shader_170313-1

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution.xy;
    
	float stime = (sin(u_time*0.25)+5.)/10.;
    float ctime = (cos(u_time*0.25)+5.)/10.;
    
    vec2 p1 = smoothstep(vec2(.4,.6), vec2(.6,.4), vec2(stime,stime));
    vec2 p2 = smoothstep(vec2(.6,.4), vec2(.4,.6), vec2(stime,ctime));
    vec2 p3 = smoothstep(vec2(.4,.4), vec2(.6,.6), vec2(ctime,stime));
    vec2 p4 = smoothstep(vec2(.6,.6), vec2(.4,.4), vec2(ctime,ctime));
    
    
   
    float d1 = distance(st, p1 )*2.;
    float d2 = min(d1, distance(st, p2 )*2.);
    float d3 = min(d2, distance(st, p3 )*2.);
    float d4 = min(d3,distance(st, p4 )*2.);

    
	vec3 c = vec3(1.-d4);
	gl_FragColor = vec4(c,1.0);
}