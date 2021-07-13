
/**
 * @description Matrix Engine Project
 * Template demostration of power.
 * @name Slot
 * @author Nikola Lukic
 * @license MIT
 */

import * as matrixEngine from "matrix-engine";
import Mashines from "./scripts/mashine";

var world, mashine;
var App = matrixEngine.App;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("worker.js");
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
  var fieldRed = { id: 1, desc: 'red'};
  var fieldBlue = { id: 2, desc: 'blue'};
  var fieldGreen = { id: 3, desc: 'green'};
  var fieldPurple = { id: 4, desc: 'purple'};
  var fieldLime = { id: 5, desc: 'lime'};

  App.slot.config = {
    wheels: [
      [fieldRed, fieldBlue, fieldPurple, fieldRed, fieldPurple, fieldGreen],
      [fieldRed, fieldGreen, fieldLime, fieldPurple, fieldGreen , fieldGreen],
      [fieldGreen, fieldPurple, fieldLime, fieldRed, fieldPurple, fieldGreen]
    ],

  };

  mashine = new Mashines(world);
  App.slot.mashine = mashine;

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
