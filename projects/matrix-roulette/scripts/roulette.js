import * as matrixEngine from "matrix-engine"
import TableEvents from "./table-events.js"
import Wheel from "./wheel.js";
import * as CANNON from 'cannon';
import {Nidza} from 'nidza';
import {create2dHUD, createStatusBoxHUD, create2dHUDStatusLine} from "./2d-draw.js";
import {MTM} from 'matrix-engine-plugins';
import ClientConfig from "../client-config.js";
// import NUICommander from './nui.js';
import {byId} from "matrix-engine/lib/utility.js";
import {RCSAccount} from "./rocket-crafting-account.js";
import {REDLOG} from "./dom";
import {VideoChat} from "./video-chat.js";

export class MatrixRoulette {
	// General physics and ME world
	physics = null;
	world = null;
	// Gameplay staff
	tableBet = null;
	wheelSystem = null;
	preventDBTrigger = null;
	// Optimal - control switch with url param nui=true or undefined.
	NUI = null;

	useRCSAccount = true;
	RCSAccountDomain = 'https://maximumroulette.com';
	// Top level vars
	// - Initial line text
	// - Delay interval on winning number
	// - camera view bets/wheel
	// - status of matix roulette server
	status = {
		text: new MTM('WELCOME MY FRIEND!', {deltaRemove: 1, deltaFill: 40}),
		winNumberMomentDelay: 2000,
		cameraView: 'bets',
		game: 'MEDITATE'
	}

	videoChatEnabled() {
		if(typeof matrixEngine.utility.QueryString.chat == 'undefined' ||
			matrixEngine.utility.QueryString.chat == 'false') {
			return false;
		} else {
			return true;
		}
	}

