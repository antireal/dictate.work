uniform vec2 resolution;
uniform vec3 color;
uniform vec3 color_end;
uniform float curve;

uniform vec2 cursor_pos;

void main() {
  vec2 st = gl_FragCoord.xy / resolution.xy;

  float mix_value = mix(distance(st, cursor_pos * vec2(1., -1.)),
                        distance(st, vec2(0., 0.)), .4);
  vec3 grad = mix(color_end, color, pow(mix_value, curve));

  grad = mix(grad, vec3(0.0, 0.0, 0.0), 1.0 - step(mod(st.x, 8.0), 1.0));

  gl_FragColor = vec4(grad, 1.0);
}