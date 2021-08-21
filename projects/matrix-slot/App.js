
/**
 * @description Matrix Engine Project
 * Template demostration of power.
 * @name Slot
 * @author Nikola Lukic
 * @license MIT
 */

// dev
// import matrixEngine from "/node_modules/matrix-engine/index.js";
// prod
import * as matrixEngine from "matrix-engine";
import Mashines from "./scripts/mashine";
import { VoiceCommanderInstance } from "./scripts/voice-commander";

// If you want make it global
window.vc = VoiceCommanderInstance;

// Activate listen operation
VoiceCommanderInstance.run()

var world, mashine;
var App = matrixEngine.App;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    // navigator.serviceWorker.register("worker.js");
  });
}

function webGLStart() {
  world = matrixEngine.matrixWorld.defineworld(canvas);
  world.callReDraw();

  /**
   * @description Use global object App 
   * App object no need to be in global scope `window.App`
   * It is our application global object and it is good 
   * to put all of high level code in App object.
   * Use pattern App.<name-of-project> = { ... }
   */
  App.slot = {};

  /**
   * @description Slot mashine can be configured from
   * external (web server/ some other way)
   */
  var fieldRed = { id: 1, color: {r: 2, g: 0 , b: 0.1}};
  var fieldBlue = { id: 2, color: {r: 0.7, g: 1 , b: 22}};
  var fieldGreen = { id: 3, color: {r: 1, g: 1.1 , b: 1}};
  var fieldPurple = { id: 4, color: {r: 1, g: 0 , b: 1}};
  var fieldLime = { id: 5, color: {r: 1, g: 0.2 , b: 0}};

  App.slot.config = {
    // Count after all wheels spinning moment
    spinningInterval : 1000,
    stopingInterval: 1000,
    verticalSize: 3,
    wheels: [
      [fieldRed, fieldBlue, fieldLime,  fieldLime, fieldPurple, fieldRed, fieldGreen, fieldPurple, fieldGreen, fieldLime, fieldLime],
      [fieldRed, fieldBlue, fieldPurple, fieldPurple, fieldGreen , fieldGreen, fieldLime, fieldLime],
      [fieldRed, fieldGreen, fieldPurple, fieldRed, fieldPurple, fieldGreen, fieldLime, fieldLime],
      [fieldRed, fieldGreen, fieldPurple, fieldRed, fieldPurple, fieldGreen, fieldLime, fieldLime],
      [fieldRed, fieldGreen, fieldPurple, fieldRed, fieldPurple, fieldGreen, fieldLime, fieldLime],
      [fieldRed, fieldBlue, fieldPurple, fieldRed, fieldGreen, fieldPurple, fieldGreen, fieldLime, fieldLime]
    ],
    winnigLines: [
      [1,1,1,1,1,1],
      // [0,0,0,0,0,0],
      // [2,2,2,2,2,2]
    ]
  };

  mashine = new Mashines(world, App.slot.config);
  App.slot.mashine = mashine;

  var textuteImageSamplers = {
    source: [
      "res/images/gradiend1.png"
    ],
    mix_operation: "multiply",
  };

  world.Add("cubeTex", 1, "MyCubeTex", textuteImageSamplers);

  window.App = App;
  window.world = world;
  window.matrixEngine = matrixEngine;
}

matrixEngine.Engine.load_shaders("shaders/shaders.html");
// window.matrixEngine = matrixEngine;

window.addEventListener("load", () => {
  setTimeout(() => {
    matrixEngine.Engine.initApp(webGLStart);
  }, 200);
}, false);

// Not in use
export default App;
