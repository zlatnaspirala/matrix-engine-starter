import * as matrixEngine from "matrix-engine";
// import {planeFont, planeUVFont} from "matrix-engine-plugins";
// import {startSpin, stopSpin} from "./matrix-audio";
import {createNidzaHudBalance, createHudBtnRotZ} from "./active-textures";
import {Nidza} from "nidza";
// import {beep} from "./audio-gen";
import {loadSystemMuscular, loadSystemSkeletal} from "./systems/anatomy-loader";
import {MTM} from 'matrix-engine-plugins';

let OSC = matrixEngine.utility.OSCILLATOR;
let App = matrixEngine.App;
let isMobile = matrixEngine.utility.isMobile;

export default class WebAnatomy {
	constructor(world, config) {
		this.config = config;
		this.world = world;

		this.skeletalSystem = null;
		let App = matrixEngine.App;
		App.camera.SceneController = true;
		// Make it adaptive for blender exported data.
		App.camera.speedAmp = 0.1;
		App.camera.sceneControllerDragAmp = 3.3;
		matrixEngine.Events.camera.zPos = 140;
		matrixEngine.Events.camera.yPos = 40;

		this.globalRotZ = 0;
		// inject voice commander
		this.vc = {};
		this.nidza = new Nidza();
		this.createNidzaHudBalance = createNidzaHudBalance;
		this.statusText = new MTM('Matrix Anatomy', {deltaRemove: 1, deltaFill: 40})
		this.statusText1 = new MTM('-L-O-A-D-I-N-G-', {deltaRemove: 1, deltaFill: 1})

		this.statusText2 = {text: 'Supported:'}
		this.statusText3 = {text: ' - 💀 Skeletal, Muscular Systems'}
		this.statusText4 = {text: ''}
		this.statusText5 = {text: 'Based on matrix-engine'}
		this.statusText6 = {text: 'Created by Nikola Lukic'}
		this.statusText7 = {text: 'maximumroulette.com'}

		var TESTARRAY = [this.statusText1]
		var TESTARRAYHOVER = [this.statusText2, this.statusText3, this.statusText4, this.statusText5, this.statusText6, this.statusText7]

		var texTopHeader = {
			source: ["res/images/metal.jpg"],
			mix_operation: "multiply",
		};

		world.Add("squareTex", 1, "topHeader", texTopHeader);
		App.scene.topHeader.geometry.setScaleByX(55);
		App.scene.topHeader.geometry.setScaleByY(-20);
		App.scene.topHeader.position.z = 21;
		App.scene.topHeader.position.x = 10;
		App.scene.topHeader.position.y = 40;
		App.scene.topHeader.position.thrust = 15.2;

		App.scene.topHeader.glBlend.blendEnabled = true;
		App.scene.topHeader.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[6];
		App.scene.topHeader.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[2];

		this.createNidzaHudBalance(this.nidza, this.statusText, TESTARRAY, TESTARRAYHOVER).then((canvas2d) => {
			App.scene.topHeader.streamTextures = {
				videoImage: canvas2d
			}
		})

		var rotZImg = {
			source: ["res/images/r.png"],
			mix_operation: "multiply",
		};
		world.Add("squareTex", 1, "cmdRotZ", rotZImg);
		App.scene.cmdRotZ.geometry.setScaleByX(5);
		// ray caster not work for - scale
		App.scene.cmdRotZ.geometry.setScaleByY(5);
		App.scene.cmdRotZ.rotation.rotx = 0;
		App.scene.cmdRotZ.position.z = 21;
		App.scene.cmdRotZ.position.x = -30;
		App.scene.cmdRotZ.position.y = 40;
		// createHudBtnRotZ(this.nidza, this.statusText, TESTARRAY, TESTARRAYHOVER).then((canvas2d) => {
		// 	App.scene.cmdRotZ.streamTextures = {
		// 		videoImage: canvas2d
		// 	}
		// })

		this.addAnatomySystems(world);
		this.addRaycaster();

		if(isMobile()) {
			if(window.innerWidth < window.innerHeight) {
				console.log("Mobile device detected with portrain orientation, best fit for this game is landscape.");
			}
		}
	}

	/**
	 * @description
	 * Add this to untility matrix engine
	 */
	arrayRotate(arr, reverse) {
		if(reverse) arr.unshift(arr.pop());
		else arr.push(arr.shift());
		return arr;
	}

	findMax(arr) {
		var counts = {},
			max = 0,
			res;
		for(var v in arr) {
			counts[arr[v]] = (counts[arr[v]] || 0) + 1;
			if(counts[arr[v]] > max) {
				max = counts[arr[v]];
				res = arr[v];
			}
		}
		var results = [];
		for(var k in counts) {
			if(counts[k] == max) {
				var localRes = {fieldId: k, repeat: counts[k]};
				results.push(localRes);
			}
		}
		return results;
	}

