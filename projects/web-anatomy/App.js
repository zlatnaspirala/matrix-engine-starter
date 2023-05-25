/**
 * @description Matrix Engine Project Starter
 * Template demostration of matrix-engine power.
 * @name MatrixAnatomyBody
 * @author Nikola Lukic
 * @license GPL-V3
 */

import * as matrixEngine from "matrix-engine";
import WebAnatomy from "./scripts/web-anatomy";
import { VoiceCommanderInstance } from "./scripts/voice-commander";

// Voice commander
VoiceCommanderInstance.callback = VoiceCommanderInstance.whatisyourname;
// Activate listen operation
VoiceCommanderInstance.run();

var world, mashine;
var App = matrixEngine.App;

App.webAnatomy = {};

App.config = {
};

function webGLStart() {
  world = matrixEngine.matrixWorld.defineworld(canvas);
  world.callReDraw();
  App.webAnatomy = new WebAnatomy(world, App.config);
  window.App = App;
  window.world = world;
  window.matrixEngine = matrixEngine;
}

window.addEventListener("load", () => {

  if ("serviceWorker" in navigator) {
    // navigator.serviceWorker.register("worker.js");
  }

  setTimeout(() => {
    matrixEngine.Engine.initApp(webGLStart);
  }, 200);
}, false);

// Not in use
export default App;
