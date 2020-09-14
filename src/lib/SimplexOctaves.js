const SimplexOctaves = simplex => (
  x,
  y,
  octaves = 3,
  persistence = 0.5,
  lacunarity = 2.0
) => {
  let total = 0;
  let frequency = 1;
  let amplitude = 1;
  let totalAmplitude = 0; // Used for normalizing result between 0.0 and 1.0

  for (let i = 0; i < octaves; i++) {
    total += simplex.noise2D(x * frequency, y * frequency) * amplitude;

    totalAmplitude += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }

  return total / totalAmplitude;
};

export default SimplexOctaves;
