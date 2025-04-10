import * as matrixEngine from "matrix-engine";
// import {planeFont, planeUVFont} from "matrix-engine-plugins";
// import {startSpin, stopSpin} from "./matrix-audio";
import {
	createNidzaTextureText,
	createNidzaHudLinesInfo,
	createNidzaHudLine1,
	createNidzaHudBalance,
	showActiveLinesByIndex,
	footerLinesInfo,
	incActiveLines
} from "./active-textures";
import RC from "record-canvas";
import {Nidza} from "nidza";
// import {beep} from "./audio-gen";
import {byId} from "matrix-engine/lib/utility";
import {SceneAnimator} from "./scene-animation";

let OSC = matrixEngine.utility.OSCILLATOR;
let App = matrixEngine.App;
let isMobile = matrixEngine.utility.isMobile;
let VT = matrixEngine.Engine.VT;

export default class MatrixVideoEditor {
	constructor(world, config) {
		this.config = config;
		this.world = world;
		// Slot status general
		this.status = "free";
		// inject voice commander
		this.vc = {};
		this.options = {
			// injectCanvas: injectCanvas,
			injectCanvas: document.getElementsByTagName("canvas")[0],
			frameRequestRate: 30,
			videoDuration: (matrixEngine.utility.QueryString.duration ? matrixEngine.utility.QueryString.duration : 10),
			outputFilename: (matrixEngine.utility.QueryString.output ? matrixEngine.utility.QueryString.output : "record-canvas.mp4"),
			mineType: "video/mp4",
			resolutions: (matrixEngine.utility.QueryString.resolution ? matrixEngine.utility.QueryString.resolution : '800x600')
		};
		this.createNidzaHudBalance = createNidzaHudBalance;
		this.nidza = new Nidza();
		this.createNidzaTextureText = createNidzaTextureText;
		this.createNidzaHudLinesInfo = createNidzaHudLinesInfo;
		this.createNidzaHudLine1 = createNidzaHudLine1;

		byId('fps').style.display = 'none'
		byId('debugBox').style.display = 'none'
		//
		

		this.addMashine(world)

		this.addRaycaster();

		window.addEventListener("mve.free", (e) => {
			// console.info("MASHINE STATUS IS FREE");
			// App.slot.mashine.nidza.access.footerLabel.elements[0].text = "Mashine is ready for next spin...";
		});
	}

