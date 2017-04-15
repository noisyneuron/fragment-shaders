// Author: playdo.io
// Title: shader_170317-1

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.14159265359

/////////////////////////////
void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    float len = 40.;	
    float alt = step(len, mod(u_time, len*2.));
    float adjustedTime = abs(len*alt - mod(u_time,len));

    
    st -= vec2(0.5); 
    st *= mat2(cos(adjustedTime*st.x/st.y),-sin(2.*adjustedTime*st.y),
              sin(adjustedTime*st.x),cos(2.*adjustedTime*st.y/st.x));
	st -= vec2(0.5); 
    
    float grid = 1.;
    st *= grid;
    st = fract(st);
    st -= vec2(0.5);    	
    st *= mat2(cos(adjustedTime*st.x/st.y),-sin(adjustedTime),
              sin(adjustedTime),cos(adjustedTime*st.y/st.x));
    
    vec3 color = vec3(0.);
    
    
    color = vec3(.5*st.y,.1*st.x,st.x+st.y);
    
	
    gl_FragColor = vec4(color,1.0);

}