	findMaxOfStrDuplicates(argArray) {
		var name;
		var map = new Map();
		var max = 1;
		var maxRecurringString = "";
		for(name of argArray) {
			if(map.get(name) === undefined) {
				map.set(name, 1);
			} else {
				var count = map.get(name);
				count = count + 1;
				map.set(name, count);
				if(max < count) {
					max = count;
					maxRecurringString = name;
				}
			}
		}
		console.log(
			"Maximum recurring string is ",
			maxRecurringString,
			". Max number of times :" + max
		);
		return {maxRecurringString, max};
	}

	addAnatomySystems = function(world) {

		if(matrixEngine.utility.QueryString.skeletal &&
			matrixEngine.utility.QueryString.skeletal == 'true') {
			loadSystemSkeletal(App, world).then((skeletal) => {
				this.skeletalSystem = skeletal;
				setTimeout(() => {
					App.scene.topHeader.position.translateByXY(69, 76)
					setTimeout(() => {
						this.statusText1.blocker = false;
						this.statusText1.text = '[Skeletal parts]'
						console.info("Skeletal loaded.");
					}, 1000)
				}, 3000)
			});
		} else if(matrixEngine.utility.QueryString.muscular &&
			matrixEngine.utility.QueryString.muscular == 'true') {
			loadSystemMuscular(App, world).then((skeletal) => {
				this.skeletalSystem = skeletal;
				setTimeout(() => {
					App.scene.topHeader.position.translateByXY(48, 75)
					setTimeout(() => {
						this.statusText1.blocker = false;
						this.statusText1.text = 'Muscular parts:'
						console.info("Anatomy is constructed.");
					}, 1000)
				}, 3000)
			});
		} else {
			// default skeletal
			loadSystemSkeletal(App, world).then((skeletal) => {
				this.skeletalSystem = skeletal;
				setTimeout(() => {
					App.scene.topHeader.position.translateByXY(69, 76)
					setTimeout(() => {
						this.statusText1.blocker = false;
						this.statusText1.text = '[Skeletal parts]'
						console.info("Skeletal loaded.");
					}, 1000)
				}, 3000)
			});
		}
	};

	addRaycaster = () => {
		var LAST_HOVER = null;
		window.addEventListener("ray.hit.event", ev => {
			var r = ev.detail.hitObject.name;
			// console.log("RAY", r)
			this['statusText7'].text = this['statusText6'].text;
			if (ev.detail.hitObject.name == "cmdRotZ") {
				this.globalRotZ += 5;
				App.webAnatomy.changeRotZ(this.globalRotZ)
				return;
			}
			if(ev.detail.hitObject.hoverEffect) {
				if(LAST_HOVER != null && LAST_HOVER.name != ev.detail.hitObject.name) {
					LAST_HOVER.hoverLeaveEffect(LAST_HOVER)
				} else {
					ev.detail.hitObject.hoverEffect(ev.detail.hitObject)
				}
				LAST_HOVER = ev.detail.hitObject;
			}
			this['statusText6'].text = this['statusText5'].text;
			this['statusText5'].text = this['statusText4'].text;
			this['statusText4'].text = this['statusText3'].text;
			this['statusText3'].text = this['statusText2'].text;
			this['statusText2'].text = r;
		});

		canvas.addEventListener("mousemove", ev => {
			matrixEngine.raycaster.checkingProcedure(ev);
		});
	};

	changeGlBlend = (src, dest, rot) => {
		for(let key in App.scene) {
			if(App.scene[key].name.indexOf("s_") !== -1) {
				App.scene[key].glBlend.blendEnabled = true;
				App.scene[key].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[src];
				App.scene[key].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[dest];
			}
		}
	}

	changeScale = (src) => {
		for(let key in App.scene) {
			if(App.scene[key].name.indexOf("s_") !== -1) {
				App.scene[key].mesh.setScale(src)
			}
		}
	}

	changeRotY = (a) => {
		for(let key in App.scene) {
			if(App.scene[key].name.indexOf("s_") !== -1) {
				App.scene[key].rotation.roty = a;
			}
		}
	}
	changeRotX = (a) => {
		for(let key in App.scene) {
			if(App.scene[key].name.indexOf("s_") !== -1) {
				App.scene[key].rotation.rotx = a;
			}
		}
	}
	changeRotZ = (a) => {
		for(let key in App.scene) {
			if(App.scene[key].name.indexOf("s_") !== -1) {
				App.scene[key].rotation.rotz = a;
			}
		}
	}

	changeDrawType(a) {
		for(let key in App.scene) {
			if(App.scene[key].name.indexOf("s_") !== -1) {
				App.scene[key].glDrawElements.mode = a;
			}
		}

	}
}
