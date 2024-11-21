/**
 * @description Matrix Engine Project
 * Template demostration of power.
 * @name MatrixSlot
 * @author Nikola Lukic
 * @license MIT
 * @link https://maximumroulette.com/apps/matrix-engine-starter/projects/hang3d/
 */
import * as matrixEngine from "matrix-engine";
import Mashines from "./scripts/mashine";
import {VoiceCommanderInstance} from "./scripts/voice-commander";

// Voice commander
// VoiceCommanderInstance.callback = VoiceCommanderInstance.whatisyourname;
// Activate listen operation
// VoiceCommanderInstance.run();

var world, mashine;
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
	App.slot = {};

	// Data about user.
	App.slot.user = {};

	/**
	 * @description Slot mashine can be configured from
	 * external (web server/ some other way)
	 */
	var fieldRed = {
		id: 1,
		color: {r: 1, g: 0.6, b: 0.6},
		textures: ["res/images/html5.png", "res/images/metal-shets.jpg"],
		myCamera: true,
		winCoefficient: 100,
		geo: 'cubeLightTex',
		scale: 0.9
	};

	var fieldBlue = {
		id: 2,
		color: {r: 0.7, g: 1, b: 2},
		textures: ["res/images/field.png", "res/images/metal-shets.jpg"],
		videoTex: false,
		winCoefficient: 25,
		geo: 'cubeLightTex',
		scale: 0.9
	};

	var fieldGreen = {
		id: 3,
		color: {r: 1, g: 2, b: 1},
		textures: ["res/images/metal-shets.jpg", "res/images/field3.webp"],
		videoTex: false,
		winCoefficient: 10,
		geo: 'cubeLightTex',
		scale: 0.8
	};

	var fieldPurple = {
		id: 4,
		color: {r: 1, g: 0.8, b: 1},
		textures: ["res/images/field3.webp", "res/images/html5.png"],
		videoTex: false,
		winCoefficient: 5,
		geo: 'cubeLightTex',
		scale: 0.9
	};

	var fieldLime = {
		id: 5,
		color: {r: 0.2, g: 1, b: 0.2},
		textures: ["res/images/html5.png", "res/images/field3.webp"],
		winCoefficient: 2,
		geo: 'cubeLightTex',
		scale: 0.9
	};

	var fieldEXTRA = {
		id: 5,
		color: {r: 0.2, g: 1, b: 0.2},
		textures: ["res/images/html5.png", "res/images/field3.webp"],
		videoTex: "res/video-texture/lava1.mkv",
		winCoefficient: 0,
		geo: 'cubeLightTex',
		scale: 0.9
	};

	var field2dSlot = {
		id: 5,
		color: {r: 0.2, g: 1, b: 0.2},
		textures: ["res/images/html5.png"],
		winCoefficient: 0,
		geo: 'cubeLightTex',
		scale: 0.9
	};

	App.slot.config = {
		// Count after all wheels spinning moment
		spinningInterval: 1000,
		stopingInterval: 1000,
		waitForNextSpin: 2000,
		verticalSize: 3,
		wheels: [
			[fieldEXTRA, fieldBlue, fieldLime, fieldLime, fieldPurple, fieldGreen, fieldPurple, fieldGreen, fieldLime],
			[fieldRed, fieldBlue, fieldPurple, fieldLime, fieldPurple, fieldGreen, fieldGreen, fieldLime, fieldLime],
			[field2dSlot, fieldPurple, fieldLime, fieldRed, fieldBlue, fieldPurple, fieldGreen, fieldLime, fieldLime, fieldPurple],
			[fieldGreen, fieldPurple, fieldRed, fieldLime, fieldPurple, fieldBlue, fieldGreen, fieldLime, fieldLime, fieldBlue],
			[fieldGreen, fieldPurple, fieldLime, fieldRed, fieldPurple, fieldGreen, fieldLime, fieldBlue, fieldLime, fieldLime],
			[fieldBlue, fieldLime, fieldPurple, fieldRed, fieldGreen, fieldLime, fieldPurple, fieldBlue, fieldGreen, fieldLime]
		],
		winnigLines: [
			[1, 1, 1, 1, 1, 1], // m                     1
			[0, 0, 0, 0, 0, 0], // t                     2
			[2, 2, 2, 2, 2, 2], // b                     3
			[1, 0, 1, 0, 1, 0], // cikcak up             4
			[1, 2, 1, 2, 1, 2], // cikcak down           5
			[0, 1, 0, 1, 0, 1], // cikcak up from 0      6
			[2, 1, 2, 1, 2, 1], // cikcak down from 2    7
			[0, 1, 2, 1, 0, 1], // cikcak big1           8
			[2, 1, 0, 1, 2, 1], // cikcak big2           9
			[1, 0, 1, 2, 1, 0], // big from 0 to up      10
			[1, 2, 1, 0, 1, 2], // big from 0 to down    11
			[1, 1, 1, 0, 0, 0], // 3 by 2                12
			[0, 0, 0, 1, 1, 1], // 3 by 2                13
			[1, 1, 1, 2, 2, 2], // 3 by 2                14
			[2, 2, 2, 1, 1, 1], // 3 by 2                15
			[2, 2, 2, 0, 0, 0], // 3 by 2                16
			[0, 0, 0, 2, 2, 2], // 3 by 2                17
		],
		matrixMessage: [
			' MATRIX ', ' ENGINE '
		]
	};

	mashine = new Mashines(world, App.slot.config);
	mashine.vc = VoiceCommanderInstance;
	App.slot.mashine = mashine;

}

window.addEventListener("load", () => {
	setTimeout(() => {
		matrixEngine.Engine.initApp(webGLStart);
	}, 200);
}, false);

// Not in use at the moment
export default App;