
/**
 * @description Usage of raycaster, ObjectLoader Sequence,
 * FirstPersonController.
 * This will be part of new lib file `lib/controllers/fps.js`
 * Example API calls Usage:
 * - Deeply integrated to the top level scene object with name `player`.
 *   `App.scene.player.updateEnergy(4);`
 * Predefined from 0 to the 8 energy value.
 * @class First Person Shooter example
 * @mapLoader Best way for productivity.
 */
import * as matrixEngine from "matrix-engine";
import * as CANNON from 'cannon';
import {createPauseScreen, REDLOG} from "./dom";
import {RCSAccount} from "./rocket-crafting-account";
import {SYS} from "matrix-engine/lib/events";
import {meMapLoader} from "./map-loader";
import {map1} from "../maps/map1";
import {map} from "../maps/map2";
import {loadDoorsBVH} from "./env";
import {Create2DBanner} from "./active-textures";

const useRCSAccount = true;
const RCSAccountDomain = 'https://maximumroulette.com';

export var runHang3d = (world) => {
	addEventListener('onTitle', (e) => {
		document.title = e.detail
	})
	// You can use import also.
	matrixEngine.utility.notify.hideTime = 100;
	matrixEngine.utility.notify.showTime = 2600;
	matrixEngine.utility.notify.show('FirstPersonShooter MultiPlayer Template Based on Matrix-Engine 2.x.xx')

	let notify = matrixEngine.utility.notify;
	let byId = matrixEngine.utility.byId;
	let ENUMERATORS = matrixEngine.utility.ENUMERATORS;
	let isMobile = matrixEngine.utility.isMobile;
	let randomFloatFromTo = matrixEngine.utility.randomFloatFromTo;
	const getQuery = matrixEngine.utility.QueryString;
	let App = matrixEngine.App;
	setTimeout(() => document.querySelector('.button2').click(), 2000)
	// Camera
	canvas.style.cursor = 'none';
	App.camera.FirstPersonController = true;
	matrixEngine.Events.camera.fly = false;
	// CPU~
	App.camera.speedAmp = 0.03;//ori 0.02
	matrixEngine.Events.camera.yPos = 10;
	App.camera.yawRateOnEdge = 3; //ori 3
	App.camera.yawRate = 3; // 1
  // raycaster
	matrixEngine.raycaster.touchCoordinate.stopOnFirstDetectedHit = true;
	App.myAccounts = {};

	// Keyboard event
	addEventListener('hit.keyDown', (e) => {
		if(e.detail.origin.key == "Escape" || e.detail.keyCode == 27) {
			console.log(`%cPAUSE SCREEN`, REDLOG)
			byId('pauseScreen').style.display = 'flex';
		}
	})

	// Audio effects
	App.sounds.createAudio('shoot', 'res/music/single-gunshot.mp3', 5);
	App.sounds.createAudio('bgMusic', 'res/music/audionautix-black-fly.mp3');
	App.sounds.audios.bgMusic.loop = true;
	App.FIRST_CLICK = function(e) {
		e.preventDefault()
		App.sounds.play('bgMusic').then((e) => {
			console.log('good ', e)
			window.removeEventListener("click", App.FIRST_CLICK);
		}).catch((e) => {
			console.log('wait for first click', e)
		})
	};
	if (getQuery.music === 'true') window.addEventListener("click", App.FIRST_CLICK);
	
	// Prevent right click context menu
	window.addEventListener("contextmenu", (e) => {e.preventDefault()});
	// Only for mobile - Mobile player controller UI
	if(isMobile() == true) {
		App.camera.yawRateOnEdge = 4;
		byId('fps').style.display = 'none';
		byId('debugBox').style.display = 'none';
		matrixEngine.utility.createDomFPSController();
	}
	// Activate networking
	matrixEngine.Engine.activateNet2(undefined,
		{
			sessionName: 'hang3d-matrix',
			resolution: '240x160'
		});

	// Override mouse up - example how to use
	App.events.CALCULATE_TOUCH_UP_OR_MOUSE_UP = () => {
		App.scene.FPSTarget.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
		App.scene.FPSTarget.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
		App.scene.FPSTarget.geometry.setScale(0.1);
		App.scene.xrayTarget.visible = false;
	};

	// Override right mouse down
	matrixEngine.Events.SYS.MOUSE.ON_RIGHT_BTN_PRESSED = (e) => {
		App.scene.FPSTarget.geometry.setScale(0.6);
		App.scene.FPSTarget.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
		App.scene.FPSTarget.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
		App.scene.xrayTarget.visible = true;
	};

	App.events.multiTouch = function(ev, e) {
		if(e.length > 1) {
			// second touch detected wip mobile
			// e[1].pageX
			matrixEngine.raycaster.checkingProcedure(ev, {
				clientX: ev.target.width / 2,
				clientY: ev.target.height / 2
			});
			App.sounds.play('shoot');
		}
	}

	if(isMobile() == true) {
		// Attach for mobile contrller also for desktop default
		// Mobile
		// For mobile i need to make interval calls on 10 ms 
		// and incrase App.camera.yawRate from 1 to 6.
		App.camera.yawRate = 6;
		var MY_TIMERS = {
			TIMERLEFT: null,
			TIMERRIGHT: null,
			TIMERUP: null,
			TIMERDOWN: null,
		};
		matrixEngine.Events.camera.preventSpeedZero = true;
		byId('mobLeft').addEventListener('touchmove', (e) => {e.preventDefault()})
		byId('mobLeft').addEventListener('touchstart', (e) => {
			e.preventDefault()
			MY_TIMERS.TIMERLEFT = setInterval(() => {matrixEngine.Events.camera.yawRate = App.camera.yawRate;}, 10)
		})

		byId('mobLeft').addEventListener('touchend', () => {
			clearInterval(MY_TIMERS.TIMERLEFT)
			MY_TIMERS.TIMERLEFT = null;
		})
		byId('mobRight').addEventListener('touchmove', (e) => {e.preventDefault()})
		byId('mobRight').addEventListener('touchstart', (e) => {
			e.preventDefault()
			MY_TIMERS.TIMERRIGHT = setInterval(() => {matrixEngine.Events.camera.yawRate = -App.camera.yawRate;}, 10)
		})

		byId('mobRight').addEventListener('touchend', (e) => {
			clearInterval(MY_TIMERS.TIMERRIGHT)
			MY_TIMERS.TIMERRIGHT = null;
		})
		byId('mobUp').addEventListener('touchmove', (e) => {e.preventDefault()})
		byId('mobUp').addEventListener('touchstart', (e) => {
			e.preventDefault()
			MY_TIMERS.TIMERUP = setInterval(() => {matrixEngine.Events.camera.speed = App.camera.speedAmp;}, 10)
		})

		byId('mobUp').addEventListener('touchend', (e) => {
			matrixEngine.Events.camera.speed = 0
			clearInterval(MY_TIMERS.TIMERUP)
			MY_TIMERS.TIMERUP = null;
		})

		byId('mobDown').addEventListener('touchmove', (e) => {e.preventDefault()})
		byId('mobDown').addEventListener('touchstart', (e) => {
			e.preventDefault()
			MY_TIMERS.TIMERDOWN = setInterval(() => {matrixEngine.Events.camera.speed = -App.camera.speedAmp;}, 10)
		})

		byId('mobDown').addEventListener('touchend', (e) => {
			matrixEngine.Events.camera.speed = 0
			clearInterval(MY_TIMERS.TIMERDOWN)
			MY_TIMERS.TIMERDOWN = null;
		})

		// For any case
		byId('mobDown').addEventListener('touchcancel', (e) => {
			matrixEngine.Events.camera.speed = 0
			clearInterval(MY_TIMERS.TIMERDOWN)
			MY_TIMERS.TIMERDOWN = null;
			clearInterval(MY_TIMERS.TIMERUP)
			MY_TIMERS.TIMERUP = null;
			clearInterval(MY_TIMERS.TIMERRIGHT)
			MY_TIMERS.TIMERRIGHT = null;
		})

		// Disable default
		App.events.CALCULATE_TOUCH_MOVE_OR_MOUSE_MOVE = () => {}
		byId('domAngleAxis').style.left = "25px";
		// byId('domAngleAxis').style.width = innerWidth / 100 * 30 + "px";
		// byId('domAngleAxis').style.height = innerHeight / 100 * 30 + "px";
		byId('domAngleAxis').addEventListener('touchmove', (e) => {
			e.preventDefault()
			var center_x = window.innerWidth / 2;
			var center_y = window.innerHeight / 2;
			// Formula for adapting Axis controller
			var t = innerWidth / 2 - (e.target.offsetLeft + e.target.offsetWidth) + e.target.offsetWidth / 2;
			var t1 = innerHeight / 2 - (e.target.offsetTop + e.target.offsetHeight) + e.target.offsetHeight / 2;
			SYS.MOUSE.x = (e.changedTouches[0].clientX - center_x) + t;
			SYS.MOUSE.y = (e.changedTouches[0].clientY - center_y) + t1;
			//check to make sure there is data to compare against
			if(typeof SYS.MOUSE.LAST_POSITION.x != 'undefined') {
				//get the change from last position to this position
				var deltaX = SYS.MOUSE.LAST_POSITION.x - SYS.MOUSE.x,
					deltaY = SYS.MOUSE.LAST_POSITION.y - SYS.MOUSE.y;
			}

			if(App.camera.SceneController === true && keyboardPress.getKeyStatus(16) ||
				App.camera.FirstPersonController === true) {
				// console.log('works for both now deltaX', deltaX)
				matrixEngine.Events.camera.pitchRate += deltaY * 10;
				matrixEngine.Events.camera.yawRate += deltaX * 2;
				if(SYS.MOUSE.x < App.camera.edgeMarginValue - center_x) {
					App.camera.leftEdge = true;
				} else {
					App.camera.leftEdge = false;
				}
				if(SYS.MOUSE.x > center_x - App.camera.edgeMarginValue) {
					App.camera.rightEdge = true;
				} else {
					App.camera.rightEdge = false;
				}
			}
			(SYS.MOUSE.LAST_POSITION.x = SYS.MOUSE.x), (SYS.MOUSE.LAST_POSITION.y = SYS.MOUSE.y);
		})

		byId('mobFire').addEventListener('touchstart', (ev) => {
			ev.preventDefault()
			// fake it
			ev.target.width = window.innerWidth;
			ev.target.height = window.innerHeight;
			matrixEngine.raycaster.checkingProcedure(ev, {
				clientX: window.innerWidth / 2,
				clientY: window.innerHeight / 2
			});
			App.sounds.play('shoot');
		})
	} else {
		// Override mouse down
		App.events.CALCULATE_TOUCH_DOWN_OR_MOUSE_DOWN = (ev, mouse) => {
			if(isMobile() == false) {
				// `checkingProcedure` gets secound optimal argument
				// For custom ray origin target.
				if(mouse.BUTTON_PRESSED == 'RIGHT') {
					// Zoom
				} else {
					// This call represent `SHOOT` Action. And it is center of screen!
					matrixEngine.raycaster.checkingProcedure(ev, {
						clientX: ev.target.width / 2,
						clientY: ev.target.height / 2
					});
					App.sounds.play('shoot');
				}
			} else {
				// Mobile IF WE WANT SHOT FROM ANY WHERE
				// This call represent `SHOOT` Action. And it is center of screen!
			}
		};
	}

	// Receive data from network
	addEventListener('network-data', (e) => {
		console.log("receive:", e.detail)
		if(e.detail.damage) {
			console.log("damage from ", e.detail.damage.from, " to ", e.detail.damage.to)
			if(e.detail.damage.to == App.scene.playerCollisonBox.position.netObjId) {
				console.log("<my damage - here is catch who kills on both net sides>")
				notify.error(`${e.detail.damage.from} shot you!`)
				App.scene.player.energy.value -= (0.25 - (App.scene.player.items.armor ? App.scene.player.items.armor.preventDamage : 0));
				// pre check for 0
				if(App.scene.player.energy.value <= 0) {
					// Stream part
					// killed by
					matrixEngine.Engine.net.connection.send({
						kills: {
							killer: e.detail.damage.from,
							killed: e.detail.damage.to
						}
					})
					// Call rock platform
					App.myAccounts.dead();
					// send it to spawn from space
					// Next feature : Implement map and Setup from map spawn positions.
					matrixEngine.Events.camera.xPos = 0;
					matrixEngine.Events.camera.zPos = 0;
					matrixEngine.Events.camera.yPos = 300;
					App.scene.playerCollisonBox.physics.currentBody.position.set(0, 0, 300);
				}
				App.scene.player.updateEnergy(App.scene.player.energy.value);
			}
		} else if(e.detail.kills) {
			// console.log("Killer: ", e.detail.kills.killer, " Killed: ", e.detail.kills.killed)
			if(e.detail.kills.killer == App.scene.playerCollisonBox.position.netObjId) {
				notify.show('You kill ' + e.detail.kills.killed)
				// ROCK - First step Not secured
				App.myAccounts.points10();
			} else if(e.detail.kills.killed != App.scene.playerCollisonBox.position.netObjId) {
				notify.show(`${e.detail.kills.killer} kills  ${e.detail.kills.killed}`)
			}
		}
	})

	App.lastHit = {};
	App.hitAllowedList = [
		"CUBE"
	];
	App.hitPassiveList = [
		"mapobjsgroup_5_10",
		"collisionBox",
		"mapobjsgroup_10_4",
		"mapobjsgroup_3_4"
	];

	App.getHitAllowedList = (checkName) => {
		var l = false;
		App.hitAllowedList.forEach((item) => {
			if(checkName.indexOf(item) != -1) l = true;
		})
		return l;
	}

	App.getHitPassiveList = (checkName) => {
		var l = false;
		App.hitPassiveList.forEach((item) => {
			if(checkName.indexOf(item) != -1) l = true;
		})
		return l;
	}

	var preventFlagDouble = false;
	addEventListener('ray.hit.event', (ev) => {
		// console.log(`%cYou shoot the object: ${ev.detail.hitObject.name}`, REDLOG);
		// mapobjsgroup_10_4
		if(App.getHitPassiveList(ev.detail.hitObject.name) == true) {
			// player case
			console.log(`%cYou shoot passive list: ${ev.detail.hitObject.name}`, REDLOG);
			return;
		} else if(ev.detail.hitObject.name.indexOf('con_') == -1 &&
			App.getHitAllowedList(ev.detail.hitObject.name) == true) {
			// console.log('..ray hit..', ev.detail.hitObject.physics.currentBody)
			console.log(`%cYou shoot allowed list: ${ev.detail.hitObject.name}`, REDLOG);
			// App.lastHit = ev.detail.hitObject.physics.currentBody;
			// if(App.lastHit) App.lastHit.velocity.set(5, 5, 30)
			ev.detail.hitObject.physics.currentBody.velocity.set(5, 5, 30)
		}

		if(preventFlagDouble == false) {
			preventFlagDouble = true;
			setTimeout(() => {
				preventFlagDouble = false;
			}, 100)
		} else {
			return;
		}

		notify.error(`Nice shoot`)
		if(ev.detail.hitObject.LightsData) {
			ev.detail.hitObject.LightsData.ambientLight.set(
				randomFloatFromTo(0, 2), randomFloatFromTo(0, 2), randomFloatFromTo(0, 2));
		}
		matrixEngine.Engine.net.connection.send({
			damage: {
				from: matrixEngine.Engine.net.connection.connectionId,
				to: ev.detail.hitObject.name
			}
		});
	})

	// Load obj seq animation
	const createObjSequence = (objName) => {
		let preventDoubleJump = null;
		function onLoadObj(meshes) {
			for(let key in meshes) {
				matrixEngine.objLoader.initMeshBuffers(world.GL.gl, meshes[key]);
			}
			var textuteImageSamplers2 = {
				source: ["res/bvh-skeletal-base/swat-guy/gun2.png"],
				mix_operation: "multiply"
			};
			var animArg = {
				id: objName,
				meshList: meshes,
				currentAni: 0,
				animations: {
					active: 'walk',
					walk: {
						from: 0,
						to: 20,
						speed: 3
					}
				}
			};
			// WEAPON
			world.Add("obj", 1, objName, textuteImageSamplers2, meshes['player']);
			App.scene.player.position.setPosition(0.5, -0.7, -3);
			App.scene.player.isHUD = true;
			// Fix object orientation - this can be fixed also in blender.
			matrixEngine.Events.camera.yaw = 0;
			// Not in use but can be used
			function bodiesAreInContact(bodyA, bodyB) {
				for(var i = 0;i < world.contacts.length;i++) {
					var c = world.contacts[i];
					if((c.bi === bodyA && c.bj === bodyB) || (c.bi === bodyB && c.bj === bodyA)) {
						return true;
					}
				}
				return false;
			}
			// Add collision cube to the local player.
			world.Add("cube", 0.2, "playerCollisonBox");
			var collisionBox = new CANNON.Body({
				mass: 7,
				linearDamping: 0.01,
				position: new CANNON.Vec3(-50, 24, 0),
				shape: new CANNON.Box(new CANNON.Vec3(1.75, 1.75, 2))
			});
			// This is custom param added.
			collisionBox._name = 'collisionBox';
			physics.world.addBody(collisionBox);
			App.scene.playerCollisonBox.physics.currentBody = collisionBox;
			App.scene.playerCollisonBox.physics.enabled = true;
			App.scene.playerCollisonBox.physics.currentBody.fixedRotation = true;
			App.scene.playerCollisonBox.physics.currentBody.updateMassProperties();
			App.scene.playerCollisonBox.geometry.setScale(0.02);
			App.scene.playerCollisonBox.glBlend.blendEnabled = true;
			App.scene.playerCollisonBox.glBlend.blendParamSrc = ENUMERATORS.glBlend.param[0];
			App.scene.playerCollisonBox.glBlend.blendParamDest = ENUMERATORS.glBlend.param[0];
			App.scene.playerCollisonBox.visible = false;
			// Test custom flag for collide moment
			App.scene.playerCollisonBox.iamInCollideRegime = false;
			// simple logic but also not perfect
			App.scene.playerCollisonBox.pingpong = true;
			var preventDoubleTrigger = null;

			if(isMobile() == true) {
				byId('mobSpace').addEventListener('touchstart', (e) => {
					// Jump
					if(preventDoubleJump == null) {
						preventDoubleJump = setTimeout(() => {
							App.scene.playerCollisonBox.physics.currentBody.mass = 1;
							App.scene.playerCollisonBox.physics.currentBody.velocity.set(0, 0, 25);
							// preventDoubleJump = null; for ever
						}, 250);
					}
				})
			} else {
				// Matrix-engine key event DESKTOP
				addEventListener('hit.keyDown', (e) => {
					// Jump

					if(e.detail.keyCode == 32) {
						if(preventDoubleJump == null) {
							console.log('TEST 1 JUMP')
							preventDoubleJump = setTimeout(() => {
								console.log('JUMP: ', e.detail.keyCode);
								App.scene.playerCollisonBox.physics.currentBody.mass = 1;
								App.scene.playerCollisonBox.physics.currentBody.velocity.set(0, 0, 25);
								// preventDoubleJump = null; for ever
							}, 250);
						}
					}
				})
			}

			collisionBox.addEventListener("collide", function(e) {
				// const contactNormal = new CANNON.Vec3();
				// var relativeVelocity = e.contact.getImpactVelocityAlongNormal();
				// preventDoubleJump = null;
				// console.log("[", e.contact.bi._name, "][", e.contact.bj._name);
				if((e.contact.bj._name && e.contact.bj._name.indexOf('floor') != -1 ||
					e.contact.bi._name && e.contact.bi._name.indexOf('floor') != -1) ||
					(e.contact.si._name && e.contact.si._name.indexOf('floor') != -1 ||
						e.contact.sj._name && e.contact.sj._name.indexOf('floor') != -1)) {
					preventDoubleJump = null;
					console.log("[", e.contact.bi._name, "][", e.contact.bj._name + " sJ:" + e.contact.sj._name + " ss " + e.contact.si._name);
					return;
				}
				// Procedure for trigerering is manual for now.
				if(e.contact.bj._name == 'TRIGER-BOX1' || e.contact.bi._name == 'TRIGER-BOX1') {
					if(preventDoubleTrigger == null) {
						preventDoubleTrigger = setTimeout(() => {
							App.myCustomEnvItems.door1.openDoor()
							setTimeout(() => {
								clearTimeout(preventDoubleTrigger)
								preventDoubleTrigger = null;
								App.myCustomEnvItems.door1.closeDoor()
							}, 6000)
						}, 1000)
					}
					console.log("TrigerAction[door1]:")
					return;
				}
				if(e.contact.bi._name == 'damage') {
					console.log("Trigger damage!");
					//. 4x fix
					App.scene.player.energy.value -= (0.25 - (App.scene.player.items.armor ? App.scene.player.items.armor.preventDamage : 0));
					App.scene.player.updateEnergy(App.scene.player.energy.value);
				}

				if(e.contact.bj._name == 'item-armor' || e.contact.bi._name == 'item-armor') {
					console.log("Trigger armor:", e.contact);
					// Make some enery restore
					App.scene.player.energy.value += 0.25;
					App.scene.player.updateEnergy(App.scene.player.energy.value);
					App.scene.player.items.armor = {
						preventDamage: 0.15
					}

					if(App.scene['armor']) {
						App.scene['armor'].physics.enabled = false;
						App.scene['armor'].isHUD = true;
						App.scene.armor.position.setPosition(1.2, 1.1, -3);
						App.scene.armor.mesh.setScale(0.1)
						// Can be destroyed also App.scene['armor'].selfDestroy(1)
					}
					if(e.body._name == 'item-armor') {
						console.log("Trigger armor collect!");
						physics.world.removeBody(e.body);
					}
				}
			});

			var handlerTimeout = null, handlerTimeout2 = null;
			var playerUpdater = {
				sendRotEvery: 5,
				sendRotValue: 0,
				UPDATE: () => {
					var detPitch;
					var limit = 2;
					if(matrixEngine.Events.camera.pitch < limit &&
						matrixEngine.Events.camera.pitch > -limit) {
						detPitch = matrixEngine.Events.camera.pitch * 2;
					} else if(matrixEngine.Events.camera.pitch > limit) {
						detPitch = limit * 2;
					} else if(matrixEngine.Events.camera.pitch < -(limit + 2)) {
						detPitch = -(limit + 2) * 2;
					}

					handlerTimeout = null;
					// Make more stable situation
					App.scene.playerCollisonBox.physics.currentBody.mass = 10;
					App.scene.playerCollisonBox.physics.currentBody.quaternion.setFromEuler(0, 0, 0);
					// Cannonjs object set Switched  Z - Y
					if(App.scene.playerCollisonBox.pingpong == true) {
						matrixEngine.Events.camera.xPos = App.scene.playerCollisonBox.physics.currentBody.position.x;
						matrixEngine.Events.camera.zPos = App.scene.playerCollisonBox.physics.currentBody.position.y;
						matrixEngine.Events.camera.yPos = App.scene.playerCollisonBox.physics.currentBody.position.z;
						App.scene.playerCollisonBox.pingpong = false;
					} else {
						handlerTimeout2 = 0;
						App.scene.playerCollisonBox.
							physics.currentBody.position.set(
								matrixEngine.Events.camera.xPos,
								matrixEngine.Events.camera.zPos,
								matrixEngine.Events.camera.yPos);
						App.scene.playerCollisonBox.pingpong = true;
					}
					// Player Look
					if(playerUpdater.sendRotValue > playerUpdater.sendRotEvery &&
						matrixEngine.Engine.net.connection != null) {

						if(typeof App.scene.playerCollisonBox === undefined) {return;}

						if(App.scene.playerCollisonBox.position.nameUniq == App.scene.playerCollisonBox.position.netObjId) {
							console.log('NOT READY - MOBILE ALREADY IN SCENE MOMENT BUG')
							return;
						}

						matrixEngine.Engine.net.connection.send({
							netRot: {y: matrixEngine.Events.camera.yaw + 180},
							netObjId: App.scene.playerCollisonBox.position.netObjId,
						})

						playerUpdater.sendRotValue = 0;
					}
					playerUpdater.sendRotValue++;
				}
			};
			App.updateBeforeDraw.push(playerUpdater);
			// Player Energy status
			App.scene.player.energy = {};
			// Collector for items
			App.scene.player.items = {};
			for(let key in App.scene.player.meshList) {
				App.scene.player.meshList[key].setScale(1.85);
			}
			// Target scene object
			var texTarget = {
				source: [
					"res/bvh-skeletal-base/swat-guy/target.png",
					"res/bvh-skeletal-base/swat-guy/target.png"
				],
				mix_operation: "multiply",
			};

			world.Add("squareTex", 0.25, 'FPSTarget', texTarget);
			App.scene.FPSTarget.position.setPosition(0, 0, -4);
			App.scene.FPSTarget.glBlend.blendEnabled = true;
			App.scene.FPSTarget.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
			App.scene.FPSTarget.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
			App.scene.FPSTarget.isHUD = true;
			App.scene.FPSTarget.geometry.setScale(0.1);

			// Energy active bar - Custom generic textures. Micro Drawing.
			// Example for arg shema square for now only.
			var options = {
				squareShema: [8, 8],
				pixels: new Uint8Array(8 * 8 * 4)
			};
			// options.pixels.fill(0);
			App.scene.player.energy.value = 8;
			App.scene.player.updateEnergy = function(v) {
				this.energy.value = v;
				var t = App.scene.energyBar.preparePixelsTex(App.scene.energyBar.specialValue);
				App.scene.energyBar.textures.pop()
				App.scene.energyBar.textures.push(App.scene.energyBar.createPixelsTex(t));
				if(this.energy.value <= 0) {
					notify.error("YOU DIE...")
				}
			};

			function preparePixelsTex(options) {
				var I = 0, R = 0, G = 0, B = 0, localCounter = 0;
				for(var funny = 0;funny < 8 * 8 * 4;funny += 4) {
					if(localCounter > 7) {
						localCounter = 0;
					}
					if(localCounter < App.scene.player.energy.value) {
						I = 128;
						if(App.scene.player.energy.value < 3) {
							R = 255;
							G = 0;
							B = 0;
							I = 0;
						} else if(App.scene.player.energy.value > 2 && App.scene.player.energy.value < 5) {
							R = 255;
							G = 255;
							B = 0;
						} else {
							R = 0;
							G = 255;
							B = 0;
						}
					} else {
						I = 0;
						R = 0;
						G = 0;
						B = 0;
					}
					options.pixels[funny] = R;
					options.pixels[funny + 1] = G;
					options.pixels[funny + 2] = B;
					options.pixels[funny + 3] = 0;
					localCounter++;
				}
				return options;
			}

			var tex2 = {
				source: ["res/images/hud/energy-bar.png", "res/images/hud/energy-bar.png"],
				mix_operation: "multiply",
			};

			world.Add("squareTex", 1, 'energyBar', tex2);
			App.scene.energyBar.glBlend.blendEnabled = true;
			App.scene.energyBar.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
			App.scene.energyBar.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
			App.scene.energyBar.isHUD = true;
			// App.scene.energy.visible = false;
			App.scene.energyBar.position.setPosition(0, 1.1, -3);
			App.scene.energyBar.geometry.setScaleByX(1)
			App.scene.energyBar.geometry.setScaleByY(0.05)
			App.scene.energyBar.preparePixelsTex = preparePixelsTex;
			options = preparePixelsTex(options);
			App.scene.energyBar.textures.push(App.scene.energyBar.createPixelsTex(options));
			App.scene.energyBar.specialValue = options;
		}

		matrixEngine.objLoader.downloadMeshes({player: "res/bvh-skeletal-base/swat-guy/gun2.obj"},
			onLoadObj
		);
	};

	let promiseAllGenerated = [];

	const objGenerator = (n) => {
		var texStone = {
			source: [
				"res/images/RustPaint.jpg",
				"res/images/old-tex/floor.gif"
			],
			mix_operation: "multiply",
		};

		for(var j = 0;j < n;j++) {
			promiseAllGenerated.push(new Promise((resolve) => {
				function fixAsync(j_) {
					setTimeout(() => {
						var gname = "CUBE" + j_;
						var gscale = 3;
						world.Add("cubeLightTex", 1, gname, texStone);
						var b2 = new CANNON.Body({
							mass: 0.5,
							linearDamping: 0.01,
							position: new CANNON.Vec3(-10, 14.5, 15),
							shape: new CANNON.Box(new CANNON.Vec3(gscale, gscale, gscale))
						});
						physics.world.addBody(b2);
						App.scene[gname].physics.currentBody = b2;
						App.scene[gname].physics.enabled = true;
						App.scene[gname].activateShadows('spot-shadow')
						App.scene[gname].geometry.setScale(gscale)

						App.scene[gname].shadows.activeUpdate()
						App.scene[gname].shadows.animatePositionY()
						resolve();
					}, 1000 * j_);
				}
				fixAsync(j)
			}));
		}
	}

	objGenerator(10);

	createObjSequence('player');

	// Promise.all(promiseAllGenerated).then((what) => {
	// 	// console.info(`Waiting for runtime generation of scene objects,
	// 	//               then swap scene array index for scene draw-index -> 
	// 	//               must be manual setup for now!`, what);
	// 	// swap(5, 19, matrixEngine.matrixWorld.world.contentList);
	// 	// console.log('promise all')
	// });
	// Add ground for physics bodies.
	var tex = {
		source: ["res/images/old-tex/floor.gif"],
		mix_operation: "multiply",
		// params: {
		// 	TEXTURE_MAG_FILTER: world.GL.gl.NEAREST,
		// 	TEXTURE_MIN_FILTER: world.GL.gl.LINEAR_MIPMAP_NEAREST
		// }
	};

	var texNoMipmap = {
		source: [
			"res/images/RustPaint.jpg",
		],
		mix_operation: "multiply",
		params: {
			TEXTURE_MAG_FILTER: world.GL.gl.NEAREST,
			TEXTURE_MIN_FILTER: world.GL.gl.NEAREST
		}
	};

	// Load Physics world.
	let gravityVector = [0, 0, -29.82];
	let physics = world.loadPhysics(gravityVector);
	// Add ground - mass == 0 makes the body static
	var groundBody = new CANNON.Body({
		mass: 0,
		position: new CANNON.Vec3(0, -15, -2)
	});
	var groundShape = new CANNON.Plane();
	groundBody.addShape(groundShape);
	groundBody._name = 'floor';
	physics.world.addBody(groundBody);
	// Matrix engine visual scene object
	world.Add("squareTex", 1, "FLOOR_STATIC", tex);
	App.scene.FLOOR_STATIC.geometry.setScaleByX(500);
	App.scene.FLOOR_STATIC.geometry.setScaleByY(550);
	App.scene.FLOOR_STATIC.position.SetY(-2);
	App.scene.FLOOR_STATIC.position.SetZ(-15);
	App.scene.FLOOR_STATIC.rotation.rotx = 90;
	App.scene.FLOOR_STATIC.geometry.setTexCoordScaleFactor(40);
	// Target x-ray AIM
	// See through the objects.
	// In webGL context it is object how was drawn before others.
	var texTarget = {
		source: [
			"res/bvh-skeletal-base/swat-guy/target-night.png"
		],
		mix_operation: "multiply",
	};
	world.Add("squareTex", 0.18, 'xrayTarget', texTarget);
	App.scene.xrayTarget.glBlend.blendEnabled = true;
	App.scene.xrayTarget.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
	App.scene.xrayTarget.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
	App.scene.xrayTarget.isHUD = true;
	App.scene.xrayTarget.visible = false;
	App.scene.xrayTarget.position.setPosition(-0.3, 0.27, -4);
	// Energy
	var tex1 = {
		source: ["res/images/hud/energy.png"],
		mix_operation: "multiply",
	};
	world.Add("squareTex", 0.5, 'energy', tex1);
	App.scene.energy.glBlend.blendEnabled = true;
	App.scene.energy.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
	App.scene.energy.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
	App.scene.energy.isHUD = true;
	// App.scene.energy.visible = false;
	App.scene.energy.position.setPosition(-1, 1.15, -3);
	App.scene.energy.geometry.setScaleByX(0.35)
	App.scene.energy.geometry.setScaleByY(0.1)
	// good for fix rotation in future
	// world.Add("cubeLightTex", 2, "FLOOR2", tex);
	// var b2 = new CANNON.Body({
	// 	mass: 0,
	// 	linearDamping: 0.01,
	// 	position: new CANNON.Vec3(0, -14.5, -2),
	// 	shape: new CANNON.Box(new CANNON.Vec3(2, 2, 2))
	// });
	// physics.world.addBody(b2);
	// App.scene['FLOOR2'].position.setPosition(0, -2, -14.5)
	// // App.scene['FLOOR2'].geometry.setScaleByX(3);
	// App.scene['FLOOR2'].physics.currentBody = b2;
	// App.scene['FLOOR2'].physics.enabled = true;
	// App.scene.FLOOR2.LightsData.ambientLight.set(0, 0, 0)

	// world.Add("cubeLightTex", 2, "FLOOR3", tex);
	// var b3 = new CANNON.Body({
	// 	mass: 0,
	// 	linearDamping: 0.01,
	// 	position: new CANNON.Vec3(0, -19, 0),
	// 	shape: new CANNON.Box(new CANNON.Vec3(3, 3, 3))
	// });
	// physics.world.addBody(b3);
	// App.scene['FLOOR3'].position.setPosition(0, 0, -19)
	// App.scene['FLOOR3'].physics.currentBody = b3;
	// App.scene['FLOOR3'].physics.enabled = true;

	loadObj({
		name: "armor",
		path: "res/3d-objects/armor.obj",
		position: [-10, 0, -10],
		activeRotation: [0, 20, 0],
		rotation: [0, 0, 0],
		scale: 1.1,
		textures: ["res/images/armor.webp"],
		shadows: false,
		gamePlayItem: 'item-armor'
	})

	loadObj({
		name: "munition",
		path: "res/3d-objects/env/ammo.obj",
		position: [-10, 0, -20],
		activeRotation: [0, 20, 0],
		rotation: [0, 0, 0],
		scale: 1.1,
		textures: ["res/images/old-tex/sky3.gif"],
		shadows: false,
		gamePlayItem: 'item-munition'
	})

	// MAP LOADER

	if(localStorage.getItem('map') != null) {
		meMapLoader.load(map, physics);
		// var t = localStorage.getItem('map');
		// t = JSON.parse(t)
		// meMapLoader.load(t, physics);
	} else {
		meMapLoader.load(map, physics);
	}
	// window.meMapLoader = meMapLoader;

	// Access for doors for dev.
	App.myCustomEnvItems = {};
	App.myCustomEnvItems['door1'] = loadDoorsBVH(world, physics);

	// Big wall
	// world.Add("cubeLightTex", 5, "WALL_BLOCK", tex);
	// var b5 = new CANNON.Body({
	// 	mass: 0,
	// 	linearDamping: 0.01,
	// 	position: new CANNON.Vec3(10, -19, 0),
	// 	shape: new CANNON.Box(new CANNON.Vec3(5, 5, 5))
	// });
	// physics.world.addBody(b5);
	// App.scene['WALL_BLOCK'].position.setPosition(10, 0, -19)
	// App.scene['WALL_BLOCK'].physics.currentBody = b5;
	// App.scene['WALL_BLOCK'].physics.enabled = true;

	// Big wall CUSTOM SHADERS
	// world.Add("sphereLightTex", 1, "WALL_BLOCK2", texNoMipmap);
	// var b6 = new CANNON.Body({
	// 	mass: 0,
	// 	linearDamping: 0.01,
	// 	position: new CANNON.Vec3(30, -10, 0),
	// 	shape: new CANNON.Sphere(1) // new CANNON.Box(new CANNON.Vec3(5, 5, 5))
	// });
	// physics.world.addBody(b6);
	// App.scene['WALL_BLOCK2'].position.setPosition(30, -10, 19)
	// App.scene['WALL_BLOCK2'].physics.currentBody = b6;
	// App.scene['WALL_BLOCK2'].physics.enabled = true;

	// Networking
	addEventListener(`LOCAL-STREAM-READY`, (e) => {
		App.scene.playerCollisonBox.position.netObjId = e.detail.connection.connectionId;
		// console.log('LOCAL-STREAM-READY [app level] ', e.detail.streamManager.id)
		console.log(`%cLOCAL-STREAM-READY [app level] ${e.detail.connection.connectionId}`, REDLOG)
		// test first
		dispatchEvent(new CustomEvent(`onTitle`, {detail: `🕸️${e.detail.connection.connectionId}🕸️`}))
		notify.show(`Connected 🕸️${e.detail.connection.connectionId}🕸️`)
		var name = e.detail.connection.connectionId;
		// byId('netHeaderTitle').click()
		console.log('LOCAL-STREAM-READY [SETUP FAKE UNIQNAME POSITION] ', e.detail.connection.connectionId);
		// Make relation for net players
		App.scene.playerCollisonBox.position.yNetOffset = -2;
		App.scene.playerCollisonBox.net.enable = true;
		// CAMERA VIEW FOR SELF LOCAL CAM
		// world.Add("squareTex", 1, name, tex);
		// App.scene[name].position.x = 0;
		// App.scene[name].position.z = -20;
		// App.scene[name].LightsData.ambientLight.set(1, 0, 0);
		// App.scene[name].net.enable = true;
		// App.scene[name].streamTextures = matrixEngine.Engine.DOM_VT(byId(e.detail.streamManager.id))
	})

	var ONE_TIME = 0;
	addEventListener('streamPlaying', (e) => {
		if(ONE_TIME == 0) {
			ONE_TIME = 1;
			// console.log('REMOTE-STREAM- streamPlaying [app level] ', e.detail.target.videos[0]);
			// DIRECT REMOTE
			var name = e.detail.target.stream.connection.connectionId;
			// createNetworkPlayerCharacter(name)
			// App.scene[name].net.active = true;
			// matrixEngine.Engine.net.multiPlayer.init
			// App.scene[name].streamTextures = matrixEngine.Engine.DOM_VT(e.detail.target.videos[0].video)
		}
	})

	addEventListener('onStreamCreated', (e) => {
		if(matrixEngine.Engine.net.connection == null) {
			// local
			console.log('MY CONNECTION IS NULL')
			setTimeout(() => {
				// test
				if(typeof matrixEngine.Engine.net.connection === 'undefined' ||
					matrixEngine.Engine.net.connection == null) return;

				if(e.detail.event.stream.connection.connectionId != matrixEngine.Engine.net.connection.connectionId) {
					console.log('++ 2 sec++++++REMOTE-STREAM-READY [app level] ', e.detail.event.stream.connection.connectionId);
					var name = e.detail.event.stream.connection.connectionId;
					createNetworkPlayerCharacter(name)
				}
			}, 3000)
			return;
		}
		if(e.detail.event.stream.connection.connectionId != matrixEngine.Engine.net.connection.connectionId) {
			console.log('REMOTE-STREAM-READY [app level] ', e.detail.event.stream.connection.connectionId);
			var name = e.detail.event.stream.connection.connectionId;
			createNetworkPlayerCharacter(name)
		}
	})

	addEventListener('net-ready', (e) => {
		// Star on load
		byId('buttonCloseSession').remove();
		matrixEngine.Engine.net.joinSessionUI.click()
		createPauseScreen()
		// Next implementation RocketCrafringServer calls.
		let profile = document.createElement('div')
		profile.id = 'profile';
		profile.innerHTML = `
		  Status: free for all
		`;
		byId('session').appendChild(profile)

		let leaderboardBtn = document.createElement('div')
		leaderboardBtn.id = 'Leaderboard';
		leaderboardBtn.innerHTML = `
		  <button id="leaderboardBtn" class="btn">Leaderboard</button>
		`;
		byId('session').appendChild(leaderboardBtn)
		if(useRCSAccount == true) {
			App.myAccounts = new RCSAccount(RCSAccountDomain);
			App.myAccounts.createDOM();

			App.myAccounts.getLeaderboardFor3dContext()
			// notify.show("You can reg/login on GamePlay ROCK platform. Welcome my friends.")
			console.log(`%c<RocketCraftingServer [Account]> ${App.myAccounts}`, REDLOG);
		}
	})

	addEventListener('connectionDestroyed', (e) => {
		console.log(`%c connectionDestroyed  ${e.detail}`, REDLOG);
		if(App.scene[e.detail.connectionId] !== 'undefined' &&
			typeof e.detail.connectionId !== 'undefined') {
			try {
				App.scene[e.detail.connectionId].selfDestroy(1)
			} catch(err) {
				console.log('Old session user...')
			}
		}
	})

	// Graphics - Damage object test
	// WORKING
	// var textuteImageSamplers2 = {
	// 	source: ["res/bvh-skeletal-base/swat-guy/gun2.png"],
	// 	mix_operation: "multiply"
	// };

	// world.Add("cubeLightTex", 1, "floorAngle", textuteImageSamplers2);
	// const testCustomBody1 = new CANNON.Body({
	// 	shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.1)),
	// 	type: CANNON.Body.STATIC,
	// 	position: new CANNON.Vec3(0, 0, 0)
	// })
	// testCustomBody1.fixedRotation = true;
	// testCustomBody1.updateMassProperties();
	// physics.world.addBody(testCustomBody1);
	// App.scene.floorAngle.physics.currentBody = testCustomBody1;
	// App.scene.floorAngle.physics.enabled = true;
	// App.scene['floorAngle'].geometry.setScaleByX(15);
	// App.scene['floorAngle'].geometry.setScaleByZ(15);
	// App.scene['floorAngle'].geometry.setScaleByY(-0.9);
	// App.scene.floorAngle.physics.currentBody.quaternion.setFromEuler(5 * Math.PI/180,0,0)

	// world.Add("cubeLightTex", 1, "LAVA", tex1);
	// var lavaScale = 10;
	// var b4 = new CANNON.Body({
	// 	mass: 0,
	// 	linearDamping: 0.01,
	// 	position: new CANNON.Vec3(-6, -16.5, -1),
	// 	shape: new CANNON.Box(new CANNON.Vec3(lavaScale, lavaScale, lavaScale))
	// });
	// b4._name = 'damage';
	// physics.world.addBody(b4);
	// App.scene.LAVA.position.setPosition(-6, -1, -16.5)
	// App.scene.LAVA.geometry.setScale(lavaScale);
	// App.scene.LAVA.physics.currentBody = b4;
	// App.scene.LAVA.physics.enabled = true;
	// App.scene.LAVA.LightsData.ambientLight.set(0, 0, 0);
	// App.scene.LAVA.streamTextures = new matrixEngine.Engine.VT(
	// 	"res/video-texture/lava1.mkv"
	// );


	// TEST 2d custom canvas
	var banners = new Create2DBanner().then((canvas2d) => {
		console.log('BANNERS tex1', tex1)
		world.Add("squareTex", 1, "banner1", tex1);
		var lavaScale = 20;
		App.scene.banner1.position.setPosition(16, 25, -100)
		App.scene.banner1.rotation.roty = 180;
		App.scene.banner1.geometry.setScale(lavaScale);
		App.scene.banner1.LightsData.ambientLight.set(1, 1, 1);
		App.scene.banner1.streamTextures = {videoImage: canvas2d}
		App.scene.banner1.rotation.rotz = 180
	});

	// // How to load obj and give him gameplay item props
	// loadObj({
	// 	name: "armor",
	// 	path: "res/3d-objects/armor.obj",
	// 	position: [-10, 0, -10],
	// 	activeRotation: [0, 20, 0],
	// 	rotation: [0, 0, 0],
	// 	scale: 1.1,
	// 	textures: ["res/images/armor.png"],
	// 	shadows: false,
	// 	gamePlayItem: 'item-armor'
	// })

	// loadObj({
	// 	name: "munition",
	// 	path: "res/3d-objects/ammo.obj",
	// 	position: [-10, 0, -20],
	// 	activeRotation: [0, 20, 0],
	// 	rotation: [0, 0, 0],
	// 	scale: 1.1,
	// 	textures: ["res/images/normalmap.png"],
	// 	shadows: false,
	// 	gamePlayItem: 'item-munition'
	// })

	// Handler for obj
	function loadObj(n) {
		function onLoadObj(meshes) {
			var tex = {source: n.textures, mix_operation: "multiply"}
			for(let key in meshes) {
				matrixEngine.objLoader.initMeshBuffers(world.GL.gl, meshes[key])
				world.Add("obj", n.scale, n.name, tex, meshes[key]);
			}
			App.scene[n.name].position.x = n.position[0];
			App.scene[n.name].position.y = n.position[1];
			App.scene[n.name].position.z = n.position[2];
			App.scene[n.name].rotation.rotationSpeed.x = n.activeRotation[0];
			App.scene[n.name].rotation.rotationSpeed.y = n.activeRotation[1];
			App.scene[n.name].rotation.rotationSpeed.z = n.activeRotation[2];
			App.scene[n.name].rotation.rotx = n.rotation[0];
			App.scene[n.name].rotation.roty = n.rotation[1];
			App.scene[n.name].rotation.rotz = n.rotation[2];
			// App.scene[n.name].LightsData.ambientLight.set(1, 1, 1);
			App.scene[n.name].mesh.setScale(n.scale)
			var b44 = new CANNON.Body({
				mass: 0.1,
				linearDamping: 0.01,
				position: new CANNON.Vec3(n.position[0], n.position[2], n.position[1]),
				shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1))
			});
			// console.log('SET NAME _ ', n.gamePlayItem)
			b44._name = n.gamePlayItem;
			physics.world.addBody(b44);
			// App.scene.LAVA.geometry.setScaleByX(1);
			App.scene[n.name].physics.currentBody = b44;
			App.scene[n.name].physics.enabled = true;
			if(n.shadows == true) setTimeout(() => {
				App.scene[n.name].activateShadows('spot')
			}, 100)
		}
		var arg = {};
		arg[n.name] = n.path;
		matrixEngine.objLoader.downloadMeshes(arg, onLoadObj)
	}

	// Handler for obj
	function loadObjStatic(n) {
		function onLoadObjS(meshes) {
			var tex = {source: n.textures, mix_operation: "multiply"}
			for(let key in meshes) {
				matrixEngine.objLoader.initMeshBuffers(world.GL.gl, meshes[key])
				world.Add("obj", n.scale, n.name, tex, meshes[key]);
			}
			App.scene[n.name].position.x = n.position[0];
			App.scene[n.name].position.y = n.position[1];
			App.scene[n.name].position.z = n.position[2];
			// App.scene[n.name].rotation.rotationSpeed.x = n.activeRotation[0];
			// App.scene[n.name].rotation.rotationSpeed.y = n.activeRotation[1];
			// App.scene[n.name].rotation.rotationSpeed.z = n.activeRotation[2];
			App.scene[n.name].rotation.rotx = n.rotation[0];
			App.scene[n.name].rotation.roty = n.rotation[1];
			App.scene[n.name].rotation.rotz = n.rotation[2];
			// App.scene[n.name].LightsData.ambientLight.set(1, 1, 1);
			App.scene[n.name].mesh.setScale(n.scale)
			var b44 = new CANNON.Body({
				mass: n.mass,
				linearDamping: 0.01,
				position: new CANNON.Vec3(n.position[0], n.position[2], n.position[1]),
				shape: new CANNON.Box(new CANNON.Vec3(1, 2, 1))
			});
			b44._name = n.gamePlayItem;
			physics.world.addBody(b44);
			App.scene[n.name].physics.currentBody = b44;
			App.scene[n.name].physics.enabled = true;
			if(n.shadows == true) setTimeout(() => {
				App.scene[n.name].activateShadows('spot')
			}, 100)
		}
		var arg = {};
		arg[n.name] = n.path;
		matrixEngine.objLoader.downloadMeshes(arg, onLoadObjS)
	}

};


