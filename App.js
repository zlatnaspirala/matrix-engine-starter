import * as matrixEngine from "./node_modules/matrix-engine/index.js";

var world;
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

  world.Add("cube", 1, "MyColoredCube1");
  world.Add("triangle", 1, "MyColoredCube3");
  world.Add("pyramid", 1, "MyColoredCube2");

  // SET POSITION
  App.scene.MyColoredCube1.position.SetX(0);
  App.scene.MyColoredCube2.position.SetX(-2.5);
  App.scene.MyColoredCube3.position.SetX(2.5);

  App.scene.MyColoredCube1.rotation.rotationSpeed.x = 15;
  App.scene.MyColoredCube2.rotation.rotationSpeed.y = 15;
  App.scene.MyColoredCube3.rotation.rotationSpeed.z = 15;

  window.App = App;
}

window.Start = function () {
  matrixEngine.Engine.drawFPS();
  webGLStart();
};

matrixEngine.Engine.load_shaders("shaders/shaders.html");
window.matrixEngine = matrixEngine;

window.addEventListener("load", () => {
  matrixEngine.Engine.initApp();
}, false);

var App = matrixEngine.App;
export default App;
