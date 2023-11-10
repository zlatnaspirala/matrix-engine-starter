/**
 * @description Matrix Engine Project
 * Template demostration of power.
 * @name MatrixSlot
 * @author Nikola Lukic
 * @license GPL-v3
 */
import * as matrixEngine from "matrix-engine";
import { MatrixRoulette } from "./scripts/roulette";
// import { VoiceCommanderInstance } from "./scripts/voice-commander";
// Voice commander
// VoiceCommanderInstance.callback = VoiceCommanderInstance.whatisyourname;
// Activate listen operation
// VoiceCommanderInstance.run();

matrixEngine.App.offScreenCanvas = false;


var world;
var App = matrixEngine.App;
window.matrixEngine = matrixEngine;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    // navigator.serviceWorker.register("worker.js");
  });
}

function webGLStart() {

  world = matrixEngine.matrixWorld.defineworld(canvas);
  world.callReDraw();
  let roulette = new MatrixRoulette()
  // DEV ONLY
  window.App = App;
  window.roulette = roulette;
}

window.addEventListener("load", () => {
  setTimeout(() => {
    matrixEngine.Engine.initApp(webGLStart);
  }, 200);
}, false);

export default App;