	constructor() {

		if(this.isManual() == false) {
			console.log('ServerEvent[maximumroulette.com/matrix-roulette]')
			const events = new EventSource('https://maximumroulette.com/matrix-roulette');
			events.onmessage = (event) => {
				const parsedData = JSON.parse(event.data);
				if(typeof parsedData.matrixRoulette === 'undefined') {return }
				console.log('[serverEvent:matrix-roulette]', parsedData.matrixRoulette.status)
				if(parsedData.matrixRoulette.status == "MEDITATE") {
					// 
					this.status.game = 'MEDITATE';
					dispatchEvent(new CustomEvent('MEDITATE_SERVER', {detail: parsedData.matrixRoulette.counter}))
				} else if(parsedData.matrixRoulette.status == "RESULT") {
					// 
					this.status.game = 'RESULT';
					console.log('[serverEvent:matrix-roulette[win number]]', parsedData.matrixRoulette.winNumber)
				} else {
					alert()
				}
			};
			events.onerror = (event) => {
				console.log('ServerEvent Error:', event)
			};
		}

		// Player balance var
		this.playerInfo = {
			balance: 1000,
			currency: '$'
		};

		var App = matrixEngine.App;
		// dev only!
		window.App = App

		if(this.NUIEnabled() == true) {
			// top level/custom arg
			this.NUI = new NUICommander(this.isManual())
			byId('nui-commander-container').style.width = '640px';
			byId('nui-commander-container').style.height = '256px';
			// Who to constrol size - best keep it default 640x480
			// nui-commander must be upgraded.
			// this.NUI.nuiCommander.drawer.canvasDom.height = '320'
			// this.NUI.nuiCommander.drawer.canvasDom.width = '480'
			// byId('canvas-source').width = 320;
			// byId('canvas-source').height = 240;
			// byId('webcam').width = 320;
			// byId('webcam').height = 240;
			// byId('canvas-blended').width = 320;
			// byId('canvas-blended').height = 240;
		} else {
			if(byId('nui-commander-container')) byId('nui-commander-container').style.display = 'none';
		}

		// HTML5 fix audios etc.
		window.addEventListener('click', this.firstClick)

		// Matrix-engine staff
		this.world = matrixEngine.matrixWorld.world;
		App.camera.SceneController = true;
		App.camera.sceneControllerEdgeCameraYawRate = 0.0001;
		App.camera.speedAmp = 0.0001;

		// Add physics - ground and main instance of cannonjs
		this.preparePhysics()
		// Betting/Hovering/table screen/view
		this.tableBet = new TableEvents(this.physics)
		// Whole wheel system
		this.wheelSystem = new Wheel(this.physics)
		// Matrix-engine raycast
		this.attachMatrixRay()
		// Game-play Events
		this.attachGamePlayEvents()
		// nidza.js / 2d canvas small library
		// Text oriented - transformation also 3d context variant of components shader oriented.
		this.nidza = new Nidza();
		// First view
		this.setupCameraView('initbets')
		// Add canvas2d context to webgl
		this.addHUD(this.playerInfo)

		if(this.videoChatEnabled() == true) {
			console.log("Enable video-chat...")
			// Initial func for Networking general. Based on webRTC/MultiRTC lib.
			this.runVideoChat()
			// New net2
			// Activate networking
			// matrixEngine.Engine.activateNet2(undefined,
			// 	{
			// 		sessionName: 'matrix-roulette',
			// 		resolution: '240x160'
			// 	});
		}

		this.cameraInMove = false;

		if(this.soundsEnabled() == true) {
			matrixEngine.App.sounds.createAudio('background', 'res/audios/mellow_club_vibe-stargazer_jazz.mp3')
			matrixEngine.App.sounds.createAudio('chip', 'res/audios/chip.mp3', 3)
			matrixEngine.App.sounds.createAudio('spining', 'res/audios/spining.mp3')
			matrixEngine.App.sounds.createAudio('spiningEnd', 'res/audios/spining-end.mp3')
			matrixEngine.App.sounds.createAudio('error', 'res/audios/error.mp3')
			matrixEngine.App.sounds.createAudio('clear', 'res/audios/clear.mp3', 2)
			matrixEngine.App.sounds.audios.background.loop = true
			let testAutoPlay = matrixEngine.App.sounds.audios.background.play();
			testAutoPlay.catch((err) => {})
		}

		if(this.isManual() == true) dispatchEvent(new CustomEvent('SET_STATUSBOX_TEXT', {detail: 'manual'}))
		if(this.serverGiveResults() == true) dispatchEvent(new CustomEvent('SET_STATUSBOX_TEXT', {detail: 'server'}))

		App.scene.FLOOR_STATIC.position.SetY(-2);
	}

	firstClick = (e) => {
		if(this.soundsEnabled() == true) {
			matrixEngine.App.sounds.audios.background.play()
			matrixEngine.App.sounds.audios.background.loop = true;
		}
		removeEventListener('click', this.firstClick)
	}

