import * as matrixEngine from "matrix-engine";
import skeletalMap from "./map";

export let loadSystemSkeletal = (App, world) => {

  function onLoadObj(meshes) {
    for (let key in meshes) {
      matrixEngine.objLoader.initMeshBuffers(world.GL.gl, meshes[key])
    }

    var textuteImageSamplers2 = {
      source: ["res/images/metal.png"],
      mix_operation: "multiply",
    };

    for (let key in meshes) {
      var id = "skeletal_" + key;
      world.Add("obj", 1, id, textuteImageSamplers2, meshes[key]);
      // still must be called with method - SCALE for OBJ Mesh
       App.scene[id].mesh.setScale(-0.0025)
      // App.scene[id].glBlend.blendEnabled = true;
      App.scene[id].position.z =  -9;
      App.scene[id].position.y =  -2;
      App.scene[id].rotation.rotx = 90;
      // App.scene[id].rotation.roty = 0;
      // App.scene[id].rotation.rotz = 0;
      // App.scene[id].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      // App.scene[id].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[7];
    }
    // App.scene.armor.position.y = 1;
    // App.scene.armor.LightsData.ambientLight.set(2, 2, 2);
  }

  // Load mesh data
  matrixEngine.objLoader.downloadMeshes(skeletalMap, onLoadObj /*{ swap: [0, 1]}*/ );

};