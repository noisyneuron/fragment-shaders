// Author: playdo.io
// Title: shader_170416-1

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define COUNT 6

float random (in float x) {
    return fract(sin(x)*1e4);
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

    
    st.x *= 3.;
    
    float c = 1.;
    
    for(int it=0;it<COUNT;it++) {
        
        float x = st.x + random(float(it*it));
        x += u_time * pow(float(COUNT-it),2.) * 0.07;
        float f = fract(x);
        float i = floor(x);
        float y = mix(random(i), random(i+1.), smoothstep(0.,1.,f));
        y *= mix(0.2, 2., float(it)/float(COUNT));
        y += 0.01;
        if(st.y < y) {
            c = float(it+1)/float(COUNT)*0.9;
            break;
        }
    }
 


    
    color = hsb2rgb(vec3(1.576,.9-c,c));

    gl_FragColor = vec4(color,1.0);
}