// Author: playdo.io
// Title: shader_170402-1

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

vec2 skew2D(in vec2 uv, in float ang) {
    return uv * mat2(1., tan(ang),
                    sin(ang), 1.);
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
    vec3 color = vec3(0.);  
	        
    float units =30.*(abs(cos(u_time*0.01))+0.5);
    units = units/2.;
    st = st *2. -1.;
    st *= 3.;
    float angle = atan(st.y/st.x);
    float rad = length(st);
    
    float q = mod(floor(angle/(PI/units)), 2.);
    angle = mod(angle, PI/units);
    
    angle = q*angle + (1.-q)*(PI/units-angle);

    st = rad*vec2(cos(angle),sin(angle));
    
    st = rotate2D(st, PI/noise(vec2(angle+u_time*0.2,rad+u_time*.32)));
	st = skew2D(st, noise(st+u_time*0.3));
    float f = .46*fract(.3*pow(st.x+st.y,.83));
    float c = smoothstep(0.1, 0.9, f+random(vec2(st)*.5)*.20);
    
    float h = mix(0.4,0.61,noise(vec2(rad+u_time*.01)));
    float b = c;
    color = hsb2rgb(vec3(h,0.5,b));
    // color = vec3(c); 

    gl_FragColor = vec4(color,1.0);
}