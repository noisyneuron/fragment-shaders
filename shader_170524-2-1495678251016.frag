// Author: playdo.io + scottemmons.com
// Title: shader_170524-2

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// functions from thebookofshaders
vec2 skew (vec2 st) {
    vec2 r = vec2(0.0);
    r.x = 1.1547*st.x;
    r.y = st.y+0.5*r.x;
    return r;
}

vec3 simplexGrid (vec2 st) {
    vec3 xyz = vec3(0.0);

    vec2 p = fract(skew(st));
    if (p.x > p.y) {
        xyz.xy = 1.0-vec2(p.x,p.y-p.x);
        xyz.z = p.y;
        
        xyz = vec3(1.);
    } else {
        xyz.yz = 1.0-vec2(p.x-p.y,p.y);
        xyz.x = p.x;
        
        xyz = vec3(0.);
    }

    return xyz;
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
    float epsilon = 0.1;
    float radius = 0.25;
    float a = 1.;
    float n = 4.;
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.);
    
    // Origin at center
    st = 2.*st - 1.;
    
    // Slow rotate
    float ang = u_time*0.04;
    st *= mat2(cos(ang), sin(ang),
              -sin(ang), cos(ang));
    

    // Construct outer circle
    float circ = smoothstep(length(st), length(st)+0.4, 0.984);
    
    // Scale
    st *= .26;
    
    // Adjust time
    float t = sin(u_time*1.2) * .5 + .5;
    t = mix(0.09,0.1,t);
    
    
    // Calculate transformed distance from origin
    float r = length(st);
    // r *= length(st);
    r /= pow( t -pow(st.x,2.)-pow(st.y,2.) , 2.00);
    r = pow(r, 0.5);
    
    // Angle in Euclidean space
    float theta = atan(st.y,st.x);
    
    // Convert from hyperbolic coordinates
    float x = pow( pow(st.x,2.) / pow(1.-st.x*st.x,2.) ,.5);
    float y = pow( pow(st.y,2.) / pow(1.-st.y*st.y,2.) ,.5);
	//or
    x = pow( (r*r*pow(1.-st.x*st.x , 2.)), .5);
    y = pow( (r*r*pow(1.-st.y*st.y , 2.)), .5);
    
    
    // Store as Euclidean
    st = r*vec2(cos(theta), sin(theta));
    // st = r*vec2(x*cos(theta), y*sin(theta));
    // st = vec2(x,y);
    
    // Checkerboard
	//vec2 idx = floor(st);
	//float alt = mod(idx.x+idx.y, 2.);
    
    // Subdivide the grid into to equilateral triangles
    color = simplexGrid(st);
    

    gl_FragColor = vec4(vec3(color)*circ,1.0);
    // gl_FragColor = vec4(hsb2rgb(color),1.0);
}