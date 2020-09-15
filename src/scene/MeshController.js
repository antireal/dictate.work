import * as THREE from "three";
import assets from "../lib/AssetManager";

import RandomMesh from "./RandomMesh";
import SimplexOctaves from "../lib/SimplexOctaves";

// const overlayTexKey = assets.queue({
//   url: "assets/textures/rtex01-bit.jpg",
//   type: "texture",
// });

export default class MeshController extends THREE.Group {
  constructor(webgl, simplex, camera, options) {
    super(options);
    this.webgl = webgl;
    this.options = options;
    this.simplex = simplex;
    this.simplex_octaves = SimplexOctaves(simplex);
    this.seed = Math.random() * 25565;
    this.mouseDelta = [0, 0];

    this.regen_timer = 0;

    // light blue
    this.add(
      new RandomMesh(webgl, simplex, camera, {
        color: new THREE.Color(0x7fffee),
        color_end: new THREE.Color(0x38dce8).offsetHSL(0.05, 0.1, -0.1),
        radius: 6,
        faces: 4,
        speed: 0.01,
        regen_prob: 0.007,
        draw_outline: true,
      })
    );

    // dark blue
    const dark_blue = new RandomMesh(webgl, simplex, camera, {
      color: new THREE.Color(0x0a0d30),
      color_end: new THREE.Color(0x0e1275),
      radius: 8,
      faces: 4,
      speed: 0.0005,
      regen_prob: 0.0001,
      rotate: false,
    });
    dark_blue.scale.setX(4);
    dark_blue.scale.setY(4);
    dark_blue.position.setZ(-1);
    this.add(dark_blue);

    // red
    this.add(
      new RandomMesh(webgl, simplex, camera, {
        color: new THREE.Color(0xce1d37),
        color_end: new THREE.Color(0xce1d37).offsetHSL(-0.1, 0.2, -0.2),
        // texture: assets.get(overlayTexKey),
        radius: 10,
        faces: 3,
        speed: 0.006,
        regen_prob: 0.0001,
        // draw_outline: true,
      })
    );

    const grey = new RandomMesh(webgl, simplex, camera, {
      color: new THREE.Color(0xc6c7f5).offsetHSL(0, 0, -0.1),
      color_end: new THREE.Color(0x443c75).offsetHSL(0, 0, -0.1),
      curve: 1,
      radius: 8,
      faces: 1,
      speed: 0.012,
      regen_prob: 0.02,
      draw_outline: true,
    });
    this.add(grey);
  }

  update(dt, time) {
    const { regen_prob = 0.3, regen_cooldown = 2 } = this.options;
    const noise = (this.simplex_octaves(time * 10, this.seed) + 1) / 2;

    if (noise < regen_prob) {
      // console.log("tried to regen, timer at", this.regen_timer);
      if (this.regen_timer <= 0) {
        // console.log("regenerating");
        this.regen_timer = regen_cooldown;

        for (let i = 0; i < this.children.length; i++) {
          const m = this.children[i];
          m.regen();
        }
      }
    }
    this.regen_timer -= dt;

    const rotate_speed = 0.065;
    const rotate_inertia = 0.95;

    // rotate group
    this.rotateY(this.mouseDelta[0] * dt * rotate_speed);
    this.rotateX(this.mouseDelta[1] * dt * rotate_speed);

    this.mouseDelta[0] *= rotate_inertia;
    this.mouseDelta[1] *= rotate_inertia;

    // this.rotateZ(-0.001 * dt * 100);
  }

  onPointerMove(e, [x, y]) {
    // this.mouseDelta[0] += e.movementX;
    // this.mouseDelta[1] += e.movementY;
    this.mouseDelta[0] += (x - this.webgl.width / 2) / this.webgl.width;
    this.mouseDelta[1] += (y - this.webgl.height / 2) / this.webgl.height;
  }
}
