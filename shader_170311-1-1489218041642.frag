// Author: playdio.io
// Title: shader_170311-1

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    
    // float a = (abs(acos(st.x))+abs(sin(st.y))+abs(sin(u_time)))/.7;
    vec2 d = vec2(.5)-st;
    float a = (st.x+st.y)*2.*cos(atan(d.y,d.x)+u_time/5.);
    
    float freq = 0.4;//(cos(u_time)/2.)+1.; 
    float m = mod(a, freq);
    float c = step(freq/2., m);

    vec3 color = m*vec3(1.);
    // color = vec3(st.x,st.y,abs(sin(u_time)));

    gl_FragColor = vec4(color,1.0);
}