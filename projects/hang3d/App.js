/**
 * @description Matrix Engine Project
 * Template demostration of power.
 * @name Hang3d FPS MatrixReborn
 * @author Nikola Lukic
 * @license GPL-v3
 */
import * as matrixEngine from "matrix-engine";
import {runHang3d} from "./scripts/fps_player_controller";

matrixEngine.utility.scriptManager.LOAD("./hacker-timer/hack-timer.js")

var world;
window.App = matrixEngine.App;
window.matrixEngine = matrixEngine;
// navigator.serviceWorker.register("worker.js");
// navigator.serviceWorker.register("./hacker-timer/hack-timer.js");
function webGLStart() {
	world = matrixEngine.matrixWorld.defineworld(canvas);
	world.callReDraw();
	runHang3d(world);
	// DEV ONLY
	window.App = App;
}

window.addEventListener("load", () => {
	setTimeout(() => matrixEngine.Engine.initApp(webGLStart) , 100)
}, false);

export default App;