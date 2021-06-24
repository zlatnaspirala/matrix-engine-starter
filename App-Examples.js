
import * as matrixEngine from "matrix-engine";

/**
 * @description
 * Little help func.
 */
const QueryString = matrixEngine.UTILITY.QueryString;
const scriptManager = matrixEngine.UTILITY.scriptManager;

var world;
var App = matrixEngine.App;

function webGLStart() {
  world = matrixEngine.matrixWorld.defineworld(canvas);

  if (world) {
    world.callReDraw();
    if (typeof QueryString.u != "undefined") {
      scriptManager.loadModule("examples/" + QueryString.u + ".js");
    } else {
      scriptManager.loadModule("examples/adding_color_cube.js");
    }
  } else {
    console.error(
      " Canvas has not been initialized, contact your programmer... "
    );
  }

  world.callReDraw();

  window.App = App;
}

window.Start = function () {
  if (localStorage.getItem("_check_the_engine_") == null) {
    console.error(" FIRST TIME ");
    localStorage.setItem("_check_the_engine_", "runned");
  } else {
    // return;
  }

  matrixEngine.Engine.drawFPS();
  webGLStart();
};

matrixEngine.Engine.load_shaders("shaders/shaders.html");

window.matrixEngine = matrixEngine;

setTimeout(() => {
  matrixEngine.Engine.initApp();
}, 2000);

var App = matrixEngine.App;

export default App;
