
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

// Voice commander
VoiceCommanderInstance.callback = VoiceCommanderInstance.whatisyourname;
// Activate listen operation
VoiceCommanderInstance.run();

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

  // Data about user.
  App.slot.user = {};

  /**
   * @description Slot mashine can be configured from
   * external (web server/ some other way)
   */
  var fieldRed    = { id: 1, color: {r: 2,   g: 0 , b: 0.1}, winCoefficient: 100 };
  var fieldBlue   = { id: 2, color: {r: 0.7, g: 1 , b: 22 }, winCoefficient: 25 };
  var fieldGreen  = { id: 3, color: {r: 0.2, g: 1 , b: 0.2  }, winCoefficient: 10 };
  var fieldPurple = { id: 4, color: {r: 1,   g: 0.2, b: 0  }, winCoefficient: 5 };
  var fieldLime   = { id: 5, color: {r: 0.5, g: 2 , b: 0.2  }, winCoefficient: 2 };

  App.slot.config = {
    // Count after all wheels spinning moment
    spinningInterval : 1000,
    stopingInterval: 1000,
    waitForNextSpin: 10000,
    verticalSize: 3,
    wheels: [
      [fieldRed, fieldBlue, fieldLime,  fieldLime, fieldPurple, fieldGreen, fieldPurple, fieldGreen, fieldLime, fieldLime],
      [fieldRed, fieldBlue, fieldPurple, fieldLime, fieldPurple, fieldGreen , fieldGreen, fieldLime, fieldLime, fieldPurple],
      [fieldGreen, fieldPurple,fieldLime,  fieldRed, fieldBlue, fieldPurple, fieldGreen, fieldLime, fieldLime, fieldPurple],
      [fieldGreen, fieldPurple, fieldRed, fieldLime, fieldPurple, fieldBlue,  fieldGreen, fieldLime, fieldLime, fieldBlue, fieldPurple],
      [fieldGreen, fieldPurple,fieldLime, fieldRed, fieldPurple, fieldGreen, fieldLime, fieldBlue, fieldLime, fieldLime, fieldBlue, fieldPurple],
      [fieldBlue, fieldLime, fieldPurple, fieldRed, fieldGreen,fieldLime, fieldPurple, fieldBlue, fieldGreen, fieldLime, fieldLime, fieldPurple]
    ],
    winnigLines: [
      [1, 1, 1, 1, 1, 1], // m
      [0, 0, 0, 0, 0, 0], // t
      [2, 2, 2, 2, 2, 2],  // b
      [1, 0, 1, 0, 1, 0]  // cikcak up
    ],
    matrixMessage: [
      'S', 'l', 'o', 't', 'M', 'a', 's', 'h', 'i', 'n', 'e'
    ]
  };

  mashine = new Mashines(world, App.slot.config);
  mashine.vc = VoiceCommanderInstance;
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
