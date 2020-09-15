import * as THREE from "three";

import { ShaderPass } from "../lib/three/ShaderPass";
import fxaa_frag from "./shaders/fxaa.frag";
import fxaa_vert from "./shaders/fxaa.vert";

import pass_vert from "./shaders/pass.vert";
import vignette_frag from "./shaders/vignette.frag";
import bloom_grain_frag from "./shaders/bloom_grain.frag";
import ca_frag from "./shaders/chromatic_aberration.frag";

export default class PostProcessing extends THREE.Group {
  constructor(webgl, options) {
    super(options);
    this.webgl = webgl;

    const ca_pass = new ShaderPass({
      vertexShader: pass_vert,
      fragmentShader: ca_frag,
      uniforms: {
        tDiffuse: { type: "t", value: new THREE.Texture() },
        resolution: { type: "v2", value: new THREE.Vector2() },
      },
    });
    this.ca_pass = ca_pass;
    this.ca_pass.uniforms.resolution.value.set(
      webgl.width * webgl.pixelRatio,
      webgl.height * webgl.pixelRatio
    );
    webgl.composer.addPass(this.ca_pass);

    const vignette_pass = new ShaderPass({
      vertexShader: pass_vert,
      fragmentShader: vignette_frag,
      uniforms: {
        tDiffuse: { type: "t", value: new THREE.Texture() },
      },
    });
    this.vignette_pass = vignette_pass;
    webgl.composer.addPass(this.vignette_pass);

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

    const bloom_grain_pass = new ShaderPass({
      vertexShader: pass_vert,
      fragmentShader: bloom_grain_frag,
      uniforms: {
        time: { value: 0.0 },
        tDiffuse: { type: "t", value: new THREE.Texture() },
        resolution: { type: "v2", value: new THREE.Vector2() },
        bloomFactor: { value: 1.0 },
      },
    });
    this.bloom_grain_pass = bloom_grain_pass;
    this.bloom_grain_pass.uniforms.resolution.value.set(
      webgl.width * webgl.pixelRatio,
      webgl.height * webgl.pixelRatio
    );
    webgl.composer.addPass(this.bloom_grain_pass);
  }

  update(dt, time) {
    this.bloom_grain_pass.uniforms.time.value = time * 100;
  }

  resize({ width, height, pixelRatio }) {
    this.fxaa_pass.uniforms.resolution.value.set(
      width * pixelRatio,
      height * pixelRatio
    );
    this.ca_pass.uniforms.resolution.value.set(
      width * pixelRatio,
      height * pixelRatio
    );
    this.bloom_grain_pass.uniforms.resolution.value.set(
      width * pixelRatio,
      height * pixelRatio
    );
    console.log("updated uniforms");
  }
}
