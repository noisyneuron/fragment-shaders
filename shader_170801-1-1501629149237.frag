// Author: playdo.io
// Title: shader_170801-1

#ifdef GL_ES
precision mediump float;
#endif

#define MARCHSTEPS 16
#define EPSILON 0.001
#define MAXDIST 100.

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (in vec2 st) { 
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))* 
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) + 
            (c - a)* u.y * (1.0 - u.x) + 
            (d - b) * u.x * u.y;
}

#define OCTAVES 2
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitud = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitud * noise(st);
        st *= 2.;
        amplitud *= .5;
    }
    return value;
}

vec3 repeat(vec3 p, float r) {
    return mod(p, r) - 0.5*r;
}

float sphereSDF(vec3 p, float r) {
    return length(p) - r;
}

float sceneSDF(vec3 p) {
    vec3 q = p;//repeat(p, 1.);
    // float atime = 10.*(sin(u_time)*0.5 + 0.5);
    
    float atime = u_time*-.5;
    atime = .2*sin(atime) + 0.15*sin(2.*atime) + .85*sin(3.*atime) + 1.75*sin(4.*atime);
    atime *= -2.8;
    float d = sin(p.x*atime) * sin(p.y*atime) * sin(p.z*atime) ;
    return sphereSDF(q, 1.81) + 0.1*d;
}

vec3 estimateNormal(vec3 p) {
    return normalize(vec3(
        sceneSDF(vec3(p.x + EPSILON, p.y, p.z)) - sceneSDF(vec3(p.x - EPSILON, p.y, p.z)),
        sceneSDF(vec3(p.x, p.y + EPSILON, p.z)) - sceneSDF(vec3(p.x, p.y - EPSILON, p.z)),
        sceneSDF(vec3(p.x, p.y, p.z  + EPSILON)) - sceneSDF(vec3(p.x, p.y, p.z - EPSILON))
    ));
}

float fog(float d) {
    return 1./(1.0 + d*d*0.1);
}

float trace(vec3 o, vec3 r) {
    float t = 0.;
    for(int i=0; i<MARCHSTEPS; i++) {
        vec3 p = o + r*t;
        float d= sceneSDF(p);
        if(d <= EPSILON) {
            return t;
        }
        t += d*1.;   
    }
    return t;
}

void main() {
    vec2 st = (gl_FragCoord.xy - 0.5*u_resolution.xy)/min(u_resolution.x, u_resolution.y); 
    st *= 2.;
    
    vec3 color = vec3(0.);
    vec3 camera = vec3(0.,0., -3.0);
    vec3 light = vec3(sin(u_time*1.2)*2.,0., -3.0);
    vec3 ray = normalize(vec3(st, 1.));

    float dist = trace(camera, ray);
    vec3 hitPoint = camera + ray*dist;
    vec3 norm = estimateNormal(hitPoint);
    
    vec3 lamb = dot(norm, normalize(light - hitPoint)) * vec3(0.334,0.206,0.900) * 1.;
    
    color =  lamb;
    color *= fog(dist);
    color *= step(dist, MAXDIST);
    
    // color = vec3(fog(dist));

    gl_FragColor = vec4(color,1.0);
}