// Author: playdo.io
// Title: shader_170526-1

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.2831853071

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(1.);
    
    st = st * 2. - 1.;
    
    
	// grid
    float grid =.3;
    st *= grid;
    
    float r = length(st);
    r *= length(st);
    r /= pow( -0.008 -pow(st.x,2.)-pow(st.y,2.) , 2.00);
    r = pow(r, 0.5);
    float theta = atan(st.y,st.x);
    st = r*vec2(cos(theta), sin(theta));
    
    
    
    float xo = sign(step(1.,mod(st.x,2.))*2.-1.);
    float yo = sign(step(1.,mod(st.y,2.))*2.-1.);
    st = fract(st);
    
	
    
	float adjustedTime = u_time*.4;
    float altTime = 0.;//step(0.5,fract(adjustedTime*0.5));
    
    //move on x
    st.x += altTime*yo*fract(adjustedTime);
    st.x = fract(st.x);
    
    // // move on y
    st.y += (1.-altTime)*xo*fract(adjustedTime);
    st.y = fract(st.y);
    
	// triangle
    float tri = smoothstep(st.y,st.y+.6, 2.*st.x) * smoothstep(st.y,st.y+.6, 2.-(2.*st.x));
    color = vec3(tri);



    gl_FragColor = vec4(color,1.0);
}