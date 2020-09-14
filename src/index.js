import * as THREE from "three";
import WebGLApp from "./lib/WebGLApp";
import assets from "./lib/AssetManager";
import RandomMesh from "./scene/RandomMesh";

import SimplexNoise from "simplex-noise";

import PostProcessing from "./scene/PostProcessing";

window.DEBUG = window.location.search.includes("debug");

// grab our canvas
const canvas = document.querySelector("#app");

// setup the WebGLRenderer
const webgl = new WebGLApp({
  canvas,
  // enable transparency
  alpha: true,
  // set the scene background color
  background: "#0a0d30",
  backgroundAlpha: 1,
  postprocessing: true,
  // show the fps counter from stats.js
  showFps: window.DEBUG,
  orbitControls: window.DEBUG && { distance: 7 },
});

// attach it to the window to inspect in the console
if (window.DEBUG) {
  window.webgl = webgl;
}

// hide canvas
webgl.canvas.style.visibility = "hidden";

const simplex = new SimplexNoise();

// load any queued assets
assets.load({ renderer: webgl.renderer }).then(() => {
  // show canvas
  webgl.canvas.style.visibility = "";

  // move the camera behind,
  // this will be considered only if orbitControls are disabled
  webgl.camera.position.set(0, 0, 5);

  // light blue
  webgl.scene.add(
    new RandomMesh(webgl, simplex, {
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
  const dark_blue = new RandomMesh(webgl, simplex, {
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
  webgl.scene.add(dark_blue);

  // red
  webgl.scene.add(
    new RandomMesh(webgl, simplex, {
      color: new THREE.Color(0xce1d37),
      color_end: new THREE.Color(0xce1d37).offsetHSL(-0.1, 0.1, -0.1),
      radius: 10,
      faces: 3,
      speed: 0.006,
      regen_prob: 0.0001,
      // draw_outline: true,
    })
  );

  const grey = new RandomMesh(webgl, simplex, {
    color: new THREE.Color(0xc6c7f5),
    color_end: new THREE.Color(0x443c75),
    curve: 1,
    radius: 8,
    faces: 1,
    speed: 0.012,
    regen_prob: 0.02,
    draw_outline: true,
  });
  webgl.scene.add(grey);

  const post = new PostProcessing(webgl, {});
  webgl.post = post;

  // start animation loop
  webgl.start();
  webgl.draw();
  webgl.orbitControls.damping = 0.1;
});
