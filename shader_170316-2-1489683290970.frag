// Author: playdo.io
// Title: shader_170316-2

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
    int N = 4; 
    float a = atan(dir.x,dir.y)+u_time*0.5;
    float r = TWO_PI/float(N);
    float m = (sin(u_time*.5)*.3)+.5;
    float d = cos(floor(m+a/r)*r-a)*length(st);

    
    vec3 color = vec3(smoothstep(0.2,0.41,d)-distance(vec2(0.),st)*.5);
    // vec3 color = vec3(1.-d*10.);

    gl_FragColor = vec4(color,1.0);
}