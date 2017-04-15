// Author: playdo.io
// Title: shader_170314-2

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    vec2 pos = vec2(0.5)-st;

    float r = length(pos)*2.0;
    float a = atan(pos.y,pos.x);
    
    float t = 3.15;

    float adjustedTime =  mod(u_time/2., t);

	float f = cos(a*adjustedTime)*sin(adjustedTime);
	
    float d = distance(r, f);
    color = vec3( fract(d*2.) );

    gl_FragColor = vec4(color, 1.0);
}