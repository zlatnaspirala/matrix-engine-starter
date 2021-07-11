import * as matrixEngine from "../../node_modules/matrix-engine/index";
import Mashines from "./scripts/mashine";

var world, mashine;
var App = matrixEngine.App;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("worker.js");
  });
} else {
  console.warn("Matrix Engine: No support for web workers in this browser.");
}

function webGLStart() {
  world = matrixEngine.matrixWorld.defineworld(canvas);
  world.callReDraw();

  // Type here
  mashine = new Mashines(world);

  window.App = App;
  window.world = world;
}

matrixEngine.Engine.load_shaders("shaders/shaders.html");
// window.matrixEngine = matrixEngine;

window.addEventListener("load", () => {
  matrixEngine.Engine.initApp(webGLStart);
}, false);

// Not in use
export default App;
