import * as THREE from "three";

export default class CameraController extends THREE.Group {
  constructor(webgl, camera, options) {
    super(options);
    this.webgl = webgl;
    this.camera = camera;
  }

  onPointerMove(e, [x, y]) {
    // rotate camera
  }
}
