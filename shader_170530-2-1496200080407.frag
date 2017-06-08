// Author: playdo.io
// Title: shader_170530-2

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

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

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.);
    
    // Move origin to center
    st = st*2. - 1.;
    
    // Scale
    st *= 0.120;
    
    // Transform 'amount'
    float k_mod = abs(cos(u_time*.2));
    k_mod = mix(16.0,25.,k_mod);
    
    // Polar to hyperbolic
    st = polar2hyperbolic(st,k_mod);
    
    // Cartesian to hyperbolic
    // st = cartesian2hyperbolic(st,k_mod);
    
    
    // Shapes
    float rect = max(abs(st.x),abs(st.y));
    float circ = length(st);
    
    // Color
    float layers = 1.;
    vec2 layers_mod = vec2(sin(-u_time*0.2), sin(u_time*0.2));
    // layers_mod = vec2(-2.,2.) * 2.112;
    layers_mod = layers_mod  + vec2(4.);
    float c = fract(rect*layers*layers_mod.x) * fract(circ*layers*layers_mod.y);
    c = smoothstep(1.,0.2,c);
    
    color = vec3(c);
    

    gl_FragColor = vec4(color,1.0);
}