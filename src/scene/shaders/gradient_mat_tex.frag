// clang-format off
uniform vec2 resolution;
uniform vec3 color;
uniform vec3 color_end;
uniform float curve;

uniform vec2 cursor_pos;

uniform sampler2D overlay_tex;
varying vec2 vUv;

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec4 saturateBlend(vec3 a, vec3 b, float amt)
{
  // vec3 hsv_a = rgb2hsv(a);
  // float luma_b = dot(b, vec3(0.299, 0.587, 0.114));
  // vec3 rgb_mixed = hsv2rgb(vec3(
  //   hsv_a.r, 
  //   mix(hsv_a.g, luma_b, amt), 
  //   hsv_a.b
  // ));

  // return vec4(hsv2rgb(hsv_a), 1.0);

  // vec3 hsv_a = rgb2hsv(a);
  // float luma_b = b.r;
  // hsv_a.g -= luma_b * amt;

  vec3 res = mix(a, vec3(120., 120., 120.), -((b.r + b.g + b.b) / 255.0 / 3.0));

  return vec4(res, 1.0);
}

void main() {
  vec2 st = gl_FragCoord.xy / resolution.xy;

  float mix_value = mix(distance(st, cursor_pos * vec2(1., -1.)),
                        distance(st, vec2(0., 0.)), .4);
  vec3 grad = mix(color_end, color, pow(mix_value, curve));

  float tex_scale = 1.0 / 0.5;
  vec4 texColor = texture2D(overlay_tex, st * tex_scale);

  gl_FragColor = saturateBlend(grad, texColor.rgb, 1.0);
  // gl_FragColor = texColor;
}