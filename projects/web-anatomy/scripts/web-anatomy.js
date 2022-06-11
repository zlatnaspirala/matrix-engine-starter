import * as matrixEngine from "matrix-engine";
import {planeFont, planeUVFont} from "matrix-engine-plugins";
import {startSpin, stopSpin} from "./matrix-audio";
import { createNidzaHudBalance } from "./active-textures";
import {Nidza} from "nidza";
import {beep} from "./audio-gen";
import { loadSystemSkeletal } from "./systems/skeletal";

let OSC = matrixEngine.utility.OSCILLATOR;
let App = matrixEngine.App;
let isMobile = matrixEngine.utility.isMobile;

export default class WebAnatomy {
  constructor(world, config) {
    this.config = config;
    this.world = world;

    // Slot status general
    this.status = "free";

    // inject voice commander
    this.vc = {};

    this.nidza = new Nidza();
    // this.createNidzaTextureText = createNidzaTextureText;
    // this.createNidzaHudLinesInfo = createNidzaHudLinesInfo;
    this.createNidzaHudBalance = createNidzaHudBalance;

    this.addMashine(world);
    this.addRaycaster();

    
    window.addEventListener("mashine.free", (e)=> {
      console.info("MASHINE STATUS IS FREE");
      // App.slot.mashine.nidza.access.footerLabel.elements[0].text = "Mashine is ready for next spin...";
    });

    if (isMobile()) {
      if (window.innerWidth < window.innerHeight) {
        console.log("Mobile device detected with portrain orientation, best fit for this game is landscape.");
      }
    }

  }

 
  /**
   * @description
   * Add this to untility matrix engine
   */
  arrayRotate(arr, reverse) {
    if (reverse) arr.unshift(arr.pop());
    else arr.push(arr.shift());
    return arr;
  }

