// clang-format off
#pragma glslify: ca = require(glsl-chromatic-aberration)

varying vec2 vUv;
uniform sampler2D tDiffuse;

uniform vec2 resolution;

void main()
{
  vec2 st = gl_FragCoord.xy / resolution.xy;
  vec2 direction = (st - .5) * 4.0;

  gl_FragColor = ca(tDiffuse, st, resolution.xy, direction);
}