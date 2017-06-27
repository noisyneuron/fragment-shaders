// Author: playdo
// Title: shader_170615-1

#ifdef GL_ES
precision mediump float;
#endif

#define PI radians(180.)

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (in vec2 _st) { 
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))* 
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f *  (3.0 - 2.0 * f);

    return mix(a, b, u.x) + 
            (c - a)* u.y * (1.0 - u.x) + 
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 5

float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), 
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2. + shift;
        a *= 0.5;
    }
    return v;
}

vec2 cInverse(vec2 z, vec2 center, float radius){
    z -= center;
    return z*radius*radius/dot(z,z) + center;
}

vec2 polar2hyperbolic(vec2 p, float amt) {
    // Get polar coordinats
    float r = length(p);
    float theta = atan(p.y,p.x);
    // Get hyperbolic distance / radius
    float r_ = r/(r+amt);
    // Set hyperbolic coordinates
    vec2 p_ = p * (1./r+amt);
    return p_;
}

vec2 cartesian2hyperbolic(vec2 p, float amt) {
    vec2 p_  = p * 1./sqrt(p*p + amt*amt);
    return p_;
}

vec2 someHyperbolic(vec2 p, float r) {
    float theta = atan(p.y,p.x);
    float x = pow( pow(p.x,2.) / pow(1.-p.x*p.x,2.) ,.5);
    float y = pow( pow(p.y,2.) / pow(1.-p.y*p.y,2.) ,.5);
 	return r*vec2(x*cos(theta), y*sin(theta));
}


void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
	vec3 color = vec3(0.);
    
    st = st*2.-1.;
    float innerCircle = smoothstep(0.08,0.3,length(st));
        
    st *= 10.;
    
    
    // move st to a point in a circle around it
    st += 1.84 * vec2(cos(noise(0.7*st+u_time)*PI*0.2), sin(noise(0.5*st+u_time)*PI*0.15));
    
    // get center back
    st += vec2(-1.960,0.060);
    
    // float atime = sin(2.* sin(u_time*0.3)+1.);
    
    float atime = sin(u_time*0.05) + sin(u_time*0.04)*1.5;
    
    atime = atime / 2.5;
    
    // fold on a circle at the center, modulate its radius
    st = cInverse(st, vec2(0.), 6.284 * atime);
    

    
    float f = fbm(st + fbm(st + fbm(st + fbm(st))));
    
    color = vec3(f*f*innerCircle);

    gl_FragColor = vec4(color,1.0);
}