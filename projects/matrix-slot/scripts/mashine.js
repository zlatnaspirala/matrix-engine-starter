import * as matrixEngine from "matrix-engine";
// import {planeFont, planeUVFont} from "matrix-engine-plugins";
import {startSpin, stopSpin} from "./matrix-audio";
import {
	createNidzaTextureText,
	createNidzaHudLinesInfo,
	createNidzaHudLine1,
	createNidzaHudBalance,
	showActiveLinesByIndex,
	footerLinesInfo,
	incActiveLines
} from "./active-textures";
import {
	loadLineEffects,
	flashIn,
	startUpAnimMoveToRight,
	startUpAnimMoveToUp,
	incraseNumOfDrawInstance,
} from "./effect-lines";
import {Nidza} from "nidza";
import {beep} from "./audio-gen";
import {byId} from "matrix-engine/lib/utility";

let OSC = matrixEngine.utility.OSCILLATOR;
let App = matrixEngine.App;
let isMobile = matrixEngine.utility.isMobile;

export default class Mashines {
	constructor(world, config) {
		this.config = config;
		this.world = world;
		// animation startup
		this.flashIn = flashIn;
		this.startUpAnimMoveToRight = startUpAnimMoveToRight;
		this.startUpAnimMoveToUp = startUpAnimMoveToUp;
		this.incraseNumOfDrawInstance = incraseNumOfDrawInstance;
		this.createNidzaHudBalance = createNidzaHudBalance;
		// Slot status general
		this.status = "free";
		// this.font = new planeUVFont(); DISABLED
		this.speed = 0.4;
		this.thread = {
			control: {},
		};
		this.preThread = null;
		this.accessKeys = [];
		this.spinHandler = {
			lastInitY: [],
			bottomLimitY: -3.99,
			orderPositions: [],
		};

		this.winningHandler = {
			order: [],
		};

		this.loadLineEffects = loadLineEffects;

		// hold threads - clear it
		this.winningVisualEffect = {threads: [], ids: []};

		// inject voice commander
		this.vc = {};

		this.nidza = new Nidza();
		this.createNidzaTextureText = createNidzaTextureText;
		this.createNidzaHudLinesInfo = createNidzaHudLinesInfo;
		this.createNidzaHudLine1 = createNidzaHudLine1;

		this.addMashine(world);
		this.addWheel(world);
		// this.addHeaderText();
		this.addSpinText();
		this.addRaycaster();

		byId('fps').style.display = 'none'
		byId('debugBox').style.display = 'none'

		this.constructWinningObject = event => {
			stopSpin[event.detail.wheelID].play();
			// console.log( "constructWinningObject wheel id=>  ", event.detail.wheelID );
			let localHolder = [...App.slot.mashine.accessKeys[event.detail.wheelID]];
			var newOrder = App.slot.mashine.arrayRotate(localHolder);
			while(newOrder[newOrder.length - 1] != event.detail.fieldname) {
				newOrder = App.slot.mashine.arrayRotate(localHolder);
			}
			this.winningHandler.order.push(newOrder);
			// Only on last stop
			if(event.detail.isLast == true) {
				// It is last activate from here
				this.config.winnigLines.forEach((line, lineIndex) => {
					let countLineWins = [];
					let collectWinObjs = [];
					setTimeout(() => {
						this.killWinThreads();
						this.winningHandler.order.forEach((wheelData, index) => {
							let accessName = wheelData[line[index]];
							countLineWins.push(App.scene[accessName].specialId);
							collectWinObjs.push(App.scene[accessName]);
						});
						var finalResult = this.findMax(countLineWins);
						this.checkForWinCombination(finalResult, collectWinObjs, lineIndex);
						// soft hardcode
						if(lineIndex == 16) {
							// console.log("LAST", lineIndex);
							setTimeout(() => {
								this.status = "free";
								this.winningHandler.order = [];
								this.killWinThreads();
								let mashineFree = new CustomEvent("mashine.free", {
									detail: {
										status: this.status,
									},
								});
								dispatchEvent(mashineFree);
								// this.vc.run();
							}, this.config.waitForNextSpin);
						}
					}, 1000 * lineIndex);
				});
			}
		};

		window.addEventListener("wheel.stoped", this.constructWinningObject);

		window.addEventListener("mashine.free", (e) => {
			// console.info("MASHINE STATUS IS FREE");
			App.slot.mashine.nidza.access.footerLabel.elements[0].text = "Mashine is ready for next spin...";
		});

		if(isMobile()) {
			if(window.innerWidth < window.innerHeight) {
				console.log("Mobile device detected with portrain orientation, best fit for this game is landscape.");
			}
		}
	}

