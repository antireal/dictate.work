// clang-format off
#pragma glslify: blendSoftLight = require(glsl-blend/soft-light)
#pragma glslify: blendScreen = require(glsl-blend/screen)

#pragma glslify: grain = require(glsl-film-grain)
#pragma glslify: blur = require(glsl-fast-gaussian-blur)

varying vec2 vUv;
uniform sampler2D tDiffuse;

uniform float time;
uniform vec2 resolution;
uniform float bloomFactor;

void main() {
  // in
  vec4 texColor = texture2D(tDiffuse, vUv);
  vec2 st = gl_FragCoord.xy / resolution.xy;

  // bloom pass
  vec4 blurred = blur(tDiffuse, vUv, resolution, vec2(-1, -1));
  blurred = mix(blur(tDiffuse, vUv, resolution, vec2(1, 1)), blurred, 0.5);

  float luma = dot(blurred.rgb, vec3(0.299, 0.587, 0.114));
  float response = smoothstep(0.05, 0.5, luma);

  float dist = distance(st, vec2(0., 0.));
  blurred = vec4(blendScreen(texColor.rgb, blurred.rgb, pow(response, 2.0) * bloomFactor * dist), 1.0);

  // grain pass
  float grain_size = 0.5;
  vec3 g = vec3(grain(vUv, resolution / grain_size, time));
  vec3 blended_noise = blendSoftLight(blurred.rgb, g, 0.6);

  blended_noise = mix(blended_noise, blurred.rgb, pow(response, 2.0));

  gl_FragColor = vec4(blended_noise, 1.0);
}