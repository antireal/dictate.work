import * as THREE from "three";
import WebGLApp from "./lib/WebGLApp";
import assets from "./lib/AssetManager";
import MeshController from "./scene/MeshController";

import SimplexNoise from "simplex-noise";

import PostProcessing from "./scene/PostProcessing";
import CameraController from "./scene/CameraController";

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
  orbitControls: false, //window.DEBUG && { distance: 7, damping: 0.1 },
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
  webgl.camera.position.set(0, 0, 6);

  const mesh_controller = new MeshController(webgl, simplex, webgl.camera, {
    regen_prob: 0.2,
    regen_cooldown: 0.5,
  });
  webgl.scene.add(mesh_controller);

  const post = new PostProcessing(webgl, {});
  webgl.scene.add(post);

  const camera_controller = new CameraController(
    webgl,
    webgl.orbitControls,
    {}
  );
  webgl.scene.add(camera_controller);
  
  // start animation loop
  webgl.start();
  webgl.draw();
});
