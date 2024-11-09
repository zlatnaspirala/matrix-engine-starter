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

var world;
var App = matrixEngine.App;
window.matrixEngine = matrixEngine;

// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", function() {
//     // navigator.serviceWorker.register("worker.js");
//     // navigator.serviceWorker.register("./hacker-timer/hack-timer.js");
//   });
// }
 
matrixEngine.utility.scriptManager.LOAD("./hacker-timer/hack-timer.js")

function webGLStart() {
	window.App = matrixEngine.App;
	window.matrixEngine = matrixEngine;
  world = matrixEngine.matrixWorld.defineworld(canvas);
  world.callReDraw();
  let roulette = new MatrixRoulette()
  // DEV ONLY
  window.roulette = roulette;
}

window.addEventListener("load", () => {
	setTimeout(() => matrixEngine.Engine.initApp(webGLStart) , 100)
}, false);

export default App;