	activateWinningVisualEffect(worldObj, comb) {

		let oscilltor_variable,
			oscillator_color = new OSC(0, 2, 0.02);
		if(comb.repeat == 3) oscilltor_variable = new OSC(0, 45, 1);
		if(comb.repeat == 4) oscilltor_variable = new OSC(0, 270, 1);
		if(comb.repeat == 5) oscilltor_variable = new OSC(0, 360, 2);
		if(comb.repeat == 6) oscilltor_variable = new OSC(0, 180, 5);

		if(comb.repeat == 5) {
			this.winningVisualEffect.threads.push(
				setInterval(() => {
					worldObj.LightsData.ambientLight.r = oscillator_color.UPDATE();
					worldObj.LightsData.ambientLight.b = oscillator_color.UPDATE();
					worldObj.rotation.roty = oscilltor_variable.UPDATE();
					worldObj.rotation.rotx = oscilltor_variable.UPDATE();
				}, 10)
			);

			this.winningVisualEffect.ids.push(worldObj);
		} else if(comb.repeat == 4) {

			this.winningVisualEffect.threads.push(
				setInterval(() => {
					worldObj.LightsData.ambientLight.r = oscillator_color.UPDATE();
					worldObj.LightsData.ambientLight.g = oscillator_color.UPDATE();
					worldObj.rotation.rotz = oscilltor_variable.UPDATE();
					worldObj.rotation.rotx = oscilltor_variable.UPDATE();
				}, 10)
			);

			this.winningVisualEffect.ids.push(worldObj);

		} else if(comb.repeat == 3) {

			this.winningVisualEffect.threads.push(
				setInterval(() => {
					worldObj.LightsData.ambientLight.r = oscillator_color.UPDATE();
					worldObj.LightsData.ambientLight.b = oscillator_color.UPDATE();
					worldObj.rotation.roty = oscilltor_variable.UPDATE();
				}, 10)
			);

			this.winningVisualEffect.ids.push(worldObj);

		} else {
			this.winningVisualEffect.threads.push(
				setInterval(() => {
					worldObj.LightsData.ambientLight.r = oscillator_color.UPDATE();
					worldObj.LightsData.ambientLight.b = oscillator_color.UPDATE();
					worldObj.rotation.roty = oscilltor_variable.UPDATE();
				}, 10)
			);
			this.winningVisualEffect.ids.push(worldObj);
		}
	}

	killWinThreads() {
		this.winningVisualEffect.threads.forEach(threadTimer => {
			clearInterval(threadTimer);
		});
		// Becouse all wheels contain at list one of all kindof field types
		this.config.wheels[0].forEach(fieldOriginal => {
			this.winningVisualEffect.ids.forEach(obj => {
				if(fieldOriginal.id == obj.specialId) {
					obj.LightsData.ambientLight.r = fieldOriginal.color.r;
					obj.LightsData.ambientLight.b = fieldOriginal.color.b;
					obj.LightsData.ambientLight.g = fieldOriginal.color.g;
					obj.rotation.roty = 0;
					obj.rotation.rotz = 0;
					obj.rotation.rotx = 0;
					return;
				}
			});
		});
	}

	separateWinLineObjs(lineWinObjCollect, comb) {
		for(var j = 0;j < lineWinObjCollect.length;j++) {
			if(lineWinObjCollect[j].specialId == comb.fieldId) {
				this.activateWinningVisualEffect(lineWinObjCollect[j], comb);
			}
		}
	}

