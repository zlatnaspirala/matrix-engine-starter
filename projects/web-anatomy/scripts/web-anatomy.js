import * as matrixEngine from "matrix-engine";
import {planeFont, planeUVFont} from "matrix-engine-plugins";
import {startSpin, stopSpin} from "./matrix-audio";
import {createNidzaHudBalance} from "./active-textures";
import {Nidza} from "nidza";
import {beep} from "./audio-gen";
import {loadSystemSkeletal} from "./systems/skeletal";

let OSC = matrixEngine.utility.OSCILLATOR;
let App = matrixEngine.App;
let isMobile = matrixEngine.utility.isMobile;

export default class WebAnatomy {
  constructor(world, config) {
    this.config = config;
    this.world = world;

    // Slot status general
    // this.status = "free";

    App.camera.SceneController = true;

    // inject voice commander
    this.vc = {};

    this.nidza = new Nidza();
    // this.createNidzaTextureText = createNidzaTextureText;
    // this.createNidzaHudLinesInfo = createNidzaHudLinesInfo;
    this.createNidzaHudBalance = createNidzaHudBalance;

    this.addAnatomySystems(world);
    this.addRaycaster();

    if(isMobile()) {
      if(window.innerWidth < window.innerHeight) {
        console.log("Mobile device detected with portrain orientation, best fit for this game is landscape.");
      }
    }

  }


  /**
   * @description
   * Add this to untility matrix engine
   */
  arrayRotate(arr, reverse) {
    if(reverse) arr.unshift(arr.pop());
    else arr.push(arr.shift());
    return arr;
  }

  findMax(arr) {
    var counts = {},
      max = 0,
      res;
    for(var v in arr) {
      counts[arr[v]] = (counts[arr[v]] || 0) + 1;
      if(counts[arr[v]] > max) {
        max = counts[arr[v]];
        res = arr[v];
      }
    }
    var results = [];
    for(var k in counts) {
      if(counts[k] == max) {
        var localRes = {fieldId: k, repeat: counts[k]};
        results.push(localRes);
      }
    }
    return results;
  }

  findMaxOfStrDuplicates(argArray) {
    var name;
    var map = new Map();
    var max = 1;
    var maxRecurringString = "";
    for(name of argArray) {
      if(map.get(name) === undefined) {
        map.set(name, 1);
      } else {
        var count = map.get(name);
        count = count + 1;
        map.set(name, count);
        if(max < count) {
          max = count;
          maxRecurringString = name;
        }
      }
    }
    console.log(
      "Maximum recurring string is ",
      maxRecurringString,
      ". Max number of times :" + max
    );
    return {maxRecurringString, max};
  }

  addAnatomySystems = function(world) {

    // Make it natural
    App.camera.speedAmp = 0.001;
    App.camera.sceneControllerDragAmp = 0.2;
    let OSCILLATOR = matrixEngine.utility.OSCILLATOR;
    var oscilltor_variable = new OSCILLATOR(0.1, 3, 0.004);

    var texTopHeader = {
      source: ["res/images/metal.jpg"],
      mix_operation: "multiply",
    };

    // var texMenu = {
    //   source: ["res/images/metal-half.jpg"],
    //   mix_operation: "multiply",
    // };

    // world.Add("squareTex", 1, "topHeader", texTopHeader);
    // App.scene.topHeader.geometry.setScaleByX(4);
    // App.scene.topHeader.geometry.setScaleByY(2.9);
    // App.scene.topHeader.position.SetY(5)
    // App.scene.topHeader.position.z = -6.5;

    // App.scene.topHeader.geometry.texCoordsPoints.right_top.y = -1;
    // App.scene.topHeader.geometry.texCoordsPoints.right_top.x = 1;
    // App.scene.topHeader.geometry.texCoordsPoints.left_bottom.x = -1;
    // App.scene.topHeader.geometry.texCoordsPoints.left_bottom.y = 1;
    // App.scene.topHeader.geometry.texCoordsPoints.left_top.x = -1;
    // App.scene.topHeader.geometry.texCoordsPoints.left_top.y = -1;
    // App.scene.topHeader.geometry.texCoordsPoints.right_bottom.x = 1;
    // App.scene.topHeader.geometry.texCoordsPoints.right_bottom.y = 1;
 
    console.log("nidza component setup dimensions...", this.nidza);
    loadSystemSkeletal(App, world);
    // this.incraseNumOfDrawInstance();
    console.info("Anatomy is constructed.");
    console.info(
      "Mashine is constructed. after 2 secunds open gate start up animation."
    );
  };

  addRaycaster = () => {
    window.addEventListener("ray.hit.event", matrixEngineRaycastEvent => {
      console.log("details > ", matrixEngineRaycastEvent.detail.hitObject.name);
      var r = matrixEngineRaycastEvent.detail.hitObject.name;
      if(r == "spinBtn") {
        this.activateSpinning();
      } else if(r.indexOf("wheel") != -1) {
        this.fieldOnClick(matrixEngineRaycastEvent.detail.hitObject);
      }
    });

    canvas.addEventListener("mousedown", ev => {
      matrixEngine.raycaster.checkingProcedure(ev);
    });
  };

  changeGlBlend = (src, dest, rot) => {
    
    for (let key in App.scene) {
      if (App.scene[key].name.indexOf("skeletal_") !== -1) {

      // still must be called with method - SCALE for OBJ Mesh
      // App.scene[id].mesh.setScale(-0.01)
      // App.scene[key].glBlend.blendEnabled = true;
      // App.scene[id].position.y =  2;

      App.scene[key].rotation.rotx = rot.x;
      App.scene[key].rotation.roty = rot.y;
      App.scene[key].rotation.rotz = rot.z;

      //App.scene[key].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[src];
      //App.scene[key].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[dest];
    }
  }

  setInterval(function () {
    for (let key in App.scene) {
      if (App.scene[key].name.indexOf("skeletal_") !== -1) {
    App.scene.MyCubeTex.LightsData.ambientLight.r = oscilltor_variable.UPDATE();
    App.scene.MyCubeTex.LightsData.ambientLight.b = oscilltor_variable.UPDATE();
      }
    }

  }, 100);

  }

}
