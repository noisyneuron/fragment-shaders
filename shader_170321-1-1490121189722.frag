// Author: playdo.io
// Title: shader_170321-1

#ifdef GL_ES
precision mediump float;
#endif

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
    return c.z * mix(vec3(1.0), rgb, c.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.);
	
    st -= vec2(.5);
    st *= mat2(cos(u_time*.8), -sin(u_time*.2),
              sin(u_time*.2), cos(u_time*.8));
    
    st *= 4.;
    st = fract(st);
    st = st*2. -1.;
    
    
    
    float a = 6.*atan(st.y,st.x);
    
    float r = length(st);
    
    float t1 = sin(u_time);
    float t2 = cos(u_time*.8);
    float t3 = sin(u_time*.5);
    float t4 = sin(u_time*.4);

    
    // float d = (sin(a)*t1) + abs(cos(a)*t4);
    float d = tan(a)*(sin(2.*a)*t3) + abs(cos(2.*a)*t4);
    
    // float d = cos(a*4./5.);
        
    // float c = smoothstep(r,r+.1,d)*1.-r;
    float c = smoothstep(r,r+.01,d)*fract(r*6.);
    
    float h = mix(0.4,0.7,c+t2);
    float s = 0.55*abs(min(st.x,st.y));
    float b = (1.-r)*c;
    color = hsb2rgb(vec3(h,s,b));
    gl_FragColor = vec4(color,1.0);
}