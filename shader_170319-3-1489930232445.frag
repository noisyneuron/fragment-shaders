// Author: playdo.io
// Title: shader_170319-3

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846
#define COUNT 360

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
    vec3 color; 
    // transform space to -1,1
    st = st*2. - 1.;
    //zoom out
    // st *= 1.5;
    
    // grid size
    float size = 1./(float(COUNT));
    // circle size
    float rad = size*2.;

    //angle
    float angle = u_time*.015;
    vec2 cart = vec2(cos(angle),sin(angle));
    
    float bg = 1.;
    for(int i=0; i<COUNT; i++) {
    	// rotate space around center
        st *= mat2(cos(angle), -sin(angle),
          			sin(angle), cos(angle));
        //check if bg
    	float d = distance(float(i)*size*vec2(cos(angle),sin(angle)), st);
        bg *= step(rad,d);
    }
    
    //convert dist from center and center offset to cartesian coords
    vec2 dist = cart * distance(vec2(0.),st);
    vec2 offset = cart * -0.5*size;
    
    //find index and set hue
	float idx = floor( distance(offset,dist)/size ) ;
    float hue = (1.-bg)*(idx+.5)*size;
    hue *= .25;
    float b = step(.001,hue);
    color = hsb2rgb(vec3(hue, 1., 1.*b));
    
    
    gl_FragColor = vec4(color,1.);
}