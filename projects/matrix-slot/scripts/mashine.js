import * as matrixEngine from "matrix-engine";

var world, mashine;
var App = matrixEngine.App;

export default class Mashines {

  constructor(world) {

    this.speed = 0.1;
    this.thread = null;
    this.accessKeys = [];
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
      App.scene.mainMashineBlock.position.z = -9;
      App.scene.mainMashineBlock.rotation.rotationSpeed.y = 0;
      App.scene.mainMashineBlock.LightsData.ambientLight.set(1, 1, 1);
  
    }
  
    matrixEngine.OBJ.downloadMeshes(
      {mainMashineBlock: "assets/main-plane/main-plane-base-test-tex1.obj"},
      onLoadObj
    );

  }

  addWheel = function(world) {

    console.info("Number of wheels: ", App.slot.config.wheels.length);
    App.slot.config.wheels.forEach((wheel, indexWheel) => {
      var localHandler = [];
      wheel.forEach((field, indexField) => {
        var name = "wheel" + indexWheel + "field" + indexField;
        world.Add("square", 2.15, name);
        localHandler.push(name);
        App.scene[name].position.z = -9;
        App.scene[name].position.x = -6 + (indexWheel * 6);
        App.scene[name].position.y = -2.5 + (indexField * 2.5);
        App.scene[name].geometry.setScaleByY(0.4);
      });
      this.accessKeys.push(localHandler);
    });

  }

  activateSpining = () => {
    this.thread = setInterval(() => {

      this.accessKeys.forEach((accessWheelNames, indexWheel) => {
        accessWheelNames.forEach((fieldname, indexWheel) => {
          App.scene[fieldname].position.y -= this.speed;
        });

      });

    }, 1)
  }

  activateSpiningThread = () => {
    clearInterval(this.thread)
  }
}