const createNetworkPlayerCharacter = (objName) => {
	if(typeof App.scene[objName] !== 'undefined') {
		console.log('Prevent double net player.')
		return;
	}
	function onLoadObj(meshes) {
		App.meshes = meshes;
		for(let key in meshes) {
			matrixEngine.objLoader.initMeshBuffers(matrixEngine.matrixWorld.world.GL.gl, meshes[key]);
		}

		var textuteImageSamplers2 = {
			source: ["res/bvh-skeletal-base/swat-guy/textures/Ch15_1001_Diffuse.webp",
				"res/bvh-skeletal-base/swat-guy/textures/Ch15_1001_Diffuse.webp"],
			mix_operation: "multiply"
		};

		setTimeout(function() {
			var animArg = {
				id: objName,
				meshList: meshes,
				// sumOfAniFrames: 61, No need if `animations` exist!
				currentAni: 0,
				// speed: 3, No need if `animations` exist!
				animations: {
					active: 'walk',
					walk: {
						from: 0,
						// to: 35,
						to: 20,
						speed: 3
					},
					walkPistol: {
						from: 36,
						to: 60,
						speed: 3
					}
				}
			};
			matrixEngine.matrixWorld.world.Add("obj", 1, objName,
				textuteImageSamplers2,
				meshes[objName],
				animArg
			);
			App.scene[objName].position.y = 2;
			App.scene[objName].position.z = 2;
			App.scene[objName].scaleAll(2.4)
		}, 1);
	}

	matrixEngine.objLoader.downloadMeshes(
		matrixEngine.objLoader.makeObjSeqArg({
			id: objName,
			path: "res/bvh-skeletal-base/swat-guy/seq-walk-pistol/low/swat-walk-pistol",
			from: 1,
			to: 20
		}),
		onLoadObj
	);
};