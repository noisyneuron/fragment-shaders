// Author: playdo
// Title: shader-170321-1

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define COUNT 15
#define PI radians(180.)

float random (in float x) { return fract(sin(x)*1e4); }

float random (in vec2 _st) { 
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))* 
        43758.5453123);
}



vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
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

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) + 
            (c - a)* u.y * (1.0 - u.x) + 
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 2

float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), 
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

float heartbeat(float x) {
    float a = 1. - (mod(floor(x), 4.) / max(1., mod(floor(x), 4.)));
    float b = 1. - (mod(floor(x-1.), 4.) / max(1., mod(floor(x)-1., 4.)));
    
    float c = sin(x*PI*2. - PI);
    
    return (c*a + .25*c*b)  ;
}

//  Function from Iñigo Quiles 
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0, 
                     0.0, 
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.);
    
    st = st * 2. - 1.;
    
    float threshold = 0.136;
    
    float d = 0.;
    float c = 0.;
    
    float atime = heartbeat(u_time*2.);
    
    float t = u_time + 1009.;
    
    float h = 0.;
    
    // c = step(0.0002+atime, length(st));
    
    for(int i=0; i<COUNT; i++) {
		vec2 p = vec2( fbm(vec2(float(i)*2.81)) );

        float atime = pow(t,0.7) * 2. - 1.;
        
        
        // atime = sin(snoise(vec2(u_time)*0.05));
        
        // atime = heartbeat(-u_time*0.5);
        
        vec2 p2 = vec2(0.);
        p2.x += snoise(0.4*p.xy+atime) ;//* 0.6 - 0.333;
        p2.y += snoise(0.7*p.yx+atime) ;//* 0.5 - .25;
        
        float len = distance(st, p2*p2*p2);
        len = threshold / len;
        
        d += threshold / distance(st, p2*p2*p2);
        
        // h = distance(st, p) * float(i) * 0.308;
        
        
        h = fbm(st + 0.900*fbm(st+d+heartbeat(t*2.)));
    }
    
    
   	c = step(5.464, d);
    
    // h = mix(0., 0.440, d*0.413);
    

    color = c*hsb2rgb(vec3(1.-h, 1.0, 0.672));

    gl_FragColor = vec4(color,1.0);
}