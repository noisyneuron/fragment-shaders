// Author: playdo.io
// Title: shader_170329-1

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI radians(180.)

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
    vec2 u = f*f*f*(f*(f*6.-15.)+10.);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners porcentages
    return mix(a, b, u.x) + 
            (c - a)* u.y * (1.0 - u.x) + 
            (d - b) * u.x * u.y;
}


void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    
    st = st *2. - 1.;
	st *= 4.0 ;//+ sin(u_time*.5)*.5;

    float t = -u_time;
    // st *= mat2(cos(0.), -sin(t*0.001),
    //           sin(t*.004), tan(t*0.00));	
    // st.y += sin(0.25*u_time+st.x*.5)*.5;
    float m = (cos(u_time*0.04)+1.5)*1.5;
    float n = noise(st+vec2(u_time*.002, u_time*0.007)) * PI*m;
    st.y += sin(n)+u_time*.13;
    st.x += cos(n)+u_time*.05;
    
    float c = 1.- length(fract(st*1.));
    
    float a1 = (sin(pow(u_time, .6))*.5+.6);
    c = smoothstep(a1,0.015,c);
    
    vec3 color = vec3(c);

    gl_FragColor = vec4(color,1.0);
}