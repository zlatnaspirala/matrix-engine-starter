/**
 * @description Matrix Engine Project
 * Template demostration of power.
 * @name MatrixSlot
 * @author Nikola Lukic
 * @license MIT
 * @link https://maximumroulette.com/apps/matrix-engine-starter/projects/hang3d/
 */
import * as matrixEngine from "matrix-engine";
import MatrixVideoEditor from "./scripts/video-editor";
// import {VoiceCommanderInstance} from "./scripts/voice-commander";
// Voice commander
// VoiceCommanderInstance.callback = VoiceCommanderInstance.whatisyourname;
// Activate listen operation
// VoiceCommanderInstance.run();

var world;
var App = matrixEngine.App;

if("serviceWorker" in navigator) {
	window.addEventListener("load", function() {
		// navigator.serviceWorker.register("worker.js");
	});
}

function webGLStart() {

	window.App = App;
	window.world = world;
	window.matrixEngine = matrixEngine;

	world = matrixEngine.matrixWorld.defineworld(canvas);
	world.callReDraw();

	/**
	 * @description Use global object App 
	 * App object no need to be in global scope `window.App`
	 * It is our application global object and it is good 
	 * to put all of high level code in App object.
	 * Use pattern App.<name-of-project> = { ... }
	 */
	// mashine.vc = VoiceCommanderInstance;
	 let myVideoEditor = new MatrixVideoEditor(world, {})
	 window.myVideoEditor = myVideoEditor;
}

window.addEventListener("load", () => {
	setTimeout(() => {
		matrixEngine.Engine.initApp(webGLStart);
		console.log('pwa btns', pwaBtns)
	}, 200);
	var pwaBtns = document.querySelector(".button2")
	pwaBtns.click()
}, false);

export default App;