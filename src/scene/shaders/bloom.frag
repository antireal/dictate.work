varying vec2 vUv;

uniform sampler2D tDiffuse;

void main() {
  vec4 col = vec4(0);
  // Current texture coordinate
  vec2 texel = vUv;
  vec4 pixel = vec4(texture2D(tDiffuse, texel));

  // Mean spread value
  float pixelWidth = 0.01;
  float pixelHeight = 0.01;
  // Dim factor
  float dim = 0.55;

  float grayscaleValue = dot(pixel.rgb, vec3(0.299, 0.587, 0.114));

  if (grayscaleValue < 1.0) {
    // Glow is based on the greyscale value
    float glow = grayscaleValue * ((pixelWidth + pixelHeight) / 2.0);

    vec4 bloom =
        vec4(0); // The vector to contain the new, "bloomed" colour values

    // Apply a horrible version of "mean filter"
    // Horrible because GLSL needs constants for loop initializations
    bloom += (texture2D(tDiffuse, vec2(texel.x, texel.y)) - dim);
    bloom += (texture2D(tDiffuse, vec2(texel.x - glow, texel.y - glow)) - dim);
    bloom += (texture2D(tDiffuse, vec2(texel.x + glow, texel.y + glow)) - dim);
    bloom += (texture2D(tDiffuse, vec2(texel.x + glow, texel.y - glow)) - dim);
    bloom += (texture2D(tDiffuse, vec2(texel.x - glow, texel.y + glow)) - dim);
    bloom += (texture2D(tDiffuse, vec2(texel.x + glow, texel.y)) - dim);
    bloom += (texture2D(tDiffuse, vec2(texel.x - glow, texel.y)) - dim);
    bloom += (texture2D(tDiffuse, vec2(texel.x, texel.y + glow)) - dim);
    bloom += (texture2D(tDiffuse, vec2(texel.x, texel.y - glow)) - dim);

    // Clamp the value between a 0.0 to 1.0 range
    bloom = clamp(bloom / 9.0, 0.0, 1.0);

    col = pixel + bloom;
  } else {
    col = vec4(pixel.rgb, 1.0);
  }

  gl_FragColor = col;
}