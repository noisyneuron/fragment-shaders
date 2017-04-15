// Author: playdo.io
// Title: shader_170330-1

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
    vec2 u = f*f*f*(f*(f*6.-15.)+10.);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners porcentages
    return mix(a, b, u.x) + 
            (c - a)* u.y * (1.0 - u.x) + 
            (d - b) * u.x * u.y;
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

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.);
    
    st = st *2. - 1.;
    
	float an = u_time;
    float rad = 0.21;
	st += rad*vec2(cos(an),sin(an));
    st *= 1.256;
    
    st += random(st+u_time*.02)*-0.892;
    float r = length(st);
    float a = atan(st.y,st.x);
    float c;
    
    float m = 1.000;//.8+abs(cos(u_time*.2)*.2);
    
    c = smoothstep(0.2*m,0.1,noise(st-u_time*0.096));
    
    st += random(st+u_time)*-0.200;

    c += smoothstep(0.39*m,0.31,noise(st+u_time*.4));
    
    // st += random(st+u_time)*0.060;
    
     c -= smoothstep(.2,0.21,noise(st+u_time*.3));
    
    c += smoothstep(.61,0.91*m,noise(st+u_time*0.272));
    
    float h = mix(0.6,0.65,c);
    float s = 1.296-c;
    float b = c*1.800+ (1.-c);
    // color = vec3(c*.8);
    color = hsb2rgb(vec3(h,s,b));
    

    gl_FragColor = vec4(color,1.0);
}