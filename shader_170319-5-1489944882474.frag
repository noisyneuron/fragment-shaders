// Author: playdo.io
// Title: shader_170319-5

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
    

    
	// grid
    float grid =4.;
    st *= grid;
    float xo = sign(step(1.,mod(st.x,2.))*2.-1.);
    float yo = sign(step(1.,mod(st.y,2.))*2.-1.);
    st = fract(st);
    
	// st += vec2(0.5);
	// st *= 0.5;
    
    st -= 0.5;
    st*=4.;
    float a = PI/2.;
    st *= mat2(cos(a), -sin(a),
              sin(a), cos(a));
    st += 0.5;
    
	float adjustedTime = u_time*.4;
    float altTime = step(0.5,fract(adjustedTime*0.5));
    
    //move on x
    st.x += altTime*yo*fract(adjustedTime);
    st.x = fract(st.x);
    
    // // move on y
    st.y += altTime*xo*fract(adjustedTime);
    st.y = fract(st.y);
    
	// triangle
    float tri = step(st.y,2.*st.x)*step(st.y,2.-(2.*st.x));
    color = vec3(tri*st.y*st.x*1.4);



    gl_FragColor = vec4(color,1.0);
}