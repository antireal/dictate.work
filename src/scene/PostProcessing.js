import * as THREE from "three";

import { ShaderPass } from "../lib/three/ShaderPass";
import fxaa_frag from "./shaders/fxaa.frag";
import fxaa_vert from "./shaders/fxaa.vert";

// import bloom_frag from "./shaders/bloom.frag";
import pass_vert from "./shaders/pass.vert";

import vignette_frag from "./shaders/vignette.frag";

export default class PostProcessing {
  constructor(webgl, options) {
    const fxaa_pass = new ShaderPass({
      vertexShader: fxaa_vert,
      fragmentShader: fxaa_frag,
      uniforms: {
        tDiffuse: { type: "t", value: new THREE.Texture() },
        resolution: { type: "v2", value: new THREE.Vector2() },
      },
    });
    this.fxaa_pass = fxaa_pass;
    this.fxaa_pass.uniforms.resolution.value.set(
      webgl.width * webgl.pixelRatio,
      webgl.height * webgl.pixelRatio
    );
    webgl.composer.addPass(this.fxaa_pass);

    const vignette_pass = new ShaderPass({
      vertexShader: pass_vert,
      fragmentShader: vignette_frag,
      uniforms: {
        tDiffuse: { type: "t", value: new THREE.Texture() },
      },
    });
    this.vignette_pass = vignette_pass;
    webgl.composer.addPass(this.vignette_pass);
  }

  resize(width, height, pixelRatio) {
    this.fxaa_pass.uniforms.resolution.value.set(
      webgl.width * webgl.pixelRatio,
      webgl.height * webgl.pixelRatio
    );
    console.log("updated uniforms");
  }
}
