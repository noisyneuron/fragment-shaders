// Author: playdo.io
// Title: shader_170705-1

#ifdef GL_ES
precision mediump float;
#endif

#define PI radians(180.)

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float heartbeat(float x, float wavelength) {
    float a = 1. - (mod(floor(x), wavelength) / max(1., mod(floor(x), wavelength)));
    float b = 1. - (mod(floor(x-1.), wavelength) / max(1., mod(floor(x)-1., wavelength)));
    float c = sin(x*PI*2. - PI);
    return (c*a + .25*c*b)  ;
}

float pacemaker(float _x) {
    return - (sin(4.*_x) - abs(sin(4.*_x))) - 0.25*(cos(4.*_x-2.) - abs(cos(7.*_x + 1.)));
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


const int i_max = 65;





vec2 complex_square( vec2 v ) {
	return vec2(
		v.x * v.x - v.y * v.y,
		v.x * v.y * 2.0
	);
}



void main() {
    
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
	vec3 color = vec3(0.);
    
    // JULIA CONSTANT
    // vec2 c = vec2( -0.12256, 0.74486);
    // vec2 c = vec2(0.340,0.060);
    vec2 c = vec2(0.110,0.660);
    // vec2 c = vec2(-0.792+0.01*sin(u_time)*sin(u_time),-0.150+0.01*sin(u_time)*sin(u_time+PI/2.));
        // vec2 c = vec2(0.13+0.01*sin(u_time),0.650+0.01*sin(u_time));
    // vec2 c = vec2(sin(u_time)*0.3, cos(u_time)*0.2);//vec2( -0.12256, 0.74486);
    
    // TIMING
     float t = pow(sin(u_time*0.500), 1./3.) + 1. * 0.41;
    // float t = heartbeat(u_time, 4.)+0.4;
    t = pacemaker(0.3*u_time)+0.3;
    float er2 = 4.776 * t ; // er= er*er escape radius 
    
    st = st * 2. - 1.;	
    
    float rtime = u_time*0.1;
   
    st *= mat2( cos(rtime), -sin(rtime),
              sin(rtime), cos(rtime));
    // st += 8.128;
	st *= 1.035 + sin(rtime)*.75;
    	
	float scale = 0.788;
	int count = 0;
	float h = 0.;
    float b = 0.;
    
    
    // iterations 
	for ( int i = 0 ; i < i_max; i++ ) {
        
		st = c + complex_square( st );
		
        count = i;
        // color = vec3(float(i)/float(i_max));
        
        b = 1.;
        
        h += float(i);
        
        if ( dot(st,st) > er2 ) { 
            // color = vec3(0.);
            // color = vec3(float(i)/float(i_max));
            b = .8;
            h =  float(i)/float(i_max);
            break; 
        }
	}
	
    // h = float(count) / (float(i_max)*(float(i_max) + 1.) / 2.);
    
    h = sin(h) * 0.5 + 0.5; 
    
    // color 
    // vec3 c = vec3(0.);
    // vec4 fragColor;
    // if (count == i_max-1) {
    //     fragColor = vec4(1.0, 0.0,0.0,1.0);
    // } // filled-in Julia set = red
    // else  {
    //     fragColor = vec4(1.0- float( count ) * scale );
    // }// exterior 
    
   
    // color = vec3(st.x,st.y,abs(sin(u_time)));
    
    color = hsb2rgb(vec3(h, 0.8, b));

    gl_FragColor = vec4(color, 1.);
}