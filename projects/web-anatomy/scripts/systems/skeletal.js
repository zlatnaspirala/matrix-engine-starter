import * as matrixEngine from "matrix-engine";

export let loadSystemSkeletal = (App, world) => {

// LOAD MESH FROM OBJ FILES...
  // if you dont use obj or complex mesh you no need for this func
  function onLoadObj(meshes) {
    App.meshes = meshes;
    matrixEngine.objLoader.initMeshBuffers(world.GL.gl, App.meshes.armor);
    matrixEngine.objLoader.initMeshBuffers(world.GL.gl, App.meshes.mac);

    var textuteImageSamplers2 = {
      source: ["res/images/metal.jpg"],
      mix_operation: "multiply",
    };

    world.Add("obj", 1, "armor", textuteImageSamplers2, App.meshes.armor);
    App.scene.armor.position.y = 1;
    // App.scene.armor.rotation.rotationSpeed.y = 20;
    App.scene.armor.LightsData.ambientLight.set(2, 2, 2);

    world.Add("obj", 1, "mac", textuteImageSamplers2, App.meshes.mac);
    App.scene.mac.position.y = 1;
    App.scene.mac.position.x = -2;
    // App.scene.mac.rotation.rotationSpeed.y = 20;
    App.scene.mac.LightsData.ambientLight.set(1, 1, 1);

  }

  matrixEngine.objLoader.downloadMeshes(
    {armor: "res/3d-objects/human/skeletal/atlas.obj", mac: "res/3d-objects/human/skeletal/right medial cuneiform bone.obj"},
    onLoadObj
  );

};