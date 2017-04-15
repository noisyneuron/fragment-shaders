// Author: playdo.io
// Title: shader_170321-2

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846
#define COUNT 20

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



void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    st = st *2. - 1.;
    
    st *= .3;

    float a = atan(st.y,st.x);
    float r = length(st);
    

    float idx = 0.; 
    float b = 0.;
    float c = 1.;
    for(int i=1;i<=COUNT;i++) {
        float offset = float(i)*PI/float(COUNT);
        float d = .9 + .8*sin(pow(offset,2.)+(u_time*PI)+a*4.);
        d = .25 + 0.2*pow(d,0.8);
        d += 0.08 * pow(1.+cos(4.*a),1.);
        
        d *= float(i)*.95 / float(COUNT);
		
        c = smoothstep(r,r+.0001,d);
        if(c == 0.) {
            idx = float(i);
            b = d*4.;
        }
    }
    
    // float alt = floor(mod(float(idx),2.));
    // float h = mix(0.,.3,b);
    // float s = 0.95;
    // float br = (1.-b)*1.;//step(0.,b);
    // color = hsb2rgb(vec3(h,s,br));
    color = vec3( 1.-b);

    gl_FragColor = vec4(color, 1.0);
}