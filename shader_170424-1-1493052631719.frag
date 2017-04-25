// Author: playdo.io
// Title: shader_170424-1

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
    return c.z * mix( vec3(1.0), rgb, c.y);
}

float random (in float x) { return fract(sin(x)*1e4); }
float random (in vec2 _st) { return fract(sin(dot(_st.xy, vec2(12.9898,78.233)))* 43758.5453123);}



void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.);
    
    
    float count = 200.;
    // circle
	st = st*2.-1.;
    float r = 0.5;
    float circ = step(length(st), r);
    // float fcirc = step(length(st), r+0.05*snoise(vec2(floor(st.y*count)*0.1,1.)));
    float fcirc = step(length(st), r+0.05*random(vec2(floor(st.y*count)*0.1,1.)));
    // st = st*0.5+0.5;
    
    // st.x = st.x*2.-1.;
    // st.x += -1.1;
    st.y *= count;
    
    float iy = floor(st.y);
    float l1 = snoise(vec2(iy+1.*1.,u_time*0.1));
    float l2 = snoise(vec2(iy+14.*8.,u_time*0.08));
    l1 = mix(0.2,1.,l1);
    l2 = mix(0.3,1.1,l2);
    
    
    float c1 = step(abs(st.x),l1);
    float c2 = step(abs(st.x),l2);
    
    
    float h = 0.;
    float b = 1.;
    // if(circ==1.) {
    //     h = 0.044;
      if(c1 == 1.) {
        h = 0.;
    } else if(c2 == 1.) {
        h = 0.084;
    }
    
	// c1 *= 0.01;
	// c2 *= 0.2;
    float hf = 1.;//step(st.y,1.);
    float fuzz = hf*(c1+c2)/2.;
    
    // float bg = circ*0.1;
    
    // b = c1*c2*fcirc + circ;
    // b = step(1.,b);
    float s = 0.808;
    
    b = fcirc*(c1+c2);
    b = 0.8*step(0.1,b);
    color = hsb2rgb(vec3(h,s,b));
    // color = vec3(fuzz*fcirc );
    
    
    gl_FragColor = vec4(color,1.0);
}