	setupCameraView(type) {
		var AMP = 0.05;
		if(typeof matrixEngine.utility.QueryString.cameraSpeed == 'undefined' ||
			matrixEngine.utility.QueryString.cameraSpeed == null) {
			// nothing for now
		} else {
			if(isNaN(parseFloat(matrixEngine.utility.QueryString.cameraSpeed)) == false) {
				AMP = matrixEngine.utility.QueryString.cameraSpeed;
			}
		}

		// let OSC = matrixEngine.utility.OSCILLATOR;
		if(type == this.status.cameraView) return;
		if(type == 'bets' && this.cameraInMove == false) {

			this.cameraInMove = true;
			// Disable user access to the camera
			// App.camera.SceneController = false;

			var c0 = new matrixEngine.utility.OSCILLATOR(-matrixEngine.Events.camera.pitch, 54.970000000000034, AMP)
			var c1 = new matrixEngine.utility.OSCILLATOR(matrixEngine.Events.camera.zPos, 11.526822219793473, AMP)
			// trick OSC when min > max! There exist better OSCILLATOR from nidza lib.
			var c2 = new matrixEngine.utility.OSCILLATOR(-matrixEngine.Events.camera.yPos, -7.49717201776934, AMP)

			this.internal_flag = 0;
			this.flagc0 = false;
			this.flagc1 = false;
			this.flagc2 = false;

			c0.on_maximum_value = () => {
				this.status.cameraView = 'bets'
				this.internal_flag++;
				this.flagc0 = true;
				if(this.internal_flag == 3) {
					clearInterval(this.c0i)
					this.c0i = null;
					this.cameraInMove = false;
					dispatchEvent(new CustomEvent('camera-view-wheel', {detail: {}}))
				}
			}
			c1.on_maximum_value = () => {
				this.status.cameraView = 'bets'
				this.internal_flag++;
				this.flagc1 = true;
				if(this.internal_flag == 3) {
					clearInterval(this.c0i)
					this.c0i = null;
					this.cameraInMove = false;
					dispatchEvent(new CustomEvent('camera-view-bets', {detail: {}}))
				}
			}
			c2.on_maximum_value = () => {
				this.status.cameraView = 'bets'
				this.internal_flag++;
				this.flagc2 = true;
				if(this.internal_flag == 3) {
					clearInterval(this.c0i)
					this.c0i = null;
					this.cameraInMove = false;
					dispatchEvent(new CustomEvent('camera-view-bets', {detail: {}}))
				}
			}

			this.c0i = setInterval(() => {
				if(this.flagc0 == false) {matrixEngine.Events.camera.pitch = -c0.UPDATE()}
				if(this.flagc1 == false) {matrixEngine.Events.camera.zPos = c1.UPDATE()}
				if(this.flagc2 == false) {matrixEngine.Events.camera.yPos = -c2.UPDATE()}
			}, 1)

		} else if(type == 'wheel' && this.cameraInMove == false) {

			this.cameraInMove = true;
			// Disable user access to the camera
			// App.camera.SceneController = false;
			// trick OSC when min > max - OSCILLATOR from matrix engine utility must be upgraded...
			var c0 = new matrixEngine.utility.OSCILLATOR(matrixEngine.Events.camera.pitch, -52.970000000000034, AMP)
			var c1 = new matrixEngine.utility.OSCILLATOR(-matrixEngine.Events.camera.zPos, 4.6962394866880635, AMP)
			var c2 = new matrixEngine.utility.OSCILLATOR(matrixEngine.Events.camera.yPos, 19.500000000000007, AMP)
			this.internal_flag = 0;
			this.flagc0 = false;
			this.flagc1 = false;
			this.flagc2 = false;

			c0.on_maximum_value = () => {
				this.status.cameraView = 'wheel'
				this.internal_flag++;
				this.flagc0 = true;
				if(this.internal_flag == 3) {
					clearInterval(this.c0i)
					this.c0i = null;
					this.cameraInMove = false;
					dispatchEvent(new CustomEvent('camera-view-wheel', {detail: {}}))
				}
			}
			c1.on_maximum_value = () => {
				this.status.cameraView = 'wheel'
				this.internal_flag++;
				this.flagc1 = true;
				if(this.internal_flag == 3) {
					clearInterval(this.c0i)
					this.c0i = null;
					this.cameraInMove = false;
					dispatchEvent(new CustomEvent('camera-view-wheel', {detail: {}}))
				}
			}
			c2.on_maximum_value = () => {
				this.status.cameraView = 'wheel'
				this.internal_flag++;
				this.flagc2 = true;
				if(this.internal_flag == 3) {
					clearInterval(this.c0i)
					this.c0i = null;
					this.cameraInMove = false;
					dispatchEvent(new CustomEvent('camera-view-wheel', {detail: {}}))
				}
			}

			this.c0i = setInterval(() => {
				if(this.flagc0 == false) {
					matrixEngine.Events.camera.pitch = c0.UPDATE()
				}
				if(this.flagc1 == false) {
					matrixEngine.Events.camera.zPos = -c1.UPDATE()
				}
				if(this.flagc2 == false) {
					matrixEngine.Events.camera.yPos = c2.UPDATE()
				}
			}, 1)
		} else {
			// bets default
			if(this.cameraInMove == true) return;
			matrixEngine.Events.camera.pitch = -54.970000000000034
			matrixEngine.Events.camera.zPos = 11.526822219793473
			matrixEngine.Events.camera.yPos = 7.49717201776934

		}
	}

