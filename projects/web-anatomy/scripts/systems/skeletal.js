import * as matrixEngine from "matrix-engine";
import skeletalMap from "./map";

export let loadSystemSkeletal = (App, world) => {

  function onLoadObj(meshes) {

    // Store raw mesh data
    App.meshes = meshes;

 
    // Init buffers
    for (let key in meshes) {
      console.log("TEST App.meshes[key]", App.meshes[key])
      matrixEngine.objLoader.initMeshBuffers(world.GL.gl, App.meshes[key]);
    }

    // Tex
    var textuteImageSamplers2 = {
      source: ["res/images/metal.png"],
      mix_operation: "multiply",
    };

    App.camera.speedAmp

    for (let key in meshes) {
      world.Add("obj", 1, "skeletal_" + key, textuteImageSamplers2, App.meshes[key]);
      // still must be called with method - SCALE for OBJ Mesh
      App.scene["skeletal_" + key].mesh.setScale(-0.01)
      App.scene["skeletal_" + key].glBlend.blendEnabled = true;

      
      App.scene["skeletal_" + key].position.y =  2;

      App.scene["skeletal_" + key].rotation.rotx = 0;
      App.scene["skeletal_" + key].rotation.roty = 90;
      App.scene["skeletal_" + key].rotation.rotz = 90;

      App.scene["skeletal_" + key].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
      App.scene["skeletal_" + key].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    }

    // App.scene.armor.position.y = 1;
    // App.scene.armor.LightsData.ambientLight.set(2, 2, 2);

  }

  // Load mesh data
  matrixEngine.objLoader.downloadMeshes(skeletalMap, onLoadObj);

};