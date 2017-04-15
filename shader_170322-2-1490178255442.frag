// Author: playdo.io
// Title: shader_170322-2

#ifdef GL_ES
precision mediump float;
#endif

#define PI radians(180.)
#define TWO_PI radians(360.)
#define COUNT 8

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

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
    
//     st -= .5;
//     st *= mat2(cos(PI/4.), -sin(PI/4.),
//               sin(PI/4.), cos(PI/4.));
//     st += .5;
    
//     st *= 2.;
//     st = fract(st);
    
    st = st*2.-1.;
    
    float angle = atan(st.y,st.x)+PI;
    float rad = length(st);
    
    float intvl = TWO_PI/float(COUNT);
    float slice = floor(angle/intvl);
    float alt = floor(mod(slice,2.));
    float altSigned = alt*2. - 1.;

    float c = 1.;
    float g = 1.;
    for(int i=0; i<COUNT; i++) {

        float inslice = step(0.01, abs(float(i)-slice));

        
        float a = .5*u_time*(PI/4.)*altSigned ;
        st *= mat2( cos(a), -sin(a),
                  sin(a), cos(a));
        float d = max(abs(st.x),abs(st.y));
        d = inslice * fract(d*10.);
        c *= smoothstep(d,d+.01,0.4);
		st *= mat2( cos(-a), -sin(-a),
                  sin(-a), cos(-a));
    }

//     float h = (1.-c)*mix(0.7,0.73,rad)  + (c)*mix(0.5,0.7,rad);
//     float s = (1.-c)*0.6 + (c)*.8;
//     float b = (1.-c)*0.15 + (c)*0.6;
	
//     color = hsb2rgb(vec3(h, s, b));

    
    gl_FragColor = vec4(vec3(c),1.0);
}