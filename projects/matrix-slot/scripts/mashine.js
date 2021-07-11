import * as matrixEngine from "matrix-engine";

var world, mashine;
var App = matrixEngine.App;

export default class Mashines {

  constructor(world) {
    this.addMashine(world);
    this.addWheel(world);
  }

  addMashine = function(world) {
 
    function onLoadObj(meshes) {
      App.meshes = meshes;
      OBJ.initMeshBuffers(world.GL.gl, App.meshes.mainMashineBlock);
 
  
      var textuteImageSamplers2 = {
        source: ["assets/main-plane/main-plane-tex.png"],
        mix_operation: "multiply",
      };

      world.Add("obj", 1, "mainMashineBlock", textuteImageSamplers2, App.meshes.mainMashineBlock);
      App.scene.mainMashineBlock.position.y = 0;
      App.scene.mainMashineBlock.position.z = -20;
      App.scene.mainMashineBlock.rotation.rotationSpeed.y = 0;
      App.scene.mainMashineBlock.LightsData.ambientLight.set(1, 1, 1);
  
    }
  
    matrixEngine.OBJ.downloadMeshes(
      {mainMashineBlock: "assets/main-plane/main-plane-base-test-tex1.obj"},
      onLoadObj
    );

  }

  addWheel = function(world) {
    world.Add("square", 0.2, "Wheel1");
    App.scene.Wheel1.position.x = -2
  }
}