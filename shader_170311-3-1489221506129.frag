// Author: playdio.io
// Title: shader_170311-3

#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718 
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0, 
                     0.0, 
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    
    vec2 d = vec2(.5)-st;
    // float a = (st.x+st.y)*2.*cos(atan(d.y,d.x)+u_time/5.);
    
    float a = (st.x+st.y) + (acos(cos(d.x*(u_time+1000.)*2.))/TWO_PI);
    float freq = .8;//(cos(u_time)/2.)+1.; 
    float m = mod(a, freq);
    float c = step(freq/2., m);


    vec3 color = m*vec3(1.);
    vec3 color2 = vec3(m, c, .8);
    // color = vec3(st.x,st.y,abs(sin(u_time)));

    gl_FragColor = vec4(hsb2rgb(color2),1.0);
}