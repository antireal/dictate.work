uniform sampler2D tDiffuse;
varying vec2 vUv;

void main() {
  vec4 texColor = texture2D(tDiffuse, vUv);

  float grayscaleValue = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));

  // #7dfef4
  // #ce1d37
  // #0a0d30

  texColor =
      mix(vec4(0.0, 0.0, 0.0, 1.0), vec4(1.0, 1.0, 1.0, 1.0), grayscaleValue);

  gl_FragColor = texColor;
}