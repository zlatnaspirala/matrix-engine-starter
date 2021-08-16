import * as matrixEngine from "matrix-engine";
import {planeFont, planeUVFont} from "matrix-engine-plugins";

var App = matrixEngine.App;

export default class Mashines {

  constructor(world) {

    this.status = "free";
    this.font = new planeUVFont();
    this.speed = 0.08;
    this.thread = null;
    this.preThread = null;
    this.accessKeys = [];
    this.spinHandler = {
      lastInitY: [],
      bottomLimitY: -3.99,
      orderPositions: []
    };

    this.addMashine(world);
    this.addWheel(world);
    this.addHeaderText();
    this.addRaycaster();

  }

  addMashine = function (world) {

    world.Add("square", 1, "topHeader");
    App.scene.topHeader.geometry.setScaleByX(11);
    App.scene.topHeader.geometry.setScaleByY(0.39);
    App.scene.topHeader.position.y = 2.56;
    App.scene.topHeader.position.z = -6.5;

    var textuteImageSamplers2 = {
      source: ["res/icons/512.png"],
      mix_operation: "multiply",
    };

    world.Add("square", 1, "footerHeader");
    App.scene.footerHeader.geometry.setScaleByX(11);
    App.scene.footerHeader.geometry.setScaleByY(0.39);
    App.scene.footerHeader.position.y = -2.56;
    App.scene.footerHeader.position.z = -6.5;

    // Style color buttom of footer
    App.scene.topHeader.geometry.colorData.color[2].set(0.2, 0.2, 0.2);
    App.scene.topHeader.geometry.colorData.color[3].set(0.2, 0.2, 0.2);
    App.scene.topHeader.geometry.colorData.color[0].set(0.2, 0, 0);
    App.scene.topHeader.geometry.colorData.color[1].set(0.2, 0.2, 0.2);

    App.scene.footerHeader.geometry.colorData.color[0].set(0.1, .1, 0.1);
    App.scene.footerHeader.geometry.colorData.color[1].set(0.1, .1, 0.1);
    App.scene.footerHeader.geometry.colorData.color[2].set(0.1, .1, 0.1);
    App.scene.footerHeader.geometry.colorData.color[3].set(0.1, .1, 0.1);

    App.operation.square_buffer_procedure(App.scene.topHeader);
    App.operation.square_buffer_procedure(App.scene.footerHeader);

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
      source: ["res/logo/512.png"],
      mix_operation: "multiply",
    };

