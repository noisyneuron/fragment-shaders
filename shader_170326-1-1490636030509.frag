// Author: playdo.io
// Title: shader_170326-1

#ifdef GL_ES
precision mediump float;
#endif

#define PI radians(180.)

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;



float random(vec2 st) {
    return fract(sin(dot(st.yx, vec2(12.329,78.3123)))*43758.1321);
}


void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    
    st -= vec2(0.5);
    st *= mat2(cos(-PI/2.), -sin(-PI/2.),
              sin(-PI/2.), cos(-PI/2.));
    st += vec2(0.5);
    
    float gridy = 1000.;
    float gridx = 100.;
    gridx = random(vec2(floor(st.y*gridy),floor(st.y*gridy)));
    gridx = mix(20.,50.,gridx);
    vec2 grid = vec2(gridx, gridy);
    
    st = st*2. - 1.;
	st *= grid;

    
	float alt = step(0.5,random(vec2(1.,floor(st.y))));
    alt = sign(alt-.5);
    
    float speed = random(vec2(floor(st.y)));
    
    st.x += speed*mod(u_time*50.,10000.);

    float r = random(floor(st));
    float t = random(vec2(floor(st.y)*15., pow(floor(st.y),1.)));
    t = mix(0.01,0.2,t);
    float c = step(t,r);

    vec3 color = vec3(1.12*r*c);

    gl_FragColor = vec4(color,1.0);
}