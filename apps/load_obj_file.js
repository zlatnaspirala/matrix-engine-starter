/* eslint-disable no-unused-vars */

/*
  Nikola Lukic
  webGl2GLmatrix2 api example
  app/canvas2d/build.html is visual-js 2d part program instance
*/

/**
 * @Author Nikola Lukic
 * @Description Matrix Engine Api Example.
 */

 export var runThis = (matrixEngine) => {

  let world = matrixEngine.matrixWorld.world;
  let App = matrixEngine.App;

  // LOAD MESH FROM OBJ FILES...
  // if you dont use obj or complex mesh you no need for this func
  function onLoadObj(meshes) {
    App.meshes = meshes;
    matrixEngine.objLoader.initMeshBuffers(world.GL.gl, App.meshes.armor);
    matrixEngine.objLoader.initMeshBuffers(world.GL.gl, App.meshes.mac);

    var textuteImageSamplers2 = {
      source: ["res/images/armor.png"],
      mix_operation: "multiply",
    };

    var textuteImageSamplers = {
      source: ["res/images/dagger.png"],
      mix_operation: "multiply",
    };

    world.Add("obj", 0.001, "armor", textuteImageSamplers2, App.meshes.armor);
    App.scene.armor.position.y = 1;
    App.scene.armor.rotation.rotationSpeed.y = 20;
    App.scene.armor.LightsData.ambientLight.set(1, 1, 1);

    world.Add("obj", 1, "mac", textuteImageSamplers, App.meshes.mac);
    App.scene.mac.position.y = 1;
    App.scene.mac.position.x = -2;
    App.scene.mac.rotation.rotationSpeed.y = 20;
    App.scene.mac.LightsData.ambientLight.set(1, 1, 1);
  }

  matrixEngine.objLoader.downloadMeshes(
    {armor: "res/3d-objects/armor.obj", mac: "res/3d-objects/mac.obj"},
    onLoadObj
  );

  //delete images_local_var;
};
