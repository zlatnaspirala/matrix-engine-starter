/* eslint-disable no-unused-vars */
/**
 * @Author Nikola Lukic
 * @Description Matrix Engine Api Example.
 */

export var runThis = (matrixEngine) => {

  let world = matrixEngine.matrixWorld.world;
  let App = matrixEngine.App;
  let ACCESS_CAMERA =  matrixEngine.Engine.ACCESS_CAMERA;

  var textuteImageSamplers = {
    source: ["res/images/complex_texture_1/diffuse.png"],
    mix_operation: "multiply",
  };

  function onLoadObj(meshes) {
    App.meshes = meshes;
    matrixEngine.objLoader.initMeshBuffers(world.GL.gl, App.meshes.TV);

    setTimeout(function () {
      world.Add("obj", 1, "TV", textuteImageSamplers, App.meshes.TV);
      App.scene.TV.position.y = 0;
      App.scene.TV.position.z = -4;
      App.scene.TV.rotation.rotateY(90);
      App.scene.TV.LightsData.ambientLight.set(1, 1, 1);
      App.scene.TV.streamTextures = new ACCESS_CAMERA("webcam_beta");
    }, 1000);
  }

  matrixEngine.objLoader.downloadMeshes({TV: "res/3d-objects/balltest2.obj"}, onLoadObj);
};
