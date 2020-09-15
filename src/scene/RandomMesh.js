import * as THREE from "three";

import gradient_mat_frag from "./shaders/gradient_mat.frag";
// import gradient_mat_tex_frag from "./shaders/gradient_mat_tex.frag";
import gradient_mat_vert from "./shaders/gradient_mat.vert";

import { MeshLine, MeshLineMaterial } from "three.meshline";

import SimplexOctaves from "../lib/SimplexOctaves";

const DIRS = [
  new THREE.Vector3(0, 0, -1), //   NORTH
  new THREE.Vector3(0, 0, 1), //    SOUTH
  new THREE.Vector3(1, 0, 0), //    EAST
  new THREE.Vector3(-1, 0, 0), //   WEST
  new THREE.Vector3(0, 1, 0), //    ZENITH
  new THREE.Vector3(0, -1, 0), //   NADIR
];

const flip_dir = i => (i % 2 ? i - 1 : i + 1);

export default class RandomMesh extends THREE.Group {
  constructor(webgl, simplex, camera, options) {
    super(options);
    // these can be used also in other methods
    this.webgl = webgl;
    this.options = options;
    this.camera = camera;
    this.simplex_octaves = SimplexOctaves(simplex);
    this.seed = Math.random() * 25565;

    this.raycaster = new THREE.Raycaster();

    const {
      color,
      color_end,
      texture,
      curve,
      radius,
      faces,
      draw_outline = false,
      rotate = true,
    } = this.options;

    const directions = [];
    this.directions = directions;

    const half_r = radius / 2;
    const geometry = new THREE.Geometry();
    for (let i = 0; i < faces * 3; i++) {
      for (let v = 0; v < 3; v++) {
        geometry.vertices.push(
          new THREE.Vector3(
            Math.random() * radius - half_r,
            Math.random() * radius - half_r,
            Math.random() * radius - half_r
          )
        );
        this.directions.push(Math.floor(Math.random() * 6));
      }
      geometry.faces.push(new THREE.Face3(i, i + 1, i + 2));
    }
    geometry.computeBoundingSphere();

    // const overlay_tex = texture;
    // if (overlay_tex) {
    //   overlay_tex.wrapS = THREE.RepeatWrapping;
    //   overlay_tex.wrapT = THREE.RepeatWrapping;
    //   overlay_tex.repeat.set(8, 8);
    // }

    const material = new THREE.ShaderMaterial({
      uniforms: {
        resolution: { value: new THREE.Vector2() },
        color: { value: color },
        color_end: { value: color_end || color },
        curve: { value: curve || 1 },
        cursor_pos: { value: new THREE.Vector2() },
        // overlay_tex: texture && { type: "t", value: overlay_tex },
      },
      vertexShader: gradient_mat_vert,
      fragmentShader: texture ? gradient_mat_tex_frag : gradient_mat_frag,
    });
    this.material = material;
    // if (overlay_tex) material.side = THREE.DoubleSide;
    material.uniforms.resolution.value.set(
      webgl.width * webgl.pixelRatio,
      webgl.height * webgl.pixelRatio
    );

    this.mesh = new THREE.Mesh(geometry, material);
    this.add(this.mesh);

    if (draw_outline) {
      this.line = new MeshLine();
      this.line.setGeometry(geometry);
      this.line_material = new MeshLineMaterial({
        lineWidth: 0.01,
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.5,
      });
      const line_mesh = new THREE.Mesh(this.line, this.line_material);

      this.add(line_mesh);
    }
  }

  regen() {
    let { radius } = this.options;

    radius *= 0.5 + (Math.random() - 0.5);
    const half_r = radius / 2;

    for (let i = 0; i < this.mesh.geometry.vertices.length; i++) {
      const v = this.mesh.geometry.vertices[i];
      v.set(
        Math.random() * radius - half_r,
        Math.random() * radius - half_r,
        Math.random() * radius - half_r
      );
    }
  }

  update(dt, time) {
    const {
      radius,
      speed,
      regen_prob,
      draw_outline = false,
      rotate = true,
    } = this.options;
    const noise = 0.25 + (1 + this.simplex_octaves(time, this.seed)) / 3;

    for (let i = 0; i < this.mesh.geometry.vertices.length; i++) {
      const v = this.mesh.geometry.vertices[i];
      v.addScaledVector(DIRS[this.directions[i]], noise * speed * dt * 100);
      if (v.distanceTo(new THREE.Vector3(0, 0, 0)) >= radius / 2) {
        this.directions[i] = flip_dir(this.directions[i]);
      }
    }
    if (Math.random() < regen_prob) this.regen();

    this.mesh.geometry.verticesNeedUpdate = true;
    if (draw_outline) {
      const noise2 = this.simplex_octaves(time * 1, this.seed + 54905);
      if (noise2 > 0.4) this.line_material.opacity = noise2;
      else this.line_material.opacity = 0;

      this.line.setGeometry(this.mesh.geometry);
    }

    if (rotate) this.mesh.rotation.y += dt * 1 * speed;
  }

  onPointerMove(e, [x, y]) {
    this.material.uniforms.cursor_pos.value.set(
      x / this.webgl.width,
      y / this.webgl.width
    );
  }

  resize({ width, height, pixelRatio }) {
    this.material.uniforms.resolution.value.set(
      width * pixelRatio,
      height * pixelRatio
    );
  }
}
