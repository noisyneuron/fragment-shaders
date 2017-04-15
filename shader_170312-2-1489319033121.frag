// Author: playdo.io
// Title: shader_170312-2

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    
    float gridSize = 0.5;
    vec2 point = gridSize*(floor(st/gridSize) + 0.5);

    
	float dist = distance(st, point);
    float adjustedTime = (sin(u_time*.5)+1.)/2. * 10.1 + 1.;
    float a = sin(adjustedTime*(st.x+st.y)) / dist;
    
    
    float s = (sin(a)-1.)/2. * (.5*gridSize) + (.5*gridSize);
    float c = step(s, dist);

    vec3 color = (1.-s)*vec3(1.);

    gl_FragColor = vec4(color,1.0);
}