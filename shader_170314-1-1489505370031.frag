// Author: playdo.io
// Title: shader_170314-1

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    
    st = st*2.-1.;
    
    float d = distance(vec2(0.2), abs(st));
    float d2 = distance(vec2(0.6), abs(st));
    d = max(d,d2);

    // d = d/4.;
    vec3 color = vec3(step(0.9,fract(d*1.*u_time)));
    // vec3 color = vec3(fract(d*10.));

    gl_FragColor = vec4(color,1.0);
}