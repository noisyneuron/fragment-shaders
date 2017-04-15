// Author: playdo.io
// Title: shader_170320-2

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
    st.x *= u_resolution.x/u_resolution.y;
	
    // st.x *= 2.*sqrt(.3125);
    vec3 color = vec3(0.0);
    float d = 0.0;
    
    // grid size
    st *=10.;
	
    //move alt x rows
    vec2 alt = step(1.,floor(mod(st,2.)));
    
    //grid
    st = mod(st,vec2((2./sqrt(3.))+(1./sqrt(3.)), 1.));
    st.x -= .5/sqrt(3.);
    
    // remap
    st = st*2.-1.;

    
    // Number of sides of your shape
    int N = 6;

    // Angle and radius from the current pixel
    float a = atan(st.x,st.y)+PI;
    float r = TWO_PI/float(N);

    // Shaping function that modulate the distance
    d = cos(floor(.5+a/r)*r-a)*length(st);
    
    float c = smoothstep(d,d+abs(1.-cos(u_time)),1.);
    
    if (c == 0.) {
        if(st.y > 0.0) {
            c = .15;//1.*alt.y;
        } else {
            c = .75;//abs(1.-alt.y);
        }
    } else {
        c = alt.y * (1.-c) *.4;
    }
    
    
    color = vec3(c);

    gl_FragColor = vec4(color,1.0);
}