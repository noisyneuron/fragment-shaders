// Author: playdo.io
// Title: shader_170319-4

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
    
    st -= 0.5;
    float a = PI/(sin(u_time*.05)/2.+1.);
    st *= mat2(cos(a), -sin(a),
              sin(a), cos(a));
    st += 0.5;
    
	// grid
    float grid =10.;
    st *= grid;
    float xo = sign(step(1.,mod(st.x,2.))*2.-1.);
    float yo = sign(step(1.,mod(st.y,2.))*2.-1.);
    st = fract(st);
    
	// st += vec2(0.5);
	// st *= 0.5;
    
    
	float adjustedTime = u_time*.4;
    float altTime = step(0.5,fract(adjustedTime*0.5));
    
    //move on x
    st.x += altTime*yo*fract(adjustedTime);
    st.x = fract(st.x);
    
    // // move on y
    st.y += (1.-altTime)*xo*fract(adjustedTime);
    st.y = fract(st.y);
    
	// triangle
    float tri = step(st.y,2.*st.x)*step(st.y,2.-(2.*st.x));
    color = vec3(tri);



    gl_FragColor = vec4(color,1.0);
}