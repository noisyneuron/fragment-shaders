// Author: playdo.io
// Title: shader_170401-1

#ifdef GL_ES
precision mediump float;
#endif

#define PI radians(180.)

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// 2D Random
float random (in vec2 st) { 
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Quintic interpolation curve
    vec2 u =  f*f*f*(f*(f*6.-15.)+10.);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners porcentages
    return mix(a, b, u.x) + 
            (c - a)* u.y * (1.0 - u.x) + 
            (d - b) * u.x * u.y;
}

vec2 rotate2D(in vec2 uv, in float ang) {
    return uv * mat2(cos(ang), -sin(ang),
                    sin(ang), cos(ang));
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.);  
        
    float units = 6.;
    units = units/2.;
    st = st *2. -1.;
    
    float angle = atan(st.y/st.x);
    float rad = length(st);
    
    float q = mod(floor(angle/(PI/units)), 2.);
    angle = mod(angle, PI/units);
    
    angle = q*angle + (1.-q)*(PI/units-angle);

    st = rad*vec2(cos(angle),sin(angle));
    
    st = rotate2D(st, PI/noise(vec2(angle+u_time*0.15,rad+u_time*.15)));

    float c = smoothstep(0.1, 0.9, .6*fract(1.3*pow(st.x+st.y,.49))+random(st*.5)*.4);
    
    color = vec3(c); 

    gl_FragColor = vec4(color,1.0);
}