
/**
 * @description Matrix Engine Project
 * Template demostration of power.
 * @name MatrixSlot
 * @author Nikola Lukic
 * @license GPL-V3
 */

// dev
// import matrixEngine from "/node_modules/matrix-engine/index.js";
// prod
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
  loadingMessage: ["W","e","b","_" ,"A", "n", "a","t","o","m","y"]
};

function webGLStart() {
  world = matrixEngine.matrixWorld.defineworld(canvas);
  world.callReDraw();
  App.webAnatomy = new WebAnatomy(world, App.config);
  window.App = App;
  window.world = world;
  window.matrixEngine = matrixEngine;
}

matrixEngine.Engine.load_shaders("shaders/shaders.html");

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
