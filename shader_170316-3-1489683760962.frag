// Author: playdo.io
// Title: shader-170316-3

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
	float grid = 0.1;
    float radius = 0.06;
    vec2 center = grid * (floor(st/grid) + 0.5); 
    vec2 dir = center - st;
    float dist = length(dir);
    
    // polygon
    int N = 1; 
    float a = atan(dir.x,dir.y)+u_time+st.x;
    float r = TWO_PI/float(N);
    float m = (sin(u_time*2.)*.3)+.5;
    float d = cos(floor(m+a/r)*r-a)*length(dir);

    
    vec3 color = vec3(smoothstep(0.03,0.031,d)-distance(vec2(0.),st)*1.);
    // vec3 color = vec3(1.-d*10.);

    gl_FragColor = vec4(color,1.0);
}