    App.slot.config.wheels.forEach((wheel, indexWheel) => {
      var localHandler = [],
          localHandlerPos = [],
          lastY = 0;
      wheel.forEach((field, indexField) => {
        var name = "wheel" + indexWheel + "field" + indexField;
        world.Add("squareTex", 1, name, textuteImageSamplers2);
        localHandler.push(name);
        // Referent done for default camera position.
        var O = (window.innerWidth / 1000) * WW;
        var O2 = (window.innerWidth / 1005) * WW;

        console.log("test .wheel____", wheel)
        console.log("test .field", field)
        App.scene[name].LightsData.ambientLight.set(field.color.r, field.color.g, field.color.b);

        var _x = -O * 0.5 + indexWheel * O2 * 0.2;
        var _y = -2 + indexField * 2;
        var _z = -9;
        App.scene[name].position.z = _z;
        App.scene[name].position.x = _x;
        App.scene[name].position.y = _y;

        localHandlerPos.push({ _x, _y, _z });

        lastY = App.scene[name].position.y;
        App.scene[name].geometry.setScaleByX(O / 10);
        App.scene[name].geometry.setScaleByY(2.97 / VW);

        //App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
        //App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[5] ;
    
       // App.scene.spinBtn.geometry.setScaleByY(-0.76)
       //App.scene[name].glBlend.blendEnabled = true;

        /*
        App.scene[name].geometry.colorData.color[0].set(field.color.r,field.color.b,field.color.g)
        App.scene[name].geometry.colorData.color[1].set(field.color.r,field.color.b,field.color.g)
        App.scene[name].geometry.colorData.color[2].set(field.color.r,field.color.b,field.color.g)
        App.scene[name].geometry.colorData.color[3].set(1,1,1);
        App.operation.square_buffer_procedure(App.scene[name]);
        */
      });

      this.spinHandler.orderPositions.push(localHandlerPos);
      this.spinHandler.lastInitY.push(lastY);
      this.accessKeys.push(localHandler);
    });
  };

  addHeaderText = function () {

    var c = 0;
    var count = 0;
    this.font.charLoaded = (objChar) => {

      console.log(objChar.name);
      // headerTitleS
      objChar.mesh.setScale(0.6)
      objChar.position.SetZ(-6.45);
      switch(objChar.name) {
        case 'headerTitleS':
          count = 0;
          break;
        case 'headerTitleL':
          count = 1;
          break;
        case 'headerTitleO':
          count = 1.4;
          break;
        case 'headerTitleT':
          count = 2.5;
          break;
      }
      objChar.position.translateByXY(-1.8 + count*0.4 , 2.2);
      objChar.glBlend.blendEnabled = true;
      if (c == 3) this.addSpinText();
      c++;
    }
    this.font.loadChar(matrixEngine.objLoader, "s", "headerTitle");
    this.font.loadChar(matrixEngine.objLoader, "l", "headerTitle");
    this.font.loadChar(matrixEngine.objLoader, "o", "headerTitle");
    this.font.loadChar(matrixEngine.objLoader, "t", "headerTitle");

  };

  addRaycaster = () => {

    window.addEventListener("ray.hit.event", (matrixEngineRaycastEvent) => {
      console.log("details > ", matrixEngineRaycastEvent.detail.hitObject.name);
      var r =  matrixEngineRaycastEvent.detail.hitObject.name;
      if (r == "spinBtn") {
        this.activateSpinning();
      }
    });

    canvas.addEventListener('mousedown', (ev) => {
      matrixEngine.raycaster.checkingProcedure(ev);
    });
  }

  addSpinText = function () {

    var textuteImageSamplers = {
      source: ["res/images/spinBtn1.png"],
      mix_operation: "multiply", // ENUM : multiply , divide ,
    };

    world.Add("squareTex", 1, "spinBtn", textuteImageSamplers);
    App.scene.spinBtn.position.SetY(-1.87);
    App.scene.spinBtn.position.SetX(2);
    App.scene.spinBtn.position.SetZ(-5);
    App.scene.spinBtn.geometry.setScale(0.3);
    App.scene.spinBtn.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    App.scene.spinBtn.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];

   // App.scene.spinBtn.geometry.setScaleByY(-0.76)
    App.scene.spinBtn.glBlend.blendEnabled = true;
    // App.scene.spinBtn.rotation.rotz = 90;

  };

  activateSpinning = () => {
    if (this.status != "free") {
      console.info("Already spinning...");
      return;
    }
    this.status = "spinning";
    this.preSpinning(0).then(() => {
      this.spinning(0);
      this.preSpinning(1).then(() => {
        this.spinning(1);
        this.preSpinning(2).then(() => {
          this.spinning(2);
          this.preSpinning(3).then(() => {
            this.spinning(3);
            this.preSpinning(4).then(() => {
              this.spinning(4);
              this.preSpinning(5).then(() => {
                this.spinning(5);
                this.allWheelSpinningMoment();
              });
            });
          });
        });
      });
    });
  };

  allWheelSpinningMoment = () => {
    console.info("All wheels spinning");
  }

  spinning = wheelID => {
    this.thread = setInterval(() => {
      this.accessKeys.forEach((accessWheelNames, indexWheel) => {
        if (wheelID == indexWheel) {
          accessWheelNames.forEach((fieldname, indexField) => {
            App.scene[fieldname].position.y -= this.speed;

            if (wheelID == 0) {
              App.scene[fieldname].rotation.rotationSpeed.x = 100;
            } else if (wheelID == 1) {
              App.scene[fieldname].rotation.rotationSpeed.y = 100;
            } else if (wheelID == 2) {
              App.scene[fieldname].rotation.rotationSpeed.x = -100;
            }

            if (
              App.scene[fieldname].position.y < this.spinHandler.bottomLimitY
            ) {
              App.scene[fieldname].position.y =
                App.slot.mashine.spinHandler.lastInitY[indexWheel];
            }
          });
        }
      });
    }, 1);
  };

  preSpinning = wheelID => {
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
    });
  };

  deActivateSpiningThread = () => {
    clearInterval(this.thread);
  };
}
