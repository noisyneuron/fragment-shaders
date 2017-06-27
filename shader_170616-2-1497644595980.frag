// Author: playdo.io
// Title: shader_170616-2

#ifdef GL_ES
precision mediump float;
#endif

#define PI radians(180.)
#define NUM_OCTAVES 5

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (in vec2 _st) { 
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))* 
        43758.5453123);
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

    // Cubic Hermine Curve.  Same as SmoothStep()
    // vec2 u = f*f*(3.0-2.0*f);
    vec2 u = f*f*f*(f*(f*6.-15.)+10.);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners porcentages
    return mix(a, b, u.x) + 
            (c - a)* u.y * (1.0 - u.x) + 
            (d - b) * u.x * u.y;
}


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

//  Function from Iñigo Quiles 
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0, 
                     0.0, 
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}




//////////////////////////////////////////////////////////////





float checkerboard(vec2 p, float s) {
    p *= s;
    vec2 idx = floor(p);
	return mod(idx.x+idx.y,2.);    
}


vec2 sinusodial(vec2 p, float amt) {
    return amt * vec2(sin(p.x), sin(p.y));   
}

vec2 hyperbolic(vec2 p, float amt) {
  float r = length(p) + 1.0e-10;
  float theta = atan(p.y, p.x);
  float x = amt * sin(theta) / r;
  float y = amt * cos(theta) * r;
  return amt * vec2(sin(theta) / r,  cos(theta) * r);
}

vec2 pdj(vec2 p, float amt, vec4 params) {
    return amt * vec2(sin(params.w*p.y) - cos(params.x*p.x),
                     sin(params.y*p.x) - cos(params.z*p.y));
}

vec2 julia(vec2 p, float amt) {
    float r = amt*pow(length(p), 0.5);
    float theta = 0.5 * atan(p.y,p.x) + floor(2.*random(vec2(r))) * PI;
    return r * vec2(cos(theta), sin(theta));
}

float cosh(float x) { return 0.5*(exp(x) + exp(-x));}
float sinh(float x) { return 0.5*(exp(x) - exp(-x));}

vec2 sech(vec2 p, float amt) {
    float d = cos(2.*p.y) + cosh(2.*p.x);
    d = amt * 2./d;
    return vec2(d * cos(p.y) * cosh(p.x),
               -d * sin(p.y) * sinh(p.x));
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.);
    
    
    st = st * 2. - 1.;
    st *= 0.540;
    
    st += vec2(-0.030,1.500);
    // st += sinusodial(st, .456) + hyperbolic(st, 0.9);
    // st = julia(st, 0.844);
    st += sech(st, 4.064 + sin(u_time*0.1));
    
    // st += julia(st, 0.504);
    // st -= hyperbolic(st, 0.3);
    
    float atime = sin(6.* sin(u_time*0.1));
    st = pdj(st, 0.4, vec4(2.*sin(atime), 1.*cos(atime), -3.*sin(atime), 1.*cos(atime)));
    
    st *= 0.712;
    float c = smoothstep(1.656, 0.628, length(st));
    float ch = checkerboard(st, 10.);
    float f = fract(length(st*1.)*10.);
    float n = noise(st*4.);
    float fn = fbm(st*noise(st*4.));
    
    float h = mix(0.548,0.780, fn);
    float b = 0.600-n;
    color = hsb2rgb(vec3(h,0.840,b));

    gl_FragColor = vec4(color,1.0);
}