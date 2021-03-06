// clang-format off
#pragma glslify: vignette = require('glsl-vignette')

uniform sampler2D tDiffuse;
varying vec2 vUv;

void main() {
  vec4 texColor = texture2D(tDiffuse, vUv);

  float vignetteValue = vignette(vUv, 0.8, 0.4);
  texColor.rgb *= vignetteValue;

  gl_FragColor = texColor;
}