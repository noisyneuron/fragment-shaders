// Author: playdo.io
// Title: shader_170608-1

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float checkerboard(vec2 p, float size) {
    vec2 p_g = p*size;
    vec2 idx = floor(p_g);
    vec2 amt = fract(p_g);
    float c = mod(idx.x+idx.y,2.);
    c = c*smoothstep(0.672,0., 0.928-(amt.x+amt.y)/3.288) + (1.-c)*smoothstep(1.772,.0,amt.x+amt.y);
    return (c);
}

vec2 cInverse(vec2 z, vec2 center, float radius){
    z -= center;
    return z*radius*radius/dot(z,z) + center;
}

vec2 polar2hyperbolic(vec2 p, float amt) {
    // Get polar coordinats
    float r = length(p);
    float theta = atan(p.y,p.x);
    // Get hyperbolic distance / radius
    float r_ = r/(r+amt);
    // Set hyperbolic coordinates
    vec2 p_ = p * (1./r+amt);
    return p_;
}

vec2 cartesian2hyperbolic(vec2 p, float amt) {
    vec2 p_  = p * 1./sqrt(p*p + amt*amt);
    return p_;
}

// from Patricio Gonzalez Vivo
vec2 ratio(vec2 st, vec2 size) {
    return mix(vec2((st.x*size.x/size.y)-(size. x*.5-size.y*.5)/size.y,st.y), 
               vec2(st.x,st.y*(size.y/size.x)-(size.y*.5-size.x*.5)/size.x), 
               step(size.x,size.y));
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st = ratio(st, u_resolution);
    vec3 color = vec3(0.);
    
    // Move origin to center
    st = st*2. - 1.;
    
    // Scale
    st *= 0.544;
    
    vec2 c1o = vec2(cos(u_time*0.08)*1.25, sin(u_time*0.08)*1.25);
    float r1 =1.068 + 0.2*sin(u_time*0.52);

    st = cartesian2hyperbolic(st, 0.512);   
    st = cInverse(st, c1o, r1);
        
    color = vec3(checkerboard(st, 12.));
    
    

    gl_FragColor = vec4(color,1.0);
}