	runVideoChat() {
		// DEPLACE OLD NET
		// Sending class reference `ClientConfig` not object/instance
		// matrixEngine.Engine.activateNet(ClientConfig)

		// New net2
		// Activate networking
		matrixEngine.Engine.activateNet2(undefined,
			{
				sessionName: 'matrix-roulette',
				resolution: '240x160'
			});

		var tex = {
			source: ["res/images/field.png"],
			mix_operation: "multiply"
		}

		// Networking
		addEventListener(`LOCAL-STREAM-READY`, (e) => {
			// App.scene.playerCollisonBox.position.netObjId = e.detail.connection.connectionId;
			// console.log('LOCAL-STREAM-READY [app level] ', e.detail.streamManager.id)
			console.log(`%cLOCAL-STREAM-READY [app level] ${e.detail.connection.connectionId}`, REDLOG)
			// test first
			dispatchEvent(new CustomEvent(`onTitle`, {detail: `🕸️${e.detail.connection.connectionId}🕸️`}))
			matrixEngine.utility.notify.show(`Connected 🕸️${e.detail.connection.connectionId}🕸️`)
			var name = e.detail.connection.connectionId;
			// byId('netHeaderTitle').click()
			console.log('LOCAL-STREAM-READY [SETUP FAKE UNIQNAME POSITION] ', e.detail.connection.connectionId);
			// Make relation for net players

			// App.scene.playerCollisonBox.position.yNetOffset = -2;
			// App.scene.playerCollisonBox.net.enable = true;

			// CAMERA VIEW FOR SELF LOCAL CAM
			// world.Add("squareTex", 1, name, tex);
			// App.scene[name].position.x = 0;
			// App.scene[name].position.z = -20;
			// App.scene[name].LightsData.ambientLight.set(1, 0, 0);
			// App.scene[name].net.enable = true;
			// App.scene[name].streamTextures = matrixEngine.Engine.DOM_VT(byId(e.detail.streamManager.id))

			let test = new VideoChat(byId(e.detail.streamManager.id))
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
						// createNetworkPlayerCharacter(name)
					}
				}, 3000)
				return;
			}
			if(e.detail.event.stream.connection.connectionId != matrixEngine.Engine.net.connection.connectionId) {
				console.log('REMOTE-STREAM-READY [app level] ', e.detail.event.stream.connection.connectionId);
				var name = e.detail.event.stream.connection.connectionId;
				// createNetworkPlayerCharacter(name)
			}
		})

		addEventListener('net-ready', (e) => {
			// Star on load
			byId('buttonCloseSession').remove();
			matrixEngine.Engine.net.joinSessionUI.click()
			// createPauseScreen()
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
			if(this.useRCSAccount == true) {
				App.myAccounts = new RCSAccount(this.RCSAccountDomain);
				App.myAccounts.createDOM();

				App.myAccounts.getLeaderboardFor3dContext()
				// notify.show("You can reg/login on GamePlay ROCK platform. Welcome my friends.")
				console.log(`%c<RocketCraftingServer [Account]> ${App.myAccounts}`, REDLOG);
			}

			matrixEngine.utility.byId('matrix-net').style.overflow = 'hidden';
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




		// ---------------------------------------

		// addEventListener('stream-loaded', (e) => {
		// 	// Safe place for access socket io
		// 	// 'STATUS_MR' Event is only used for Matrix Roulette
		// 	// It is symbolic for now - results must fake physics to preview right number.
		// 	App.network.connection.socket.on('STATUS_MR', (e) => {
		// 		if(e.message == 'RESULTS') {
		// 			console.log('tick-> ', e.message)
		// 			console.log('winNumber-> ', e.winNumber)
		// 			dispatchEvent(new CustomEvent('RESULTS_FROM_SERVER', {detail: e.winNumber}))
		// 		} else {
		// 			// console.log('tick-> ', e.counter)
		// 			if(e.message == 'MEDITATE') dispatchEvent(new CustomEvent('MEDITATE_SERVER', {detail: e.counter}))
		// 			if(e.message == 'RESULT') dispatchEvent(new CustomEvent('RESULT', {detail: e.counter}))
		// 		}
		// 	})

		// 	var _ = document.querySelectorAll('.media-box')
		// 	var name = "videochat_" + e.detail.data.userId;
		// 	_.forEach((i) => {
		// 		var name = "videochat_" + e.detail.data.userId;
		// 		if(e.detail.data.userId != App.network.connection.userid &&
		// 			App.scene[name] !== 'undefined' &&
		// 			sessionStorage.getItem('a_' + name) == null) {
		// 			sessionStorage.setItem('a_' + name, name)
		// 			// This is video element!
		// 			console.log("stream-loaded => ", name)
		// 			matrixEngine.matrixWorld.world.Add("squareTex", 3, name, tex);
		// 			console.log('App.network.connection.getAllParticipants().length => ' + App.network.connection.getAllParticipants().length)
		// 			App.scene[name].position.x = 10;
		// 			App.scene[name].position.z = -20;
		// 			App.scene[name].position.y = 7;
		// 			App.scene[name].geometry.setScale(-1) // invert tex coords
		// 			App.scene[name].geometry.setScaleByX(-2)
		// 			App.scene[name].LightsData.ambientLight.set(1, 1, 1);
		// 			// App.scene[name].net.enable = false;
		// 			console.log('App.network.c  h => ' + App.network.connection.getAllParticipants().length)
		// 			//  App.scene[name].net.activate();
		// 			App.scene[name].streamTextures = matrixEngine.Engine.DOM_VT(i.children[1])
		// 			addEventListener('net.remove-user', (event) => {
		// 				var n = "videochat_" + event.detail.data.userid;
		// 				if(typeof App.scene[n] !== 'undefined' &&
		// 					typeof App.scene[n].CUSTOM_FLAG_PREVENT_DBCALL === 'undefined') {
		// 					App.scene[n].CUSTOM_FLAG_PREVENT_DBCALL = true;
		// 					App.scene[n].selfDestroy(1)
		// 				}
		// 			})
		// 		} else {
		// 			// own stream 

		// 			if(App.network.connection.isInitiator == true) {
		// 				console.log('isInitiator is TRUE!')
		// 			}

		// 			if(sessionStorage.getItem('alocal_' + name) == null) {
		// 				var name = 'LOCAL_STREAM';
		// 				matrixEngine.matrixWorld.world.Add("squareTex", 3, name, tex);
		// 				App.scene[name].position.x = 0;
		// 				App.scene[name].position.z = -30;
		// 				App.scene[name].position.y = 7;
		// 				App.scene[name].geometry.setScale(-1)
		// 				App.scene[name].geometry.setScaleByX(-2)
		// 				App.scene.LOCAL_STREAM.streamTextures = new matrixEngine.Engine.DOM_VT(i.children[1]);
		// 				// TV OBJ
		// 				// function onLoadObj(meshes) {
		// 				//   matrixEngine.objLoader.initMeshBuffers(matrixEngine.matrixWorld.world.GL.gl, meshes.TV);
		// 				//   matrixEngine.matrixWorld.world.Add("obj", 1, "TV", tex, meshes.TV);
		// 				//   App.scene.TV.position.setPosition(-20, 2, -25)
		// 				//   App.scene.TV.mesh.setScale(7)
		// 				//   // App.scene.TV.rotation.rotateY(90);
		// 				//   App.scene.TV.LightsData.ambientLight.set(1, 1, 1);
		// 				//   App.scene.TV.streamTextures = new matrixEngine.Engine.DOM_VT(i.children[1]);
		// 				// }
		// 				// sessionStorage.setItem('alocal_' + name, name)
		// 				// matrixEngine.objLoader.downloadMeshes({TV: "res/3d-objects/tv.obj"}, onLoadObj);
		// 			}
		// 		}
		// 	})
		// })

		// hide networking html dom div.
		setTimeout(() => matrixEngine.utility.byId('matrix-net').style.display = 'none', 2200)
	}

	soundsEnabled() {
		if(typeof matrixEngine.utility.QueryString.sounds == 'undefined' ||
			matrixEngine.utility.QueryString.sounds == 'true') {
			return true;
		} else {
			return false;
		}
	}

	isManual() {
		if(typeof matrixEngine.utility.QueryString.server == 'undefined' ||
			matrixEngine.utility.QueryString.server == 'manual') {
			return true;
		} else {
			return false;
		}
	}

	serverGiveResults() {
		if(typeof matrixEngine.utility.QueryString.server == 'undefined' ||
			matrixEngine.utility.QueryString.server == 'giveResults') {
			return true;
		} else {
			return false;
		}
	}

	NUIEnabled() {
		if(typeof matrixEngine.utility.QueryString.nui == 'undefined' ||
			matrixEngine.utility.QueryString.nui == 'false' ||
			matrixEngine.utility.QueryString.nui == null) {
			return false;
		} else {
			return true;
		}
	}

	attachMatrixRay() {
		// look like inverse - inside matrix-engine must be done
		// matrixEngine.raycaster.touchCoordinate.stopOnFirstDetectedHit = true
		canvas.addEventListener('mousedown', (ev) => {
			App.onlyClicksPass = true;
			// no need maybe ?!!!?
			matrixEngine.raycaster.checkingProcedure(ev);
			setTimeout(() => {
				App.onlyClicksPass = false;
			}, 10)
		})

		canvas.addEventListener('mousemove', (ev) => {
			matrixEngine.raycaster.checkingProcedure(ev);
		});

		var LAST_HOVER = null;
		window.addEventListener('ray.hit.event', (ev) => {
			// all physics chips have name prefix chips_
			// must be fixed from matrix engine source !!!
			if(ev.detail.hitObject.name.indexOf('chips_') != -1 ||
				ev.detail.hitObject.name.indexOf('roll') != -1) {
				// console.log("PREVENT NO CHIPS TRAY: ", ev.detail.hitObject.name)
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

			if(App.onlyClicksPass != true) return;

			if(this.preventDBTrigger == null) {
				this.preventDBTrigger = Date.now()
			} else {
				var delta = Date.now() - this.preventDBTrigger;
				if(delta < 100) {
					this.preventDBTrigger = null;
					return;
				}
				this.preventDBTrigger = null;
			}

			if(ev.detail.hitObject.name == 'manualSpin') {
				if(typeof matrixEngine.utility.QueryString.server !== 'undefined' &&
					matrixEngine.utility.QueryString.server == 'manual') {
					dispatchEvent(new CustomEvent('SET_STATUSBOX_TEXT', {detail: 'SPINNING'}))
					console.log("SPIN PROCEDURE:", ev.detail.hitObject.name)
					dispatchEvent(new CustomEvent('SPIN', {detail: {type: 'manual'}}))
					return;
				}
				return;
			}

			if(ev.detail.hitObject.raycast.enabled != true) {return }
			console.log('dispatch=>chip-bet')
			if(this.playerInfo.balance >= 1) dispatchEvent(new CustomEvent("chip-bet", {detail: ev.detail.hitObject}))

		});
	}

	preparePhysics() {
		let gravityVector = [0, 0, -10];
		this.physics = this.world.loadPhysics(gravityVector);
		this.physics.addGround(matrixEngine.App, this.world, {
			source: ["res/images/bg-pow2.png"],
			mix_operation: "multiply",
		});
		this.physics.broadphase = new CANNON.NaiveBroadphase();
		this.physics.world.solver.iterations = 10;

		// ori in comment
		// this.physics.world.defaultContactMaterial.contactEquationStiffness = 1e6;
		// this.physics.world.defaultContactMaterial.contactEquationRelaxation = 10;

		App.scene.FLOOR_STATIC.geometry.setScale(3)
		App.scene.FLOOR_STATIC.geometry.setTexCoordScaleFactor(3.5)
	}

	prepareFire() {

		// add later validator for  no bets  status
		dispatchEvent(new CustomEvent('SET_STATUS_LINE_TEXT', {detail: 'Lets go'}))

		setTimeout(() => {
			// clear double call
			// roulette.wheelSystem.fireBall()
			dispatchEvent(new CustomEvent('fire-ball', {detail: [0.32, [1., -10.2, 4], [-10000, 150, 10]]}))
			removeEventListener('camera-view-wheel', this.prepareFire)
		}, this.status.winNumberMomentDelay)
	}

	attachGamePlayEvents() {

		if(this.isManual() == true) {

			window.addEventListener('matrix.roulette.win.number', (ev) => {
				// Final winning number
				// For now only for manual status
				console.log('Winning number: ' + ev.detail)
				this.tableBet.chips.removeLostChips(ev.detail)

				setTimeout(() => {
					this.setupCameraView('bets')
					dispatchEvent(new CustomEvent('SET_STATUSBOX_TEXT', {detail: 'WIN NUM:' + ev.detail}))
					setTimeout(() => {this.tableBet.chips.clearAll()}, this.status.winNumberMomentDelay * 3)
				}, this.status.winNumberMomentDelay)

			})

			addEventListener('SPIN', (e) => {
				console.log('SPIN PROCEDUTE')
				addEventListener('camera-view-wheel', this.prepareFire, {passive: true})
				this.setupCameraView('wheel')
			})

			addEventListener('view-wheel', (e) => {
				this.setupCameraView('wheel')
			})

			addEventListener('view-table', (e) => {
				this.setupCameraView('bets')
			})

		}

		// ONLY SYNTETIC - ROULETTE HAVE NOT SYSTEM FOR SET WIN NUMBER
		// IT IS THE PHYSICS REALM
		addEventListener('MEDITATE_SERVER', (e) => {
			this.status.game = 'MEDITATE';
		})

		addEventListener('RESULT', (e) => {
			this.status.game = 'RESULTS';
		})
	}

	addHUD(playerInfo) {
		// 2d canvas nidza.js lib
		this.tex = {
			source: ["res/images/chip1.png"],
			mix_operation: "multiply",
		}
		var n = 'balance';
		matrixEngine.matrixWorld.world.Add("squareTex", 1, n, this.tex);
		App.scene[n].position.SetY(-1.9);
		App.scene[n].position.SetZ(7);
		App.scene.balance.position.SetX(-3.1);
		App.scene[n].geometry.setScaleByX(1.83)
		App.scene[n].geometry.setScaleByY(0.5)
		// App.scene[n].glBlend.blendEnabled = true;
		// App.scene[n].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
		// App.scene[n].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[2];
		App.scene.balance.rotation.rotx = 90;

		this.create2dHUD = create2dHUD.bind(this);

		this.create2dHUD(this).then(canvas2d => {
			App.scene.balance.streamTextures = {
				videoImage: canvas2d,
			}
		})

		addEventListener('update-balance', (e) => {
			console.info('Event: update-balance => ', e.detail)
			var t = this.playerInfo.balance - e.detail;
			this.playerInfo.balance = t;
			roulette.nidza.access.footerLabel.elements[0].text = t
		})

		this.addHUDBtns()
		this.addHUDStatus()
	}

	addHUDBtns() {

		var n = 'bottomStatusLine';
		matrixEngine.matrixWorld.world.Add("squareTex", 1, n, {
			source: ["res/images/spin.png"],
			mix_operation: "multiply",
		});
		App.scene[n].position.SetY(-1.9);
		App.scene[n].position.SetZ(6.1);
		App.scene[n].position.SetX(0);
		App.scene[n].rotation.rotx = -90;
		App.scene[n].geometry.setScaleByX(3.83)
		App.scene[n].geometry.setScaleByY(-0.25)
		App.scene[n].glBlend.blendEnabled = true;
		App.scene['bottomStatusLine'].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[2];
		App.scene['bottomStatusLine'].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[0];

		create2dHUDStatusLine(this.nidza, this.status).then(canvas2d => {
			App.scene.bottomStatusLine.streamTextures = {videoImage: canvas2d}
		})

		var n = 'clearBets';
		matrixEngine.matrixWorld.world.Add("squareTex", 1, n, {
			source: ["res/images/clearH.png"],
			mix_operation: "multiply",
		});
		App.scene[n].position.SetY(-1.9);
		App.scene[n].position.SetZ(7);
		App.scene[n].position.SetX(2.8);
		App.scene[n].rotation.rotx = -90;
		App.scene[n].geometry.setScaleByX(0.83)
		App.scene[n].geometry.setScaleByY(0.5)
		App.scene[n].glBlend.blendEnabled = true;
		App.scene[n].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[2];
		App.scene[n].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[0];

		App.scene['clearBets'].hoverEffect = (me) => {
			me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
			me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[2];
		}

		App.scene['clearBets'].hoverLeaveEffect = (me) => {
			me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[2];
			me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[0];
		}

		if(this.isManual() == true) {
			var n = 'manualSpin';
			matrixEngine.matrixWorld.world.Add("squareTex", 1, n, {
				source: ["res/images/spin.png"],
				mix_operation: "multiply",
			});
			App.scene[n].position.SetY(-1.9);
			App.scene[n].position.SetZ(7);
			App.scene[n].position.SetX(0);
			App.scene[n].rotation.rotx = -90;
			App.scene[n].geometry.setScaleByX(0.83)
			App.scene[n].geometry.setScaleByY(0.5)
			App.scene[n].glBlend.blendEnabled = true;
			App.scene['manualSpin'].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[2];
			App.scene['manualSpin'].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[0];

			App.scene['manualSpin'].hoverEffect = (me) => {
				me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
				me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[2];
			}

			App.scene['manualSpin'].hoverLeaveEffect = (me) => {
				me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[2];
				me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[0];
			}
		}
	}

	addHUDStatus() {
		this.tex = {
			source: ["res/images/chip1.png"],
			mix_operation: "multiply",
		}
		var n = 'statusBox';
		matrixEngine.matrixWorld.world.Add("squareTex", 1, n, this.tex);
		App.scene[n].position.SetY(-.6);
		App.scene[n].position.SetZ(1.45);
		App.scene.statusBox.position.SetX(0);
		App.scene[n].geometry.setScaleByX(3.83)
		App.scene[n].geometry.setScaleByY(1.55)
		App.scene[n].glBlend.blendEnabled = true;
		App.scene[n].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[6];
		App.scene[n].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
		App.scene.statusBox.rotation.rotx = 122;

		// Attaching canvas2d tot he webgl surface.
		createStatusBoxHUD(this.nidza, this.playerInfo).then(canvas2d => {
			App.scene.statusBox.streamTextures = {videoImage: canvas2d}
		})
	}

}