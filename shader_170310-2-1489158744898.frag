// Author: playdo.io
// Title: shader_170310-2

#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
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

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);

    // Use polar coordinates instead of cartesian
    vec2 toCenter = vec2(.5)-st;
    float angle = atan(toCenter.y,toCenter.x);
    float radius = length(toCenter)*1.;
    
    // float h = pow(angle*.4/TWO_PI, sin(u_time));
    float h = pow(angle*2./TWO_PI, exp(cos(u_time/.2)));
    
    float c = step(0.3, radius);
    float b = 112.2*atan(st.y,st.x);
    
    
  
    // Map the angle (-PI to PI) to the Hue (from 0 to 1)
    // and the Saturation to the radius
    color = hsb2rgb(cos(c*u_time+b)*vec3(h,radius,.9));

    gl_FragColor = vec4(color,1.0);
}