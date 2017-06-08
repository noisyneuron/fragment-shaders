// Author: playdo.io
// Title: shader_170524-1

#ifdef GL_ES
precision mediump float;
#endif

#define COUNT 20
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float rand(float f) {
    return fract(sin(f)*3901.831781);
}

vec2 rand(vec2 p) {
	return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}


float cs(float x) {
    float amplitude = 1.604;
    float frequency = 1.868;
    float y = sin(x * frequency);
    float t = 0.004*(-u_time*130.0);
    y += sin(x*frequency*3.524 + t)*5.796;
    // y += sin(x*frequency*1.72 + t*1.121)*3.280;
    // y += sin(x*frequency*2.221 + t*0.077)*4.552;
    // y += sin(x*frequency*3.1122+ t*3.893)*2.5;
    y *= amplitude*0.036;
    return y;
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
    vec3 color;
    
    st = st * 2. - 1.;
    st *= 2.904;
    
    float c = 0.;
    float dist = 2.;
    
    float t = pow(sin(u_time*0.6), 2.5);
    
    for(int i=0; i<COUNT; i++) {
    	// vec2 r = rand(vec2(float(i)*u_time*0.0000000001, float(i)*u_time*0.0000000001));
        
        // vec2 r = vec2(sins(float(i)*0.1, u_time*0.01), coss(float(i)*.12, u_time*0.02));
        
        vec2 r = vec2(cs(float(i)), cs(float(i) + (t + 1.)));
        
        float d = distance(st, r);
        dist = min(d, dist);
	
    }
    
    float b = dist+0.124;
    b *= step(dist, 1.000)+0.2;
    float s = 0.8;
    float h = mix(0.2,0.232,t);
    
    
	color = vec3(dist);
    
    color = hsb2rgb(vec3(h,s,b));

    gl_FragColor = vec4(color,1.0);
}