	checkForWinCombination(rez, lineWinObjCollect, lineIndex) {
		rez.forEach(comb => {
			// console.log("repeat ->", comb.repeat);
			if(comb.repeat == 3) {
				console.info("3 in line small win with field :", comb.fieldId);
				this.separateWinLineObjs(lineWinObjCollect, comb);
				App.slot.mashine.nidza.access.footerLabel.elements[0].text = comb.repeat + " repeat for field id:" + comb.fieldId + " on line " + (lineIndex).toString();
			} else if(comb.repeat == 4) {
				console.info("4 in line small win with field :", comb.fieldId);
				this.separateWinLineObjs(lineWinObjCollect, comb);
				App.slot.mashine.nidza.access.footerLabel.elements[0].text = comb.repeat + " repeat for field id:" + comb.fieldId + " on line " + (lineIndex).toString();
			} else if(comb.repeat == 5) {
				console.info("5 in line small win with field :", comb.fieldId);
				this.separateWinLineObjs(lineWinObjCollect, comb);
				App.slot.mashine.nidza.access.footerLabel.elements[0].text = comb.repeat + " repeat for field id:" + comb.fieldId + " on line " + (lineIndex).toString();
			} else if(comb.repeat == 6) {
				console.info("6 in line x win with field :", comb.fieldId);
				this.separateWinLineObjs(lineWinObjCollect, comb);
				App.slot.mashine.nidza.access.footerLabel.elements[0].text = comb.repeat + " repeat for field id:" + comb.fieldId + " on line " + (lineIndex).toString();
			} else if(comb.repeat < 3) {
				App.slot.mashine.nidza.access.footerLabel.elements[0].text = "No wins for line " + (lineIndex).toString();
			}
		});

		showActiveLinesByIndex(lineIndex);

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
		// console.log("Maximum recurring string is ",  maxRecurringString, ". Max number of times :" + max);
		return {maxRecurringString, max};
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
		App.scene.topHeader.geometry.setScaleByX(6);
		App.scene.topHeader.geometry.setScaleByY(1);
		App.scene.topHeader.position.y = 3.2;
		App.scene.topHeader.position.z = -6.5;
		App.scene.topHeader.glBlend.blendEnabled = true;

		App.scene.topHeader.custom.gl_texture = function(object, t) {
			world.GL.gl.bindTexture(world.GL.gl.TEXTURE_2D, object.textures[t]);
			world.GL.gl.texParameteri(
				world.GL.gl.TEXTURE_2D,
				world.GL.gl.TEXTURE_MAG_FILTER,
				world.GL.gl.LINEAR
			);
			world.GL.gl.texParameteri(
				world.GL.gl.TEXTURE_2D,
				world.GL.gl.TEXTURE_MIN_FILTER,
				world.GL.gl.LINEAR
			);
			//  world.GL.gl.texParameteri(world.GL.gl.TEXTURE_2D, world.GL.gl.TEXTURE_WRAP_S, world.GL.gl.MIRRORED_REPEAT);
			//  world.GL.gl.texParameteri(world.GL.gl.TEXTURE_2D, world.GL.gl.TEXTURE_WRAP_T, world.GL.gl.MIRRORED_REPEAT);
			world.GL.gl.texParameteri(
				world.GL.gl.TEXTURE_2D,
				world.GL.gl.TEXTURE_WRAP_S,
				world.GL.gl.REPEAT
			);
			world.GL.gl.texParameteri(
				world.GL.gl.TEXTURE_2D,
				world.GL.gl.TEXTURE_WRAP_T,
				world.GL.gl.REPEAT
			);

			world.GL.gl.texImage2D(
				world.GL.gl.TEXTURE_2D,
				0,
				world.GL.gl.RGBA,
				world.GL.gl.RGBA,
				world.GL.gl.UNSIGNED_BYTE,
				object.textures[t].image
			);

			world.GL.gl.generateMipmap(world.GL.gl.TEXTURE_2D);
		};

		var coefic = 2;
		App.scene.topHeader.geometry.texCoordsPoints.right_top.y = -coefic;
		App.scene.topHeader.geometry.texCoordsPoints.right_top.x = coefic;
		App.scene.topHeader.geometry.texCoordsPoints.left_bottom.x = -coefic;
		App.scene.topHeader.geometry.texCoordsPoints.left_bottom.y = coefic;
		App.scene.topHeader.geometry.texCoordsPoints.left_top.x = -coefic;
		App.scene.topHeader.geometry.texCoordsPoints.left_top.y = -coefic;
		App.scene.topHeader.geometry.texCoordsPoints.right_bottom.x = coefic;
		App.scene.topHeader.geometry.texCoordsPoints.right_bottom.y = coefic;

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

		this.createNidzaTextureText(this.nidza).then(what => {
			// console.log('TEST createNidzaTextureText', what)
			App.scene.footerHeader.streamTextures = {
				videoImage: what,
			};
		});

		world.Add("squareTex", 1, "footerHeader", texTopHeader);
		App.scene.footerHeader.geometry.setScaleByX(6);
		App.scene.footerHeader.geometry.setScaleByY(0.39);
		App.scene.footerHeader.position.y = -2.56;
		App.scene.footerHeader.position.z = -6.5;
		// Adapt active textures because it is inverted by nature.
		App.scene.footerHeader.rotation.rotx = 180;

		// Footer active lines
		world.Add("squareTex", 1, "footerLines", texTopHeader);
		App.scene.footerLines.geometry.setScaleByX(0.99);
		App.scene.footerLines.geometry.setScaleByY(0.19);
		App.scene.footerLines.position.SetY(-2.48);
		App.scene.footerLines.position.SetZ(-6.4);
		App.scene.footerLines.position.SetX(-2.55);
		// Adapt active textures because it is inverted by nature.
		// App.scene.footerLines.rotation.rotx = 180;
		App.scene.footerLines.rotation.rotz = 0;
		App.scene.footerLines.rotation.rotx = 0;
		App.scene.footerLines.rotation.roty = 0;

		this.createNidzaHudLinesInfo(this.nidza).then(r => {
			// INVERT
			var localCtx = r.texCanvas.getContext("2d");
			localCtx.scale(1, -1);
			localCtx.translate(0, -r.texCanvas.height);
			footerLinesInfo.elements[0].position.translateX(25.3);
			App.scene.footerLines.streamTextures = {videoImage: r.texCanvas};
		});

		// Footer balance
		world.Add("squareTex", 1, "footerBalance", texTopHeader);
		App.scene.footerBalance.geometry.setScaleByX(1.15);
		App.scene.footerBalance.geometry.setScaleByY(0.23);
		App.scene.footerBalance.position.SetY(-2.55);
		App.scene.footerBalance.position.SetZ(-6.4);
		App.scene.footerBalance.position.SetX(1);
		// Adapt active textures because it is inverted by nature.
		App.scene.footerBalance.rotation.rotx = 180;
		this.createNidzaHudBalance(this.nidza).then(streamTex => {
			App.scene.footerBalance.streamTextures = {
				videoImage: streamTex,
			};
		});

		// console.log("nidza component setup dimensions...", this.nidza);
		this.loadLineEffects(this.nidza);

		showActiveLinesByIndex(0);
		// Style color buttom of footer
		//App.scene.footerHeader.geometry.colorData.color[0].set( 0.1, 0.1, 0.1 );
		//App.scene.footerHeader.geometry.colorData.color[1].set( 0.1, 0.1, 0.1 );
		//App.scene.footerHeader.geometry.colorData.color[2].set( 0.1, 0.1, 0.1 );
		//App.scene.footerHeader.geometry.colorData.color[3].set( 0.1, 0.1, 0.1 );
		if(isMobile() && window.innerWidth < window.innerHeight) App.operation.squareTex_buffer_procedure(App.scene.overlayout);
		App.operation.squareTex_buffer_procedure(App.scene.topHeader);
		App.operation.squareTex_buffer_procedure(App.scene.footerHeader);
		App.operation.squareTex_buffer_procedure(App.scene.footerLines);
		App.operation.squareTex_buffer_procedure(App.scene.footerBalance);
		console.info("Mashine is constructed.");
		setTimeout(() => {
			App.slot.mashine.startUpAnimMoveToRight();
		}, 2500);
	};

