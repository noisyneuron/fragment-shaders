// Author: playdo.io
// Title: shader_170320-1

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color;
    st = st*2.-1.;
    
    float atime = sin(u_time)*10.+20.;
    st *= mat2(cos(u_time*.3), -sin(u_time*.2),
               sin(u_time*.1), cos(u_time*.4));
    
    
    float rad = 0.1;
    float smod = .1;//cos(u_time)+2.;
    float spacing = rad*smod;
    float dist = distance(vec2(0.),st);
    
    float center = step(mod(dist, spacing),rad);
    
	center *=  mod(atan(st.y,st.x),PI/floor(dist*atime));
    
    // float c = 1.;
    
	color = vec3(center);
    
    
	// color = vec3(1.);
    // color = vec3(st.x,st.y,abs(sin(u_time)));

    gl_FragColor = vec4(color,1.0);
}