  findMax(arr) {
    var counts = {},
      max = 0,
      res;
    for (var v in arr) {
      counts[arr[v]] = (counts[arr[v]] || 0) + 1;
      if (counts[arr[v]] > max) {
        max = counts[arr[v]];
        res = arr[v];
      }
    }
    var results = [];
    for (var k in counts) {
      if (counts[k] == max) {
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
    for (name of argArray) {
      if (map.get(name) === undefined) {
        map.set(name, 1);
      } else {
        var count = map.get(name);
        count = count + 1;
        map.set(name, count);
        if (max < count) {
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

  addMashine = function (world) {
    var texTopHeader = {
      source: ["res/images/metal.jpg"],
      mix_operation: "multiply",
    };

    var texMenu = {
      source: ["res/images/metal-half.jpg"],
      mix_operation: "multiply",
    };

    if (isMobile()) {
 
    }

    world.Add("squareTex", 1, "topHeader", texTopHeader);
    App.scene.topHeader.geometry.setScaleByX(4);
    App.scene.topHeader.geometry.setScaleByY(2.9);
    App.scene.topHeader.position.SetY(5)
    App.scene.topHeader.position.z = -6.5;

    App.scene.topHeader.custom.gl_texture = function (object, t) {
      world.GL.gl.bindTexture(world.GL.gl.TEXTURE_2D, object.textures[t]);
      world.GL.gl.texParameteri(
        world.GL.gl.TEXTURE_2D,
        world.GL.gl.TEXTURE_MAG_FILTER,
        world.GL.gl.LINEAR
      );
      world.GL.gl.texParameteri(
        world.GL.gl.TEXTURE_2D,
        world.GL.gl.TEXTURE_MIN_FILTER,
        world.GL.gl.LINEAR
      );
      //  world.GL.gl.texParameteri(world.GL.gl.TEXTURE_2D, world.GL.gl.TEXTURE_WRAP_S, world.GL.gl.MIRRORED_REPEAT);
      //  world.GL.gl.texParameteri(world.GL.gl.TEXTURE_2D, world.GL.gl.TEXTURE_WRAP_T, world.GL.gl.MIRRORED_REPEAT);
      world.GL.gl.texParameteri(
        world.GL.gl.TEXTURE_2D,
        world.GL.gl.TEXTURE_WRAP_S,
        world.GL.gl.REPEAT
      );
      world.GL.gl.texParameteri(
        world.GL.gl.TEXTURE_2D,
        world.GL.gl.TEXTURE_WRAP_T,
        world.GL.gl.REPEAT
      );

      world.GL.gl.texImage2D(
        world.GL.gl.TEXTURE_2D,
        0,
        world.GL.gl.RGBA,
        world.GL.gl.RGBA,
        world.GL.gl.UNSIGNED_BYTE,
        object.textures[t].image
      );

      world.GL.gl.generateMipmap(world.GL.gl.TEXTURE_2D);
    };

    App.scene.topHeader.geometry.texCoordsPoints.right_top.y = -1;
    App.scene.topHeader.geometry.texCoordsPoints.right_top.x = 1;
    App.scene.topHeader.geometry.texCoordsPoints.left_bottom.x = -1;
    App.scene.topHeader.geometry.texCoordsPoints.left_bottom.y = 1;
    App.scene.topHeader.geometry.texCoordsPoints.left_top.x = -1;
    App.scene.topHeader.geometry.texCoordsPoints.left_top.y = -1;
    App.scene.topHeader.geometry.texCoordsPoints.right_bottom.x = 1;
    App.scene.topHeader.geometry.texCoordsPoints.right_bottom.y = 1;

    // Addin anything at all
    App.scene.topHeader.shake = false;

    var osc_var = new matrixEngine.utility.OSCILLATOR(-0.01, 0.01, 0.001);

    App.scene.topHeader.runShake = function () {
      if (this.shake == false) return;
      setTimeout(() => {
        this.geometry.texCoordsPoints.right_top.x += osc_var.UPDATE();
        this.geometry.texCoordsPoints.left_bottom.x += osc_var.UPDATE();
        this.geometry.texCoordsPoints.left_top.x += osc_var.UPDATE();
        this.geometry.texCoordsPoints.right_bottom.x += osc_var.UPDATE();
        this.runShake();
      }, 20);
    };


    world.Add("squareTex", 1, "footerHeader", texTopHeader);
    App.scene.footerHeader.geometry.setScaleByX(4);
    App.scene.footerHeader.geometry.setScaleByY(2.9);
    App.scene.footerHeader.position.SetY(-5);
    App.scene.footerHeader.position.z = -6.5;

    App.scene.footerHeader.geometry.texCoordsPoints.right_top.y = -1;
    App.scene.footerHeader.geometry.texCoordsPoints.right_top.x = 1;
    App.scene.footerHeader.geometry.texCoordsPoints.left_bottom.x = -1;
    App.scene.footerHeader.geometry.texCoordsPoints.left_bottom.y = 1;
    App.scene.footerHeader.geometry.texCoordsPoints.left_top.x = -1;
    App.scene.footerHeader.geometry.texCoordsPoints.left_top.y = -1;
    App.scene.footerHeader.geometry.texCoordsPoints.right_bottom.x = 1;
    App.scene.footerHeader.geometry.texCoordsPoints.right_bottom.y = 1;

    App.scene.footerHeader.custom.gl_texture = function (object, t) {
      world.GL.gl.bindTexture(world.GL.gl.TEXTURE_2D, object.textures[t]);
      world.GL.gl.texParameteri(
        world.GL.gl.TEXTURE_2D,
        world.GL.gl.TEXTURE_MAG_FILTER,
        world.GL.gl.LINEAR
      );
      world.GL.gl.texParameteri(
        world.GL.gl.TEXTURE_2D,
        world.GL.gl.TEXTURE_MIN_FILTER,
        world.GL.gl.LINEAR
      );
      //  world.GL.gl.texParameteri(world.GL.gl.TEXTURE_2D, world.GL.gl.TEXTURE_WRAP_S, world.GL.gl.MIRRORED_REPEAT);
      //  world.GL.gl.texParameteri(world.GL.gl.TEXTURE_2D, world.GL.gl.TEXTURE_WRAP_T, world.GL.gl.MIRRORED_REPEAT);
      world.GL.gl.texParameteri(
        world.GL.gl.TEXTURE_2D,
        world.GL.gl.TEXTURE_WRAP_S,
        world.GL.gl.REPEAT
      );
      world.GL.gl.texParameteri(
        world.GL.gl.TEXTURE_2D,
        world.GL.gl.TEXTURE_WRAP_T,
        world.GL.gl.REPEAT
      );

      world.GL.gl.texImage2D(
        world.GL.gl.TEXTURE_2D,
        0,
        world.GL.gl.RGBA,
        world.GL.gl.RGBA,
        world.GL.gl.UNSIGNED_BYTE,
        object.textures[t].image
      );

      world.GL.gl.generateMipmap(world.GL.gl.TEXTURE_2D);
    };

    // Adapt active textures because it is inverted by nature.
    App.scene.footerHeader.rotation.rotx = 180;

    // Footer active lines
    world.Add("squareTex", 1, "footerLines", texMenu);
    App.scene.footerLines.geometry.setScaleByX(1);
    App.scene.footerLines.geometry.setScaleByY(0.3);
    App.scene.footerLines.position.SetY(0);
    App.scene.footerLines.position.SetZ(-6.4);
    App.scene.footerLines.position.SetX(-2.55);
    // Adapt active textures because it is inverted by nature.
    // App.scene.footerLines.rotation.rotx = 180;
    App.scene.footerLines.rotation.rotz = 0;
    App.scene.footerLines.rotation.rotx = 0;
    App.scene.footerLines.rotation.roty = 0;

    // Footer balance
    world.Add("squareTex", 1, "footerBalance", texTopHeader);
    App.scene.footerBalance.geometry.setScaleByX(1.15);
    App.scene.footerBalance.geometry.setScaleByY(0.23);
    App.scene.footerBalance.position.SetY(2);
    App.scene.footerBalance.position.SetZ(-6.4);
    App.scene.footerBalance.position.SetX(1);
    // Adapt active textures because it is inverted by nature.
    App.scene.footerBalance.rotation.rotx = 180;
    this.createNidzaHudBalance(this.nidza).then(streamTex => {
      App.scene.footerBalance.streamTextures = {
        videoImage: streamTex,
      };
    });

    console.log("nidza component setup dimensions...", this.nidza);

    if (isMobile()) App.operation.squareTex_buffer_procedure(App.scene.overlayout);

    App.operation.squareTex_buffer_procedure(App.scene.topHeader);

    loadSystemSkeletal(App, world);

    // this.incraseNumOfDrawInstance();
    console.info("Mashine is constructed.");
    console.info(
      "Mashine is constructed. after 2 secunds open gate start up animation."
    );
    setTimeout(() => {

    }, 2500);
  };

  addRaycaster = () => {
    window.addEventListener("ray.hit.event", matrixEngineRaycastEvent => {
      console.log("details > ", matrixEngineRaycastEvent.detail.hitObject.name);
      var r = matrixEngineRaycastEvent.detail.hitObject.name;
      if (r == "spinBtn") {
        this.activateSpinning();
      } else if (r.indexOf("wheel") != -1) {
        this.fieldOnClick(matrixEngineRaycastEvent.detail.hitObject);
      }
    });

    canvas.addEventListener("mousedown", ev => {
      matrixEngine.raycaster.checkingProcedure(ev);
    });
  };

}
