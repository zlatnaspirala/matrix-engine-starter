
/**
 * @description Matrix Engine Project
 * Template demostration of power.
 * @name MatrixSlot
 * @author Nikola Lukic
 * @license MIT
 */

// dev
// import matrixEngine from "./../../node_modules/matrix-engine/index.js";
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
    navigator.serviceWorker.register("/projects/matrix-slot/worker.js");
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
  var fieldRed = {
    id: 1,
    color: {r: 1, g: 0.6, b: 0.6},
    textures: ["res/images/html5.png", "res/images/metal-shets.jpg"],
    winCoefficient: 100,
  };

  var fieldBlue = {
    id: 2,
    color: {r: 0.7, g: 1, b: 2},
    textures: ["res/images/field.png", "res/images/metal-shets.jpg"],
    winCoefficient: 25
  };

  var fieldGreen = {
    id: 3,
    color: {r: 1, g: 2, b: 1},
    textures: ["res/images/metal-shets.jpg", "res/images/field3.png"],
    winCoefficient: 10
  };

  var fieldPurple = {
    id: 4,
    color: {r: 1, g: 0.8, b: 1},
    textures: ["res/images/field3.png", "res/images/html5.png"],
    winCoefficient: 5
  };

  var fieldLime = {
    id: 5,
    color: {r: 0.2, g: 1, b: 0.2},
    textures: ["res/images/html5.png", "res/images/field3.png"],
    winCoefficient: 2
  };

  App.slot.config = {
    // Count after all wheels spinning moment
    spinningInterval : 1000,
    stopingInterval: 1000,
    waitForNextSpin: 2000,
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
      [1, 1, 1, 1, 1, 1], // m                     1
      [0, 0, 0, 0, 0, 0], // t                     2
      [2, 2, 2, 2, 2, 2], // b                     3
      [1, 0, 1, 0, 1, 0], // cikcak up             4
      [1, 2, 1, 2, 1, 2], // cikcak down           5
      [0, 1, 0, 1, 0, 1], // cikcak up from 0      6
      [2, 1, 2, 1, 2, 1], // cikcak down from 2    7
      [0, 1, 2, 1, 0, 1], // cikcak big1           8
      [2, 1, 0, 1, 2, 1], // cikcak big2           9
      [1, 0, 1, 2, 1, 0], // big from 0 to up      10
      [1, 2, 1, 0, 1, 2], // big from 0 to down    11
      [1, 1, 1, 0, 0, 0], // 3 by 2                12
      [0, 0, 0, 1, 1, 1], // 3 by 2                13
      [1, 1, 1, 2, 2, 2], // 3 by 2                14
      [2, 2, 2, 1, 1, 1], // 3 by 2                15
      [2, 2, 2, 0, 0, 0], // 3 by 2                16
      [0, 0, 0, 2, 2, 2], // 3 by 2                17
    ],
    matrixMessage: [
      'S', 'l', 'o', 't', 'M', 'a', 's', 'h', 'i', 'n', 'e'
    ]
  };

  mashine = new Mashines(world, App.slot.config);
  mashine.vc = VoiceCommanderInstance;
  App.slot.mashine = mashine;

  window.App = App;
  window.world = world;
  window.matrixEngine = matrixEngine;
}

matrixEngine.Engine.load_shaders("shaders/shaders.html");

window.addEventListener("load", () => {
  setTimeout(() => {
    matrixEngine.Engine.initApp(webGLStart);
  }, 200);
}, false);

// Not in use
export default App;
