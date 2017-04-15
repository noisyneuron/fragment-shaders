// Author: playdo.io
// Title: shader_170315-1

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

    float adjustedTime = 0.*u_time;
    float t1 = sin(u_time*.2)*6.;
    float t2 = sin(u_time*.2)*6.;
    // float f = cos(a*adjustedTime*2.)*sin(a*adjustedTime*2.);
	float f = 2.*cos(a*t1)*sin(2.*t2);
	
    float d = distance(r, f);
    d *= step(1.-r,d);
    color = vec3( step(0.5,fract(d*20.))*.6 );

    gl_FragColor = vec4(color, 1.0);
}