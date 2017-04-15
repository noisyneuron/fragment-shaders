// Author: playdo.io
// Title: shader_170316-1

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
	
    //remap
    st = st*2. - 1.;
    
    //grid
	float grid = 0.2;
    float radius = 0.09;
    vec2 center = grid * (floor(st/grid) + 0.5); 
    vec2 dir = center - st;
    float dist = length(dir);
    
    // polygon
    int N = 4; 
    float a = atan(dir.x,dir.y)+u_time+st.x+st.y;
    float r = TWO_PI/float(N);
    float d = cos(floor(.45+a/r)*r-a)*length(dir);
    
    vec3 color = vec3(step(radius,d)*d*4.5);

    gl_FragColor = vec4(color,1.0);
}