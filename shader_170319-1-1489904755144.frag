// Author: playdo.io
// Title: shader_170319-1

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    
    // grid
    float grid = 10.;
    st *= grid;
    vec2 idx = floor(st);
    st = fract(st);
    
    // odd-even
    float yo = sign(mod(idx.y,2.)-.1);
    float xo = sign(mod(idx.x,2.)-.1);
    
    // time alt
    float t = step(0.5,fract(.5*u_time));
    
    // move
    st.x += t*yo*fract(u_time);
    st.x = fract(st.x);
    
    st.y += (1.-t)*xo*fract(u_time);
    st.y = fract(st.y);
    
    float r = 0.2;
    float d = distance(vec2(0.5),st);
    
    vec3 c = vec3(1.-smoothstep(r,r+0.21,d));

    
    gl_FragColor = vec4(c,1.0);
}