	addWheel = function(world) {
		var WW = App.slot.config.wheels.length;
		var VW = App.slot.config.verticalSize;
		let VT = matrixEngine.Engine.VT;

		App.slot.config.wheels.forEach((wheel, indexWheel) => {
			var localHandler = [],
				localHandlerPos = [],
				lastY = 0;

			wheel.forEach((field, indexField) => {
				var textuteArg = {
					source: field.textures,
					mix_operation: "multiply",
				};

				var name = "wheel" + indexWheel + "field" + indexField;
				world.Add(field.geo, 1, name, textuteArg);
				localHandler.push(name);
				// Referent done for default camera position.
				var O = (window.innerWidth / 1000) * WW;
				var O2 = (window.innerWidth / 1005) * WW;

				if(isMobile() == true) {
					O = (window.innerWidth / 400) * WW;
					O2 = (window.innerWidth / 405) * WW;
				}

				App.scene[name].LightsData.ambientLight.set(
					field.color.r,
					field.color.g,
					field.color.b
				);

				if(field.videoTex && field.videoTex !== false) {
					App.scene[name].streamTextures = new VT(field.videoTex)
				}
				if(field.myFBO && field.myFBO === true) {
					// console.log('TEST field.FBO ', field.videoTex)
					App.scene[name].rotation.rotz = 90;
					App.scene[name].rotation.rotx = 90;
					App.scene[name].rotation.roty = 0;
					App.scene[name].setFBO({
						cameraX: 0,
						cameraY: 0,
						cameraZ: 5,
						pitch: 12,
						yaw: 0
					});
				}

				if(field.myCamera && field.myCamera === true) {
					// console.log('TEST field.myCamera ', field.videoTex)
					App.scene[name].streamTextures = new matrixEngine.Engine.ACCESS_CAMERA('webcam_beta')
					App.scene[name].rotation.roty = 180;
				}

				App.scene[name].specialId = field.id;
				var _x = -O * 0.5 + indexWheel * O2 * 0.2;
				var _y = -2 + indexField * 2;
				var _z = -9;
				App.scene[name].position.z = _z;
				App.scene[name].position.x = _x;
				App.scene[name].position.y = _y;
				localHandlerPos.push({_x, _y, _z});
				lastY = App.scene[name].position.y;

				/*
				App.scene[name].geometry.colorData.color[0].set(field.color.r,field.color.b,field.color.g)
				App.scene[name].geometry.colorData.color[1].set(field.color.r,field.color.b,field.color.g)
				App.scene[name].geometry.colorData.color[2].set(field.color.r,field.color.b,field.color.g)
				App.scene[name].geometry.colorData.color[3].set(1,1,1);
				App.operation.square_buffer_procedure(App.scene[name]);
				*/
			});

			this.spinHandler.orderPositions.push(localHandlerPos);
			this.spinHandler.lastInitY.push(lastY);
			this.accessKeys.push(localHandler);
		});
	};

