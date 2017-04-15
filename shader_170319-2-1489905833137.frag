// Author: playdo.io
// Title: shader_170319-2

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
    float xo = sign(mod(idx.x,2.)-.1);
    float yo = sign(mod(idx.y,2.)-.1);
    
    // time alt
    float t = step(0.5,fract(.5*u_time));
    
    // rotate
    float a = u_time*2.;
    st -= vec2(st/10.);
    st *= mat2(cos(a), -sin(a),
              sin(a), cos(a));
    st += vec2(idx/10.);
    
    
    // color
    float r = 0.3;
    float d = distance(vec2(0.5),st);
    
    vec3 c = vec3(1.-smoothstep(r,r+0.21,d));

    
    gl_FragColor = vec4(c,1.0);
}