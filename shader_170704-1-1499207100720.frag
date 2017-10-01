// Author: playdo.io
// Title: shader_170704-1

#ifdef GL_ES
precision mediump float;
#endif

#define PI radians(180.)

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.);
    
    st = st*2. - 1.;
    
    st *= .17;
    
    float a = atan(st.y,st.x);
    float l = length(st);
    
    // st = l+abs(sin(0.4*u_time)+0.1)*0.2 * vec2(cos(a), sin(a));
    
    st =  pow(l,1.) *  abs(sin(cos(l*14.)+u_time*0.4)+ 1.) * vec2(cos(a), sin(a));
    
    float L = .5;
    float n = 42.;//abs(sin(u_time*0.3))*20.;
    float m = abs(sin(u_time*0.2)) * (n-2.) + 1.;
    
    //chladni pattern
    
    float ch = cos(n*PI*st.x/L)*cos(m*PI*st.y/L) - cos(m*PI*st.x/L)*cos(n*PI*st.y/L);
    
    float c = smoothstep(0., 2.51, ch);
    
    color = vec3(ch);

    gl_FragColor = vec4(color,1.0);
}