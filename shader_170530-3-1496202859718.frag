// Author: playdo.io
// Title: shader_170530-3

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Some useful functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

//
// Description : GLSL 2D simplex noise function
//      Author : Ian McEwan, Ashima Arts
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : 
//  Copyright (C) 2011 Ashima Arts. All rights reserved.
//  Distributed under the MIT License. See LICENSE file.
//  https://github.com/ashima/webgl-noise
// 
float snoise(vec2 v) {

    // Precompute values for skewed triangular grid
    const vec4 C = vec4(0.211324865405187,
                        // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  
                        // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  
                        // -1.0 + 2.0 * C.x
                        0.024390243902439); 
                        // 1.0 / 41.0

    // First corner (x0)
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    // Other two corners (x1, x2)
    vec2 i1 = vec2(0.0);
    i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
    vec2 x1 = x0.xy + C.xx - i1;
    vec2 x2 = x0.xy + C.zz;

    // Do some permutations to avoid
    // truncation effects in permutation
    i = mod289(i);
    vec3 p = permute(
            permute( i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(
                        dot(x0,x0), 
                        dot(x1,x1), 
                        dot(x2,x2)
                        ), 0.0);

    m = m*m ;
    m = m*m ;

    // Gradients: 
    //  41 pts uniformly over a line, mapped onto a diamond
    //  The ring size 17*17 = 289 is close to a multiple 
    //      of 41 (41*7 = 287)

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt(a0*a0 + h*h);
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

    // Compute final noise value at P
    vec3 g = vec3(0.0);
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
    return 130.0 * dot(m, g);
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
    
    // Rotate
    float theta = u_time*0.1;
    st *= mat2(cos(theta), -sin(theta),
              sin(theta), cos(theta));
    
    // Circle clip
    float circ = 1. - smoothstep(0.5,1.1,length(st));
    
    // Scale
    st *= 70.025;
    
    // Transform 'amount'
    float k_mod = 1.768;//abs(cos(u_time*.2));
    k_mod = mix(1.0,40.,k_mod);
    
    // Polar to hyperbolic
    // st = polar2hyperbolic(st,k_mod);
    
    // Cartesian to hyperbolic
    st = cartesian2hyperbolic(st,k_mod);
    
    
    // Color
    float n1 = snoise(st + snoise(st+u_time*0.142));
    float n2 = snoise(st - u_time*0.140 + snoise(st-n1)*0.828);
    
    
    float c = smoothstep(0.,0.8, fract(n1*1.368)) * smoothstep(0.9,0., n2) * 1.272;
    
    float h = mix(0.760,0.744,c);
    float b = c*circ;
    color = hsb2rgb(vec3(h,1.,b));
    // color = vec3(c*circ);
    

    gl_FragColor = vec4(color,1.0);
}