	addHeaderText = function() {
		var c = 0;
		var count = 0;
		this.font.charLoaded = objChar => {
			// headerTitleS
			objChar.mesh.setScale(0.6);
			objChar.position.SetZ(-6.45);
			switch(objChar.name) {
				case "headerTitleS":
					count = 0;
					break;
				case "headerTitleL":
					count = 1;
					break;
				case "headerTitleO":
					count = 1.4;
					break;
				case "headerTitleT":
					count = 2.5;
					break;
			}
			objChar.position.translateByXY(-1 + count * 0.4, 2.2);
			if(c == 3) this.addSpinText();
			c++;
		};
		this.font.loadChar(matrixEngine.objLoader, "s", "headerTitle");
		this.font.loadChar(matrixEngine.objLoader, "l", "headerTitle");
		this.font.loadChar(matrixEngine.objLoader, "o", "headerTitle");
		this.font.loadChar(matrixEngine.objLoader, "t", "headerTitle");
	};

	fieldOnClick = function(hitObject) {
		// var oscAng = new matrixEngine.utility.OSCILLATOR(1, 2, 0.05);
		hitObject.rotation.rotationSpeed.y = 200;
		hitObject.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[matrixEngine.utility.randomIntFromTo(4, 6)];
		hitObject.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[matrixEngine.utility.randomIntFromTo(3, 5)];
		hitObject.glBlend.blendEnabled = true;

		setTimeout(() => {
			hitObject.rotation.rotationSpeed.y = 0;
			hitObject.rotation.roty = 0;
			hitObject.glBlend.blendEnabled = false;
		}, 2000)
	};

