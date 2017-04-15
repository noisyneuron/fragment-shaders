// Author: playdo.io
// Title: shader_170312-1

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    
    float gridSize = 0.05;
    vec2 point = gridSize*(floor(st/gridSize) + 0.5);

    
	float dist = distance(st, point);
    float a = u_time + distance(vec2(.5),st);
    
    
    float s = (sin(a)-1.)/2. * (.5*gridSize) + (.75*gridSize);
    float c = step(s, dist);

    vec3 color = c*vec3(1.);

    gl_FragColor = vec4(color,1.0);
}