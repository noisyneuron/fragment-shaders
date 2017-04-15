// Author: playdo.io
// Title: shader_170328-1

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

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners porcentages
    return mix(a, b, u.x) + 
            (c - a)* u.y * (1.0 - u.x) + 
            (d - b) * u.x * u.y;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.);	
    
    // st = st*2.-1.;
    st.x += 2.;
    st.y -= 3.;
    
    st.y += 1.;
    st *= mat2(cos(-u_time*.05), -sin(-u_time*.04),
              sin(-u_time*.03), -cos(-u_time*.02));
    st.y -= 1.;
    
    float a = atan(st.y,st.x) - PI/2.;
    float l = length(st);
    float r = 0.3;
    float n = noise(vec2(1.2*u_time+sin(pow(a,4.9)),u_time+a*6.)) +0.4 ;//* 2.-1.;
    float n2 = noise(st);
    // float n = (n1+n2)/2.;
    n *= 0.15;
    r += n;
    
    
    // float s = smoothstep(r-.5,r,l) - smoothstep(r,r+0.5,l);
    // c = step(l,r)*c + (1.-c)*fract(l*5.);
    
    float d = length(l-r);
    
    float c = step(r,l)*fract(fract(d*2.)*1.5)*1.;//  + step(l,r)*s;
    
    color = vec3(c);
    gl_FragColor = vec4(color,1.0);
}



