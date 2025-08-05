/**
 * @description Matrix Engine Project Starter
 * Template demostration of matrix-engine power.
 * @name MatrixAnatomyBody
 * @author Nikola Lukic
 * @license GPL-V3
 */
import * as matrixEngine from "matrix-engine";
import WebAnatomy from "./scripts/web-anatomy";

navigator.serviceWorker.register("./hacker-timer/hack-timer.js");

// import { VoiceCommanderInstance } from "./scripts/voice-commander";

// // Voice commander
// VoiceCommanderInstance.callback = VoiceCommanderInstance.whatisyourname;
// // Activate listen operation
// VoiceCommanderInstance.run();

var world;
window.world = world;
window.matrixEngine = matrixEngine;

function webGLStart() {

	window.App = matrixEngine.App;
	window.matrixEngine = matrixEngine;

	App.webAnatomy = {};

	App.config = {
	};


	// from 1.9.12 => simply render draw funct without FBO
	// world = matrixEngine.matrixWorld.defineworld(canvas, 'simply');
	world = matrixEngine.matrixWorld.defineworld(canvas, 'simply');

	world.callReDraw();

	App.webAnatomy = new WebAnatomy(world, App.config);

  matrixEngine.raycaster.touchCoordinate.stopOnFirstDetectedHit = true;
  
}

window.addEventListener("load", () => {
	if("serviceWorker" in navigator) {
		navigator.serviceWorker.register("worker.js");
	}
	setTimeout(() => {
		matrixEngine.Engine.initApp(webGLStart);
	}, 200);
}, false);

// Not in use
// export default App;
