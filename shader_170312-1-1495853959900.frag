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
    
    st = st * 2. - 1.;
    
    float dist = length(st);
    st *= 1.648;
    
    
    // Calculate transformed distance from origin
    float r = length(st);
    r *= r;
    r /= pow(1.704 -pow(st.x,2.)-pow(st.y,2.) , 2.00);
    r = pow(r, 0.5);
    
    // Angle in Euclidean space
    float theta = atan(st.y,st.x);
    
    // Back to Euclidean
    st = r*vec2(cos(theta),sin(theta));
    
    // Go into cell
    st = fract(st);

    
    // Move to center
    st = st * 2. - 1.;
	
    
	float l = length(st);
    float a = u_time + dist*1.2;
    
    
    float s = (sin(a)*.5 + .5) * .92;//
    float c = smoothstep(s,s+0.762, l);

    vec3 color = vec3(c);

    gl_FragColor = vec4(color,1.0);
}