	addRaycaster = () => {
		window.addEventListener("ray.hit.event", matrixEngineRaycastEvent => {
			// console.log("details > ", matrixEngineRaycastEvent.detail.hitObject.name);
			var r = matrixEngineRaycastEvent.detail.hitObject.name;
			if(r == "spinBtn") {
				this.activateSpinning();
			} else if(r.indexOf("wheel") != -1) {
				this.fieldOnClick(matrixEngineRaycastEvent.detail.hitObject);
			} else if(r == "footerLines") {
				showActiveLinesByIndex(incActiveLines());
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

	addSpinText = function() {
		var textuteImageSamplers = {
			source: ["res/images/spin.jpg"],
			mix_operation: "multiply", // ENUM : multiply, divide,
		};
		matrixEngine.matrixWorld.world.Add("squareTex", 1, "spinBtn", textuteImageSamplers);
		App.scene.spinBtn.position.SetY(-1.98);
		App.scene.spinBtn.position.SetX(2);
		App.scene.spinBtn.position.SetZ(-5);
		App.scene.spinBtn.geometry.setScaleByX(0.3);
		App.scene.spinBtn.geometry.setScaleByY(0.12);
		App.scene.spinBtn.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
		App.scene.spinBtn.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
	};

	activateSpinning = () => {
		if(this.status != "free") {
			beep()
			return;
		}
		this.status = "spinning";
		this.preSpinning(0).then(() => {
			this.spinning(0);
			this.preSpinning(1).then(() => {
				this.spinning(1);
				this.preSpinning(2).then(() => {
					this.spinning(2);
					this.preSpinning(3).then(() => {
						this.spinning(3);
						this.preSpinning(4).then(() => {
							this.spinning(4);
							this.preSpinning(5).then(() => {
								this.spinning(5);
								this.allWheelSpinningMoment();
							});
						});
					});
				});
			});
		});
	};

	allWheelSpinningMoment = () => {
		// console.info("All wheels spinning");
		setTimeout(() => {
			var index = 0;
			for(let key in this.thread.control) {
				setTimeout(() => {
					this.thread.control[key] = true;
				}, App.slot.config.stopingInterval * index++);
			}
		}, App.slot.config.spinningInterval);
	};

	spinning = wheelID => {
		this.thread.control["ctrl" + wheelID] = false;
		this.thread["timer" + wheelID] = {};
		this.thread["timer" + wheelID].UPDATE = () => {
			this.accessKeys.forEach(
				(accessWheelNames, indexWheel, accessKeysArray) => {
					if(wheelID == indexWheel) {
						accessWheelNames.forEach(
							(fieldname, indexField, accessWheelNames) => {
								App.scene[fieldname].position.y -= this.speed;

								if(wheelID == 0) {
									//App.scene[fieldname].rotation.rotationSpeed.x = 100;
								} else if(wheelID == 1) {
									//App.scene[fieldname].rotation.rotationSpeed.y = 100;
								} else if(wheelID == 2) {
									//App.scene[fieldname].rotation.rotationSpeed.x = -100;
								}

								if(App.scene[fieldname].position.y < this.spinHandler.bottomLimitY) {
									App.scene[fieldname].position.y = this.spinHandler.lastInitY[indexWheel];
									// moment
									if(this.thread.control["ctrl" + wheelID] == true) {
										// clearInterval(this.thread["timer" + wheelID]);
										// console.log("####" + App.updateBeforeDraw.indexOf(this.thread["timer" + wheelID]))
										App.updateBeforeDraw.splice(App.updateBeforeDraw.indexOf(this.thread["timer" + wheelID]), 1)
										App.scene[fieldname].rotation.rotationSpeed.x = 0;
										App.scene[fieldname].rotation.rotationSpeed.y = 0;

										var isLast = false;
										// wheel0field5 parse 5 + 1 = 0  or
										if(indexWheel == accessKeysArray.length - 1) {
											isLast = true;
											App.scene.topHeader.shake = false;
										}
										// get winning for wheel id and fieldname
										let wheelStoped = new CustomEvent("wheel.stoped", {
											detail: {
												wheelID: wheelID,
												fieldname: fieldname,
												isLast: isLast,
											},
										});
										dispatchEvent(wheelStoped);

										App.scene[fieldname].position.y = this.spinHandler.lastInitY[indexWheel];
									}
								}
							}
						);
					}
				});
			clearInterval(this.preThread);
		}

		App.updateBeforeDraw.push(this.thread["timer" + wheelID]);
	};

	preSpinning = wheelID => {
		return new Promise((resolve, reject) => {
			startSpin[wheelID].play();

			App.scene.topHeader.shake = true;
			App.scene.topHeader.runShake()

			this.preThread = setInterval(() => {
				this.accessKeys.forEach((accessWheelNames, indexWheel) => {
					if(indexWheel == wheelID) {
						accessWheelNames.forEach((fieldname, indexField) => {
							App.scene[fieldname].position.y += 0.02;
						});
					}
				});
			}, 100);
			setTimeout(() => {
				clearInterval(this.preThread);
				resolve();
			}, 800);
		});
	};

	deActivateSpiningThread = () => {
		clearInterval(this.thread);
	};
}