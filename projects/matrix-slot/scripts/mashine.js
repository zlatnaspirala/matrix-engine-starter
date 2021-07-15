
import * as matrixEngine from "matrix-engine";

var App = matrixEngine.App;

export default class Mashines {

  constructor(world) {
    this.speed = 0.08;
    this.thread = null;
    this.preThread = null;
    this.accessKeys = [];
    this.spinHandler = {
      lastInitY: [],
      bottomLimitY: -3.99
    };

    this.addMashine(world);
    this.addWheel(world);
    this.load2dPlaneFonts(world);
  }

  load2dPlaneFonts = function (world) {
    function onLoadObj(meshes) {
      App.meshes = meshes;
      OBJ.initMeshBuffers(world.GL.gl, App.meshes.typoA);

      var textuteImageSamplers2 = {
        source: ["res/icons/512.png"],
        mix_operation: "multiply",
      };

      world.Add("obj", 1, "typoA", textuteImageSamplers2, App.meshes.typoA);
      App.scene.typoA.position.y = 3;
      App.scene.typoA.LightsData.ambientLight.set(1, 1, 1);
    }

    OBJ.downloadMeshes({typoA: "assets/2dplanefont/a.obj"}, onLoadObj);
  };

  addMashine = function (world) {
    world.Add("square", 1, "topHeader");
    App.scene.topHeader.geometry.setScaleByX(5.7);
    App.scene.topHeader.geometry.setScaleByY(0.225);
    App.scene.topHeader.position.y = 1.9;

    var textuteImageSamplers2 = {
      source: ["res/icons/512.png"],
      mix_operation: "multiply",
    };

    world.Add("square", 1, "footerHeader");
    App.scene.footerHeader.geometry.setScaleByX(5.8);
    App.scene.footerHeader.geometry.setScaleByY(0.22);
    App.scene.footerHeader.position.y = -1.85;
    /*
    // Style color buttom of footer
    App.scene.topHeader.geometry.colorData.color[2].set(1,0,0);
    App.scene.topHeader.geometry.colorData.color[3].set(1,0,0);
    App.scene.topHeader.geometry.colorData.color[0].set(0,0,0);
    App.scene.topHeader.geometry.colorData.color[1].set(0,0,0);

    App.scene.footerHeader.geometry.colorData.color[0].set(1,0,0);
    App.scene.footerHeader.geometry.colorData.color[1].set(1,0,0);
    App.scene.footerHeader.geometry.colorData.color[2].set(0,0,0);
    App.scene.footerHeader.geometry.colorData.color[3].set(0,0,0);
    */

    //App.operation.square_buffer_procedure(App.scene.topHeader);
    //App.operation.squareTex_buffer_procedure(App.scene.footerHeader);

    console.info("Mashine is constructed.");
  };

  addWheel = function (world) {
    console.info("Number of wheels: ", App.slot.config.wheels.length);
    console.info(
      "Number of vertical visible fields of wheels: ",
      App.slot.config.verticalSize
    );
    var WW = App.slot.config.wheels.length;
    var VW = App.slot.config.verticalSize;

    var textuteImageSamplers2 = {
      source: ["res/icons/512.png"],
      mix_operation: "multiply",
    };

    App.slot.config.wheels.forEach((wheel, indexWheel) => {
      var localHandler = [], lastY = 0;
      wheel.forEach((field, indexField) => {
        var name = "wheel" + indexWheel + "field" + indexField;
        world.Add("squareTex", 1, name, textuteImageSamplers2);
        localHandler.push(name);
        // Referent done for default camera position.
        var O = (window.innerWidth /  1000 * WW );
        var O2 = (window.innerWidth /  1005 * WW );
        App.scene[name].position.z = -9;
        App.scene[name].position.x = -O*0.86 + (indexWheel * O2) * 0.862;
        App.scene[name].position.y = -2 + indexField * 2;
        lastY = App.scene[name].position.y;
        App.scene[name].geometry.setScaleByX(O / 2.356);
        App.scene[name].geometry.setScaleByY(2.97 / VW);
        /*
        App.scene[name].geometry.colorData.color[0].set(field.color.r,field.color.b,field.color.g)
        App.scene[name].geometry.colorData.color[1].set(field.color.r,field.color.b,field.color.g)
        App.scene[name].geometry.colorData.color[2].set(field.color.r,field.color.b,field.color.g)
        App.scene[name].geometry.colorData.color[3].set(1,1,1);
        App.operation.square_buffer_procedure(App.scene[name]);
        */

      });

      this.spinHandler.lastInitY.push(lastY);
      this.accessKeys.push(localHandler);
    });
  };

  activateSpinning = () => {
    this.preSpinning(0).then(() => {
      this.spinning(0);
      this.preSpinning(1).then(() => {
        this.spinning(1);
        this.preSpinning(2).then(() => {
          this.spinning(2);
        });
      });
    });
  };

  spinning = (wheelID) => {
    this.thread = setInterval(() => {
      this.accessKeys.forEach((accessWheelNames, indexWheel) => {
        if (wheelID == indexWheel) {
          accessWheelNames.forEach((fieldname, indexField) => {
            App.scene[fieldname].position.y -= this.speed;

            if (wheelID == 0) {
              App.scene.[fieldname].rotation.rotationSpeed.x = 100;

            } else if (wheelID == 1) {
              App.scene.[fieldname].rotation.rotationSpeed.y = 100;
            } else if (wheelID == 2) {
              App.scene.[fieldname].rotation.rotationSpeed.x = -100;
            }

            if (App.scene[fieldname].position.y < this.spinHandler.bottomLimitY) {
              App.scene[fieldname].position.y = App.slot.mashine.spinHandler.lastInitY[indexWheel];
            }
          });
        }
      });
    }, 1);
  }

  preSpinning = (wheelID) => {
    return new Promise((resolve, reject) => {
    this.preThread = setInterval(() => {
      this.accessKeys.forEach((accessWheelNames, indexWheel) => {
        if (indexWheel == wheelID) {
          accessWheelNames.forEach((fieldname, indexField) => {
            App.scene[fieldname].position.y += 0.002;
          });
        }
      });
    }, 1);
    setTimeout(() => {
      clearInterval(this.preThread);
      resolve();
    }, 150);
  })
  }

  deActivateSpiningThread = () => {
    clearInterval(this.thread);
  };

}