	addMashine = function(world) {
		var texTopHeader = {
			source: ["res/icons/512.webp"],
			mix_operation: "multiply",
		};
		var texOverlayout = {
			source: ["res/icons/pleaserotate.png"],
			mix_operation: "multiply",
		};

		// This must be part of engine
		const displayOrientation = () => {
			const screenOrientation = screen.orientation.type;
			console.log(`The orientation of the screen is: ${screenOrientation}`);
			if(screenOrientation === "landscape-primary") {
				console.log("That looks good.");
				// Alternative App.scene.overlayout.visible = false;
				location.reload()
			} else if(screenOrientation === "landscape-secondary") {
				console.log("Mmmh... the screen is upside down!");
			} else if(screenOrientation === "portrait-secondary" || screenOrientation === "portrait-primary") {
				console.log("Mmmh... you should rotate your device to landscape");
				location.reload() // Pragmatic for now...
			} else if(screenOrientation === undefined) {
				console.log("The orientation API isn't supported in this browser :(");
			}
		};

		if(screen && screen.orientation !== null) {
			try {
				window.screen.orientation.onchange = displayOrientation;
				// displayOrientation();
			}
			catch(e) {}
		}

		if(isMobile() && window.innerWidth < window.innerHeight) {
			console.log("Mobile device detected with portrain orientation, best fit for this game is landscape.");
			world.Add("squareTex", 1, "overlayout", texOverlayout);
			App.scene.overlayout.geometry.setScaleByX(1);
			App.scene.overlayout.geometry.setScaleByY(2.2);
			App.scene.overlayout.position.y = 0;
			App.scene.overlayout.position.z = -5;
			// Adapt active textures because it is inverted by nature.
			App.scene.overlayout.rotation.rotx = 0;
		}

		world.Add("squareTex", 1, "topHeader", texTopHeader);
		App.scene.topHeader.geometry.setScaleByX(2);
		App.scene.topHeader.geometry.setScaleByY(2);
		App.scene.topHeader.position.y = 1;
		App.scene.topHeader.position.z = -10;
		App.scene.topHeader.glBlend.blendEnabled = true;

		App.scene.topHeader.streamTextures = new matrixEngine.Engine.VT(
			"res/videos/test.mp4"
		);

		// App.scene.topHeader.custom.gl_texture = function(object, t) {
		// 	world.GL.gl.bindTexture(world.GL.gl.TEXTURE_2D, object.textures[t]);
		// 	world.GL.gl.texParameteri(
		// 		world.GL.gl.TEXTURE_2D,
		// 		world.GL.gl.TEXTURE_MAG_FILTER,
		// 		world.GL.gl.LINEAR
		// 	);
		// 	world.GL.gl.texParameteri(
		// 		world.GL.gl.TEXTURE_2D,
		// 		world.GL.gl.TEXTURE_MIN_FILTER,
		// 		world.GL.gl.LINEAR
		// 	);
		// 	//  world.GL.gl.texParameteri(world.GL.gl.TEXTURE_2D, world.GL.gl.TEXTURE_WRAP_S, world.GL.gl.MIRRORED_REPEAT);
		// 	//  world.GL.gl.texParameteri(world.GL.gl.TEXTURE_2D, world.GL.gl.TEXTURE_WRAP_T, world.GL.gl.MIRRORED_REPEAT);
		// 	world.GL.gl.texParameteri(
		// 		world.GL.gl.TEXTURE_2D,
		// 		world.GL.gl.TEXTURE_WRAP_S,
		// 		world.GL.gl.REPEAT
		// 	);
		// 	world.GL.gl.texParameteri(
		// 		world.GL.gl.TEXTURE_2D,
		// 		world.GL.gl.TEXTURE_WRAP_T,
		// 		world.GL.gl.REPEAT
		// 	);

		// 	world.GL.gl.texImage2D(
		// 		world.GL.gl.TEXTURE_2D,
		// 		0,
		// 		world.GL.gl.RGBA,
		// 		world.GL.gl.RGBA,
		// 		world.GL.gl.UNSIGNED_BYTE,
		// 		object.textures[t].image
		// 	);

		// 	world.GL.gl.generateMipmap(world.GL.gl.TEXTURE_2D);
		// };

		// var coefic = 2;
		// App.scene.topHeader.geometry.texCoordsPoints.right_top.y = -coefic;
		// App.scene.topHeader.geometry.texCoordsPoints.right_top.x = coefic;
		// App.scene.topHeader.geometry.texCoordsPoints.left_bottom.x = -coefic;
		// App.scene.topHeader.geometry.texCoordsPoints.left_bottom.y = coefic;
		// App.scene.topHeader.geometry.texCoordsPoints.left_top.x = -coefic;
		// App.scene.topHeader.geometry.texCoordsPoints.left_top.y = -coefic;
		// App.scene.topHeader.geometry.texCoordsPoints.right_bottom.x = coefic;
		// App.scene.topHeader.geometry.texCoordsPoints.right_bottom.y = coefic;

		// Addin anything at all
		App.scene.topHeader.shake = false;
		var osc_var = new matrixEngine.utility.OSCILLATOR(-0.01, 0.01, 0.001);

		App.scene.topHeader.runShake = function() {
			if(this.shake == false) return;
			setTimeout(() => {
				this.geometry.texCoordsPoints.right_top.x += osc_var.UPDATE();
				this.geometry.texCoordsPoints.left_bottom.x += osc_var.UPDATE();
				this.geometry.texCoordsPoints.left_top.x += osc_var.UPDATE();
				this.geometry.texCoordsPoints.right_bottom.x += osc_var.UPDATE();
				this.runShake();
			}, 20);
		};



		world.Add("cubeLightTex", 1, "recordBtn", texTopHeader);
		App.scene.recordBtn.geometry.setScaleByX(-0.2);
		App.scene.recordBtn.geometry.setScaleByY(-0.7);
		App.scene.recordBtn.position.y = -2.56;
		App.scene.recordBtn.position.z = -10;
		App.scene.recordBtn.rotation.roty = -90
		App.scene.recordBtn.rotation.rotx = 90
		// Adapt active textures because it is inverted by nature.
		// App.scene.recordBtn.rotation.rotx = -180;
		this.createNidzaTextureText(this.nidza).then(what => {
			// console.log('TEST createNidzaTextureText', what)
			App.scene.recordBtn.streamTextures = {
				videoImage: what,
			};
		});

		// Footer active lines
		world.Add("squareTex", 1, "footerLines", texTopHeader);
		App.scene.footerLines.geometry.setScaleByX(2);
		App.scene.footerLines.geometry.setScaleByY(2);
		App.scene.footerLines.position.SetY(1);
		App.scene.footerLines.position.SetZ(-6);
		App.scene.footerLines.position.SetX(-4);
		// Adapt active textures because it is inverted by nature.
		// App.scene.footerLines.rotation.rotx = 180;
		App.scene.footerLines.rotation.rotz = 0;
		App.scene.footerLines.rotation.rotx = 0;
		App.scene.footerLines.rotation.roty = 0;
		App.scene.footerLines.streamTextures = new matrixEngine.Engine.VT(
			"res/videos/lava1.mkv", "lava1", {mixWithCanvas2d: true}
		);

		App.scene.footerLines.streamTextures.UPDATE = function () {
			var ROOT = this;
			if (ROOT.options.mixWithCanvas2d == false) return;
	
			if (ROOT.video.readyState === ROOT.video.HAVE_ENOUGH_DATA) {
				ROOT.videoImageContext.drawImage(ROOT.video, 0, 0, ROOT.videoImage.width, ROOT.videoImage.height);
				ROOT.videoImageContext.font = '60px Georgia';
				ROOT.videoImageContext.fillStyle = 'black';
				ROOT.videoImageContext.fillText(' MATRIX VIDEO EDITOR  ', 10 , 125);
				ROOT.videoImageContext.fillText(' HTML5 FOR EVER', 20, 50);
			}
		};

		App.scene.topHeader.streamTextures =  {video: document.getElementsByTagName('video')[2]}
		// App.scene.footerLines.streamTextures = {video: document.getElementsByTagName('video')[1]}

		world.Add("squareTex", 1, "title1", texTopHeader);
		App.scene.title1.geometry.setScaleByX(2);
		App.scene.title1.geometry.setScaleByY(2);
		App.scene.title1.position.SetY(1);
		App.scene.title1.position.SetZ(-6);
		App.scene.title1.position.SetX(4);
		this.createNidzaHudLinesInfo(this.nidza).then(r => {
			var localCtx = r.texCanvas.getContext("2d");
			localCtx.scale(1, -1);
			localCtx.translate(0, -r.texCanvas.height);
			footerLinesInfo.elements[0].position.translateX(25.3);
			App.scene.title1.streamTextures = {videoImage: r.texCanvas};
		});

		// Footer balance
		// world.Add("squareTex", 1, "footerBalance", texTopHeader);
		// App.scene.footerBalance.geometry.setScaleByX(1.15);
		// App.scene.footerBalance.geometry.setScaleByY(0.23);
		// App.scene.footerBalance.position.SetY(-2.55);
		// App.scene.footerBalance.position.SetZ(-6.4);
		// App.scene.footerBalance.position.SetX(1);
		// // Adapt active textures because it is inverted by nature.
		// App.scene.footerBalance.rotation.rotx = 180;

		// this.createNidzaHudBalance(this.nidza).then(streamTex => {
		// 	App.scene.footerBalance.streamTextures = {
		// 		videoImage: streamTex,
		// 	};
		// });

		// console.log("nidza component setup dimensions...", this.nidza);

		if(isMobile() && window.innerWidth < window.innerHeight) App.operation.squareTex_buffer_procedure(App.scene.overlayout);
		App.operation.squareTex_buffer_procedure(App.scene.topHeader);
		// App.operation.squareTex_buffer_procedure(App.scene.recordBtn);
		App.operation.squareTex_buffer_procedure(App.scene.footerLines);
		// App.operation.squareTex_buffer_procedure(App.scene.footerBalance);
		console.info("Video Editor is constructed.");

		this.sceneController = new SceneAnimator(world);
	};

	addRaycaster = () => {
		window.addEventListener("ray.hit.event", matrixEngineRaycastEvent => {
			console.log("details > ", matrixEngineRaycastEvent.detail.hitObject.name);
			var r = matrixEngineRaycastEvent.detail.hitObject.name;
			if(r == "recordBtn") {
				console.log("RECORDING .... > ", matrixEngineRaycastEvent.detail.hitObject.name);
				this.record();
			}
		});

		if(isMobile() == true) {
			canvas.addEventListener("touchstart", (ev) => {
				console.log('TEST MOB', ev)
				matrixEngine.raycaster.checkingProcedure(ev, {
					clientX: ev.targetTouches[0].clientX,
					clientY: ev.targetTouches[0].clientY
				});
			});
		} else {
			canvas.addEventListener("mousedown", ev => {
				matrixEngine.raycaster.checkingProcedure(ev);
			});
		}
	};

	record = () => {
		this.recordCanvas = new RC.RecordCanvas(this.options);
		this.recordCanvas.run()

		window.RC = RC;
		window.recordCanvas = this.recordCanvas;
	}

}