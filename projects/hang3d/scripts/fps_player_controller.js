
/**
 * @description Usage of raycaster, ObjectLoader Sequence,
 * FirstPersonController.
 * This will be part of new lib file `lib/controllers/fps.js`
 * 
 * Example API calls Usage:
 * 
 * - Deeply integrated to the top level scene object with name `player`.
 *   App.scene.player.updateEnergy(4);
 * Predefined from 0 to the 8 energy value.
 * 
 * @class First Person Shooter example
 */
import * as matrixEngine from "matrix-engine";
import * as CANNON from 'cannon';
import {createPauseScreen} from "./dom";

export var REDLOG = "background:black;color: lime;font-size:25px;text-shadow: 1px 1px 15px red, -4px -4px 15px orangered";

export var runHang3d = (world) => {

	addEventListener('onTitle', (e) => {
		document.title = e.detail
	})

	let notify = matrixEngine.utility.notify;
	let byId = matrixEngine.utility.byId;
	let ENUMERATORS = matrixEngine.utility.ENUMERATORS;
	let isMobile = matrixEngine.utility.isMobile;
	let randomFloatFromTo = matrixEngine.utility.randomFloatFromTo;
	let App = matrixEngine.App;
	setTimeout(() => document.querySelector('.button2').click(), 2000)

	// Camera
	canvas.style.cursor = 'none';
	App.camera.FirstPersonController = true;
	matrixEngine.Events.camera.fly = false;
	App.camera.speedAmp = 0.02;
	matrixEngine.Events.camera.yPos = 10;

	addEventListener('hit.keyDown', (e) => {
		if(e.detail.origin.key == "Escape" || e.detail.keyCode == 27) {
			console.log(`%cPAUSE SCREEN`, REDLOG)
			byId('pauseScreen').style.display = 'flex';
		}
	})

	// Audio effects
	App.sounds.createAudio('shoot', 'res/music/single-gunshot.mp3', 5);

	// Prevent right click context menu
	window.addEventListener("contextmenu", (e) => {e.preventDefault()});

	if(isMobile == true) matrixEngine.utility.createDomFPSController();

	// net
	matrixEngine.Engine.activateNet2(undefined,
		{
			sessionName: 'hang3d-matrix',
			resolution: '240x160'
		});

	// Override mouse up - example how to use
	App.events.CALCULATE_TOUCH_UP_OR_MOUSE_UP = () => {
		// console.log('TEST APP CLICK')
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

	// Override mouse down
	App.events.CALCULATE_TOUCH_DOWN_OR_MOUSE_DOWN = (ev, mouse) => {

		if(isMobile() == false) {
			// `checkingProcedure` gets secound optimal argument
			// for custom ray origin target.
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

		}

	};

	window.addEventListener('ray.hit.event', (ev) => {
		console.log("You shoot the object! Nice!", ev);
		// Physics force apply also change ambienty light.
		if(ev.detail.hitObject.physics.enabled == true) {
			// Shoot the object - apply force
			ev.detail.hitObject.physics.currentBody.force.set(2, 2, 50);
			// Apply random diff color
			if(ev.detail.hitObject.LightsData) ev.detail.hitObject.LightsData.ambientLight.set(
				randomFloatFromTo(0, 2), randomFloatFromTo(0, 2), randomFloatFromTo(0, 2));
		}
	});

	// Load obj seq animation
	const createObjSequence = (objName) => {

		let preventDoubleJump = null;

		function onLoadObj(meshes) {
			for(let key in meshes) {
				matrixEngine.objLoader.initMeshBuffers(world.GL.gl, meshes[key]);
			}

			var textuteImageSamplers2 = {
				source: [
					"res/bvh-skeletal-base/swat-guy/gun2.png"
				],
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
			// world.Add("obj", 1, objName, textuteImageSamplers2, meshes[objName], animArg);
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
				position: new CANNON.Vec3(0, 4, 0),
				shape: new CANNON.Box(new CANNON.Vec3(1, 1, 2))
			});

			// This is custom param added.
			collisionBox._name = 'collisionBox';
			physics.world.addBody(collisionBox);
			App.scene.playerCollisonBox.physics.currentBody = collisionBox;
			App.scene.playerCollisonBox.physics.enabled = true;
			App.scene.playerCollisonBox.physics.currentBody.fixedRotation = true;
			App.scene.playerCollisonBox.geometry.setScale(0.02);
			App.scene.playerCollisonBox.glBlend.blendEnabled = true;
			App.scene.playerCollisonBox.glBlend.blendParamSrc = ENUMERATORS.glBlend.param[0];
			App.scene.playerCollisonBox.glBlend.blendParamDest = ENUMERATORS.glBlend.param[0];
			App.scene.playerCollisonBox.visible = false;
			// App.scene.playerCollisonBox.net.enable = true;

			// Test custom flag for collide moment
			App.scene.playerCollisonBox.iamInCollideRegime = false;

			// simple logic but also not perfect
			App.scene.playerCollisonBox.pingpong = true;

			collisionBox.addEventListener("collide", function(e) {
				// const contactNormal = new CANNON.Vec3();
				// var relativeVelocity = e.contact.getImpactVelocityAlongNormal();
				// console.log("playerCollisonBox collide with", e);
				preventDoubleJump = null;

				if(e.contact.bj._name == 'floor' || e.contact.bi._name == 'floor') {
					preventDoubleJump = null;
					return;
				}

				// ?maybe
				// App.scene.playerCollisonBox.physics.currentBody.mass = 10;

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
						// Can be destroyed also 
						// App.scene['armor'].selfDestroy(1)
					}
					if(e.body._name == 'item-armor') {
						console.log("Trigger armor collect!");
						physics.world.removeBody(e.body);
					}
				}
			});


			// Matrix-engine key event
			addEventListener('hit.keyDown', (e) => {
				// Jump
				if(e.detail.keyCode == 32) {
					if(preventDoubleJump == null) {
						preventDoubleJump = setTimeout(() => {
							console.log('JUMP: ', e.detail.keyCode);
							App.scene.playerCollisonBox.physics.currentBody.mass = 1;
							App.scene.playerCollisonBox.physics.currentBody.velocity.set(0, 0, 25);
							// preventDoubleJump = null; for ever
						}, 250);
					}
				}

			});

			// nature of CALCULATE_TOUCH_MOVE_OR_MOUSE_MOVE is not for overriding. This is not uniform for matrix-engine
			// must be fixed and added help func for overriding (mousemove)
			// addEventListener('mousemove', () => {
			// })

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
					// Tamo tu iznad duge nebo zri...
					// Cannonjs object set
					// Switched  Z - Y
					// matrixEngine.Events.camera.yPos = App.scene.playerCollisonBox.physics.currentBody.position.z;
					// if(App.scene.playerCollisonBox.iamInCollideRegime === true) {
					if(App.scene.playerCollisonBox.pingpong == true) {
						// Cannonjs object set / Switched  Z - Y
						matrixEngine.Events.camera.xPos = App.scene.playerCollisonBox.physics.currentBody.position.x;
						matrixEngine.Events.camera.zPos = App.scene.playerCollisonBox.physics.currentBody.position.y;
						matrixEngine.Events.camera.yPos = App.scene.playerCollisonBox.physics.currentBody.position.z;
						App.scene.playerCollisonBox.pingpong = false;
					} else {
						handlerTimeout2 = 0;
						// Cannonjs object set - Switched  Z - Y
						App.scene.playerCollisonBox.
							physics.currentBody.position.set(
								matrixEngine.Events.camera.xPos,
								matrixEngine.Events.camera.zPos,
								matrixEngine.Events.camera.yPos);
						App.scene.playerCollisonBox.pingpong = true;
					}

					// Playe Look
					if(playerUpdater.sendRotValue > playerUpdater.sendRotEvery &&
						matrixEngine.Engine.net.connection != null) {

						if(typeof App.scene.playerCollisonBox.position.netObjId === undefined) {
							console.log('TEST undefined ')
							return;
						}
						matrixEngine.Engine.net.connection.send({
							netRot: {
								y: matrixEngine.Events.camera.yaw + 180
							},
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

			// Energy active bar
			// Custom generic textures. Micro Drawing.
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

		// 		// Must be activate - Use client default config file
		// matrixEngine.Engine.activateNet2(undefined,
		// 	{
		// 		sessionName: 'matrix-engine-shared-object',
		// 		resolution: '240x160'
		// 	});
		// App.scene.MyColoredSquare1.net.enable = true;
		// matrixEngine.objLoader.downloadMeshes(
		//   matrixEngine.objLoader.makeObjSeqArg(
		//     {
		//       id: objName,
		//       path: "res/bvh-skeletal-base/swat-guy/FPShooter-hands/FPShooter-hands",
		//       from: 1,
		//       to: 20
		//     }),
		//   onLoadObj
		// );
	};

	let promiseAllGenerated = [];

	const objGenerator = (n) => {
		var texStone = {
			source: [
				"res/images/n-stone.png",
			],
			mix_operation: "multiply",
		};

		for(var j = 0;j < n;j++) {
			promiseAllGenerated.push(new Promise((resolve) => {
				setTimeout(() => {
					world.Add("cubeLightTex", 1, "CUBE" + j, texStone);
					var b2 = new CANNON.Body({
						mass: 0.1,
						linearDamping: 0.01,
						position: new CANNON.Vec3(1, -14.5, 15),
						shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1))
					});
					physics.world.addBody(b2);
					App.scene['CUBE' + j].physics.currentBody = b2;
					App.scene['CUBE' + j].physics.enabled = true;
					resolve();
				}, 1000 * j);
			}));
		}
	}

	// objGenerator(2);

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
		source: ["res/images/diffuse.png"],
		mix_operation: "multiply",
		params: {
			TEXTURE_MAG_FILTER: world.GL.gl.NEAREST,
			TEXTURE_MIN_FILTER: world.GL.gl.LINEAR_MIPMAP_NEAREST
		}
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
	App.scene.FLOOR_STATIC.geometry.setScaleByX(200);
	App.scene.FLOOR_STATIC.geometry.setScaleByY(200);
	App.scene.FLOOR_STATIC.position.SetY(-2);
	App.scene.FLOOR_STATIC.position.SetZ(-15);
	App.scene.FLOOR_STATIC.rotation.rotx = 90;
	App.scene.FLOOR_STATIC.geometry.setTexCoordScaleFactor(20);
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
		source: [
			"res/images/hud/energy.png"
		],
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
	world.Add("cubeLightTex", 2, "FLOOR2", texNoMipmap);
	var b2 = new CANNON.Body({
		mass: 0,
		linearDamping: 0.01,
		position: new CANNON.Vec3(0, -14.5, -2),
		shape: new CANNON.Box(new CANNON.Vec3(2, 2, 2))
	});
	physics.world.addBody(b2);
	App.scene['FLOOR2'].position.setPosition(0, -2, -14.5)
	// App.scene['FLOOR2'].geometry.setScaleByX(3);
	App.scene['FLOOR2'].physics.currentBody = b2;
	App.scene['FLOOR2'].physics.enabled = true;

	world.Add("cubeLightTex", 2, "FLOOR3", texNoMipmap);
	var b3 = new CANNON.Body({
		mass: 0,
		linearDamping: 0.01,
		position: new CANNON.Vec3(0, -19, 0),
		shape: new CANNON.Box(new CANNON.Vec3(3, 3, 3))
	});
	physics.world.addBody(b3);
	App.scene['FLOOR3'].position.setPosition(0, 0, -19)
	App.scene['FLOOR3'].physics.currentBody = b3;
	App.scene['FLOOR3'].physics.enabled = true;

	// Big wall
	world.Add("cubeLightTex", 5, "WALL_BLOCK", texNoMipmap);
	var b5 = new CANNON.Body({
		mass: 0,
		linearDamping: 0.01,
		position: new CANNON.Vec3(10, -19, 0),
		shape: new CANNON.Box(new CANNON.Vec3(5, 5, 5))
	});
	physics.world.addBody(b5);
	App.scene['WALL_BLOCK'].position.setPosition(10, 0, -19)
	App.scene['WALL_BLOCK'].physics.currentBody = b5;
	App.scene['WALL_BLOCK'].physics.enabled = true;

	// Big wall CUSTOM SHADERS
	world.Add("sphereLightTex", 1, "WALL_BLOCK2", texNoMipmap);
	var b6 = new CANNON.Body({
		mass: 0,
		linearDamping: 0.01,
		position: new CANNON.Vec3(30, -10, 0),
		shape: new CANNON.Sphere(1) // new CANNON.Box(new CANNON.Vec3(5, 5, 5))
	});
	physics.world.addBody(b6);
	App.scene['WALL_BLOCK2'].position.setPosition(30, -10, 19)
	App.scene['WALL_BLOCK2'].physics.currentBody = b6;
	App.scene['WALL_BLOCK2'].physics.enabled = true;

	// Networking
	addEventListener(`LOCAL-STREAM-READY`, (e) => {
		// console.log('LOCAL-STREAM-READY [app level] ', e.detail.streamManager.id)
		console.log(`%cLOCAL-STREAM-READY [app level] ${e.detail.connection.connectionId}`, REDLOG)
		// test first
		dispatchEvent(new CustomEvent(`onTitle`, {detail: `🕸️${e.detail.connection.connectionId}🕸️`}))
		notify.show(`Connected 🕸️${e.detail.connection.connectionId}🕸️`)
		var name = e.detail.connection.connectionId;

		byId('netHeaderTitle').click()
		 console.log('LOCAL-STREAM-READY [SETUP FAKE UNIQNAME POSITION] ', e.detail.connection.connectionId);
		// Make relation for net players
		App.scene.playerCollisonBox.position.netObjId = e.detail.connection.connectionId;
		App.scene.playerCollisonBox.position.yNetOffset = -4
		;
		App.scene.playerCollisonBox.net.enable = true;
		// CAMERA VIEW FOR SELF LOCAL CAM
		// world.Add("squareTex", 1, name, tex);
		// App.scene[name].position.x = 0;
		// App.scene[name].position.z = -20;
		// App.scene[name].LightsData.ambientLight.set(1, 0, 0);
		// // App.scene[name].net.enable = true;
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
				if(e.detail.event.stream.connection.connectionId != matrixEngine.Engine.net.connection.connectionId) {
					console.log('++ 2 sec++++++REMOTE-STREAM-READY [app level] ', e.detail.event.stream.connection.connectionId);
					var name = e.detail.event.stream.connection.connectionId;
					createNetworkPlayerCharacter(name)
				}
			}, 2000)

			return;
		}
		if(e.detail.event.stream.connection.connectionId != matrixEngine.Engine.net.connection.connectionId) {
			console.log('++++++++REMOTE-STREAM-READY [app level] ', e.detail.event.stream.connection.connectionId);
			var name = e.detail.event.stream.connection.connectionId;
			createNetworkPlayerCharacter(name)
		}
	})

	addEventListener('net-ready', (e) => {
		// Star on load
		matrixEngine.Engine.net.joinSessionUI.click()
		createPauseScreen()
	})

	addEventListener('connectionDestroyed', (e) => {
		console.log(`%c connectionDestroyed  ${e.detail}`, REDLOG);
		// connectionId
		if(App.scene[e.detail.connectionId] !== 'undefined') App.scene[e.detail.connectionId].selfDestroy(1)
	})

	// Damage object test
	world.Add("cubeLightTex", 1, "LAVA", tex);
	var b4 = new CANNON.Body({
		mass: 0,
		linearDamping: 0.01,
		position: new CANNON.Vec3(-6, -16.5, -1),
		shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1))
	});
	b4._name = 'damage';
	physics.world.addBody(b4);
	App.scene.LAVA.position.setPosition(-6, -1, -16.5)
	// App.scene.LAVA.geometry.setScaleByX(1);
	App.scene.LAVA.physics.currentBody = b4;
	App.scene.LAVA.physics.enabled = true;
	App.scene.LAVA.LightsData.ambientLight.set(0, 0, 0);
	App.scene.LAVA.streamTextures = new matrixEngine.Engine.VT(
		"res/video-texture/lava1.mkv"
	);

	// How to load obj and give him gameplay item props
	loadObj({
		name: "armor",
		path: "res/3d-objects/armor.obj",
		position: [-10, 0, -10],
		activeRotation: [0, 20, 0],
		rotation: [0, 0, 0],
		scale: 1.1,
		textures: ["res/images/armor.png"],
		shadows: false,
		gamePlayItem: 'item-armor'
	})

	loadObj({
		name: "munition",
		path: "res/3d-objects/ammo.obj",
		position: [-10, 0, -20],
		activeRotation: [0, 20, 0],
		rotation: [0, 0, 0],
		scale: 1.1,
		textures: ["res/images/normalmap.png"],
		shadows: false,
		gamePlayItem: 'item-munition'
	})

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
			source: [
				"res/bvh-skeletal-base/swat-guy/textures/Ch15_1001_Diffuse.png",
				"res/bvh-skeletal-base/swat-guy/textures/Ch15_1001_Diffuse.png"
			],
			mix_operation: "multiply", // ENUM : multiply , divide
		};

		setTimeout(function() {
			var animArg = {
				id: objName,
				meshList: meshes,
				// sumOfAniFrames: 61, No need if `animations` exist!
				currentAni: 0,
				// speed: 3, No need if `animations` exist!
				// upgrade - optimal
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
			// From 2.0.14 only for obj seq -> scaleAll
			App.scene[objName].scaleAll(2.4)
		}, 1);
	}

	matrixEngine.objLoader.downloadMeshes(
		matrixEngine.objLoader.makeObjSeqArg(
			{
				id: objName,
				// path: "res/bvh-skeletal-base/swat-guy/anims/swat-multi",
				path: "res/bvh-skeletal-base/swat-guy/seq-walk-pistol/low/swat-walk-pistol",
				from: 1,
				// to: 61
				to: 20
			}),
		onLoadObj
	);

};