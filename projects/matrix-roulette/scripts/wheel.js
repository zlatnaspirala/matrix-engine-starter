import * as matrixEngine from "matrix-engine"
import * as CANNON from 'cannon';

/**
 * @description
 * Single object single physics body system
 * No collide because i use STATIC bodies
 */
export default class Wheel {
	ballBody = null;
	// speedRollInit = 0.15;
	speedRollInit = 0.20;
	rollTimer = null;
	ballCollideFlag = false;

	constructor(pWorld) {
		console.log('wheel constructor')
		this.pWorld = pWorld;
		this.texRollWheel = {
			source: ["res/images/ball.png"],
			mix_operation: "multiply",
		};
		this.addStaticWheel()
		this.addCenterRoll()
		this.addFields()

		this.animateRoll()

		addEventListener('fire-ball', this.fireBall)
	}

	orbit(cx, cy, angle, p) {
		var s = Math.sin(angle);
		var c = Math.cos(angle);
		p.x -= cx;
		p.y -= cy;
		var xnew = p.x * c - p.y * s;
		var ynew = p.x * s + p.y * c;
		p.x = xnew + cx;
		p.y = ynew + cy;
		return p;
	}

	momentOftouch = (e) => {
		if(typeof e.body.matrixRouletteId === 'undefined') return;
		console.log("Collided with number:", e.body.matrixRouletteId);
		dispatchEvent(new CustomEvent('matrix.roulette.win.number', {detail: e.body.matrixRouletteId}))
		this.ballBody.removeEventListener("collide", this.momentOftouch);
		this.ballCollideFlag = false;
		if(matrixEngine.App.sounds.audios.spining) {
			try {
				matrixEngine.App.sounds.play('spiningEnd')
			} catch(err) {}
			matrixEngine.App.sounds.audios.spining.pause();
			matrixEngine.App.sounds.audios.spining.currentTime = 0;
		}

	}

	fireBall = (props) => {
		if(typeof props.detail === 'undefined' || props.detail === null) props.detail = [0.3, [4., -11.4, 3], [-11000, 320, 11]];
		console.log("props", props.detail)
		roulette.wheelSystem.addBall(props.detail[0], props.detail[1], props.detail[2])
		// matrixEngine.App.sounds.play('spining')
		if(this.ballCollideFlag == false) {
			this.ballBody.addEventListener("collide", this.momentOftouch);
			this.ballCollideFlag = true;
		}
	}

	addBall = (j, posArg, force) => {
		if(this.ballBody !== null) {
			console.log('Ball already created. POS : ', posArg[0], ' - ',  posArg[1],' - ', posArg[2])
			this.ballBody.position.set(posArg[0], posArg[1], posArg[2])
			this.ballBody.angularVelocity.setZero()
			this.ballBody.quaternion.set(0, 0, 0, 0)
			this.ballBody.force.set(force[0], force[1], force[2])
			this.ballBody.addEventListener("collide", this.momentOftouch);
			return;
		}

		if(typeof j === 'undefined') j = 1
		if(typeof posArg === 'undefined') posArg = [0, -16, 1.7]

		var tex = {
			source: ["res/images/ball.png"],
			mix_operation: "multiply",
		};

		matrixEngine.matrixWorld.world.Add("sphereLightTex", j, "ball", tex);

		this.ballBody = new CANNON.Body({
			mass: 6,
			linearDamping: 0.01,
			angularDamping: 0.01,
			sleepSpeedLimit: 0.0, // Body will feel sleepy if speed<1 (speed == norm of velocity)
			sleepTimeLimit: 0.0, // Body falls asleep after 1s of sleepiness
			angularVelocity: new CANNON.Vec3(0, 0, 0),
			position: new CANNON.Vec3(posArg[0], posArg[1], posArg[2]),
			shape: new CANNON.Sphere(j),
			// collisionFilterGroup: this.GROUP1,
			// collisionFilterMask: this.GROUP2 | this.GROUP3 | this.GROUP4
		});

		this.ballBody.addEventListener("collide", this.momentOftouch);

		this.pWorld.world.addBody(this.ballBody);
		App.scene['ball'].physics.currentBody = this.ballBody;
		App.scene['ball'].physics.enabled = true;

		this.ballBody.force.set(force[0], force[1], force[2])

	}

	addStaticWheel() {
		// matrix-engine obj
		var tex = {
			// reflection-wheel
			// source: ["res/images/wheel-roll/metal-separators/reflection-wheel.jpg"],
			// source: ["res/images/wheel-roll/skin/skin.jpg"],
			source: ["res/images/wheel-roll/center/wood.jpg"],
			mix_operation: "multiply",
		};

		// wheel config
		var outerRad = 12.8;
		var inner_rad = 3.125;
		var wheelsPoly = 64;

		// [matrix-engine 1.9.20] custom_type: 'torus',
		matrixEngine.matrixWorld.world.Add("generatorLightTex", 1, "bigWheel", tex, {
			custom_type: 'torus',
			slices: wheelsPoly,
			loops: wheelsPoly,
			inner_rad: inner_rad,
			outerRad: outerRad
		})

		// App.scene.bigWheel.glDrawElements.mode = 'LINES'
		// cannon
		var bigWheel = new CANNON.Body({
			mass: 0,
			type: CANNON.Body.STATIC,
			shape: CANNON.Trimesh.createTorus(outerRad, inner_rad, wheelsPoly, wheelsPoly),
			position: new CANNON.Vec3(0, -21, 0.05)
		})
		this.pWorld.world.addBody(bigWheel);
		App.scene.bigWheel.physics.currentBody = bigWheel;
		App.scene.bigWheel.physics.enabled = true;
		App.scene.bigWheel.position.z = -21;
		// App.scene.bigWheel.LightsData.lightingDirection.set(5, 5, -22)
		App.scene.bigWheel.LightsData.lightingDirection.set(1, -0.2, 0)

		App.scene.bigWheel.LightsData.directionLight.g = 0
		App.scene.bigWheel.LightsData.directionLight.r = 0


		// top static big wheel
		// wheel config
		var outerRad = 12.8;
		var inner_rad = 1.125;
		var wheelsPoly = 64;
		matrixEngine.matrixWorld.world.Add("generatorLightTex", 1, "bigWheelTop", tex, {
			custom_type: 'torus',
			slices: wheelsPoly,
			loops: wheelsPoly,
			inner_rad: inner_rad,
			outerRad: outerRad
		})

		// App.scene.bigWheel.glDrawElements.mode = 'LINES'
		// cannon
		var bigWheelTop = new CANNON.Body({
			mass: 0,
			type: CANNON.Body.STATIC,
			shape: CANNON.Trimesh.createTorus(outerRad, inner_rad, wheelsPoly, wheelsPoly),
			position: new CANNON.Vec3(0, 0.05, -21)
		})

		this.pWorld.world.addBody(bigWheelTop);
		App.scene.bigWheelTop.physics.currentBody = bigWheelTop;
		App.scene.bigWheelTop.physics.enabled = true;
		App.scene.bigWheelTop.position.y = 3;
		App.scene.bigWheelTop.position.z = -21
		App.scene.bigWheelTop.LightsData.directionLight.g = 0
		App.scene.bigWheelTop.LightsData.directionLight.r = 0


		// add simple square down from fields to eliminate empty space
		matrixEngine.matrixWorld.world.Add("cubeLightTex", 1, "bottomSquare", tex);
		App.scene.bottomSquare.position.setPosition(0, -1.25, -21);
		App.scene.bottomSquare.rotation.rotx = 90
		App.scene.bottomSquare.rotation.rotationSpeed.z = 9
		App.scene.bottomSquare.geometry.setScale(10.8)
		App.scene.bottomSquare.deactivateTex();
		App.scene.bottomSquare.geometry.setScaleByZ(-11.5)
	}

	addCenterRoll() {
		var tex = {
			source: ["res/images/wheel-roll/skin/skin1.jpg"],
			mix_operation: "multiply",
		};

		// wheel config
		var outerRad = 6.2;
		var inner_rad = 2;
		var wheelsPoly = 128;

		// [matrix-engine 1.9.20] custom_type: 'torus',
		matrixEngine.matrixWorld.world.Add("generatorLightTex", 1, "centerWheel", tex, {
			custom_type: 'torus',
			slices: wheelsPoly,
			loops: wheelsPoly,
			inner_rad: inner_rad,
			outerRad: outerRad
		})

		// no need at all in prodc
		App.scene.centerWheel.visible = false

		// cannon
		var centerWheel = new CANNON.Body({
			mass: 0,
			type: CANNON.Body.STATIC,
			shape: CANNON.Trimesh.createTorus(outerRad, inner_rad, wheelsPoly, wheelsPoly),
			position: new CANNON.Vec3(0, -21, 0.05)
		});
		// dev
		// window.centerWheel = centerWheel;
		this.pWorld.world.addBody(centerWheel);
		App.scene.centerWheel.physics.currentBody = centerWheel;
		App.scene.centerWheel.physics.enabled = true;

		App.scene.centerWheel.LightsData.directionLight.g = 0
		App.scene.centerWheel.LightsData.directionLight.r = 0

		// 3d object is decoration no direct connection with cannonjs
		var loadCenterObj = new Promise((resolve, reject) => {
			var name = 'centerRollDecoration';
			function onLoadObj(meshes) {
				try {
					matrixEngine.objLoader.initMeshBuffers(matrixEngine.matrixWorld.world.GL.gl, meshes[name]);
					var tex = {
						source: ["res/3d-objects/center.png"],
						mix_operation: "multiply",
					};
					matrixEngine.matrixWorld.world.Add("obj", 100, name, tex, meshes[name]);
					App.scene[name].raycast.enabled = false;
					App.scene[name].position.y = 1;
					App.scene[name].position.z = -21;
					App.scene[name].mesh.setScale(43.5)

					App.scene.centerRollDecoration.LightsData.ambientLight.set(0.5, 0.5, 0)
					App.scene.centerRollDecoration.LightsData.lightingDirection.set(1, 1.2, 0)

					App.scene.centerRollDecoration.LightsData.directionLight.g = 0
					App.scene.centerRollDecoration.LightsData.directionLight.r = 0

					resolve(App.scene[name])
				} catch(err) {
					reject('Loading obj chip error: ' + err)
				}
			}
			var _name = {};
			_name[name] = "res/3d-objects/center.obj"
			matrixEngine.objLoader.downloadMeshes(_name, onLoadObj);
		})

	}

	animateRoll() {
		console.warn('ONCE <><>')
		this.C = 100;
		this.rollTimer = {};

		this.rollTimer.UPDATE = () => {
			for(var i = 0;i < 37;i++) {
				var p = {x: 0.1, y: 0.1, z: 0};
				p = this.orbit(0, 9, i / 5.9 + this.C, p);
				// var p3 = p;
				// var p3 = {x: 0.1, y: 0.1, z: 0};
				// p3 = this.orbit(0, 9, i / 5.9 + this.C, p3);
				App.scene['roll' + i].physics.currentBody.position.set(p.x, p.y - 30, -0.3)
				App.scene['centerWheel' + i].physics.currentBody.position.set(p.x, p.y - 30, .3)

				// console.warn('>>>>', p)
				if(App.scene.centerRollDecoration) {
					App.scene.centerRollDecoration.rotation.rotationSpeed.y = this.speedRollInit * 1000
				}
			} 
			this.C = this.C - this.speedRollInit
			if(this.speedRollInit < 0.001) {
				// clearInterval(this.rollTimer)
			} else {
				this.speedRollInit = this.speedRollInit - 0.00085
			}
		}

		// setInterval(() => {
		// 	this.rollTimer.UPDATE()
		// }, 10);

		App.updateBeforeDraw.push(this.rollTimer)
	}

	addFields() {
		for(var i = 0;i < 37;i++) {
			var tex = {
				source: ["res/images/wheel-roll/" + i + ".png"],
				mix_operation: "multiply",
			};

			var texWall = {
				source: ["res/images/wheel-roll/" + 0 + ".png"],
				mix_operation: "multiply",
			};

			matrixEngine.matrixWorld.world.Add("cubeLightTex", 0.5, "roll" + i, tex);
			var p = {x: 5, y: 5, z: 0};
			p = this.orbit(0, 0, i / 5.9, p);
			var b2 = new CANNON.Body({
				type: CANNON.Body.STATIC,
				mass: 0,
				position: new CANNON.Vec3(p.x, p.y - 12.5, -0),
				shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
			});
			this.pWorld.world.addBody(b2);
			App.scene['roll' + i].physics.currentBody = b2;
			App.scene['roll' + i].physics.enabled = true;
			App.scene['roll' + i].physics.currentBody.matrixRouletteId = i;
			// console.info('centerWheel', App.scene['roll' + i].physics.currentBody.id) 

			// small field holders
			var tex = {
				source: ["res/images/field.png"],
				mix_operation: "multiply",
			};

			// wheel config
			var outerRad = 0.7;
			var inner_rad = 0.1;
			var wheelsPoly = 8;

			// [matrix-engine 1.9.20] custom_type: 'torus',
			matrixEngine.matrixWorld.world.Add("generatorLightTex", 1, "centerWheel" + i, tex, {
				custom_type: 'torus',
				slices: wheelsPoly,
				loops: wheelsPoly,
				inner_rad: inner_rad,
				outerRad: outerRad
			})

			// App.scene['centerWheel'+i].glDrawElements.mode = 'LINES'

			// cannon
			var centerWheel = new CANNON.Body({
				mass: 0,
				type: CANNON.Body.STATIC,
				shape: CANNON.Trimesh.createTorus(outerRad, inner_rad, wheelsPoly, wheelsPoly),
				position: new CANNON.Vec3(0, -21, 3.55)
			});
			// dev
			// window.centerWheel = centerWheel;
			this.pWorld.world.addBody(centerWheel);
			App.scene['centerWheel' + i].physics.currentBody = centerWheel;
			App.scene['centerWheel' + i].physics.enabled = true;
		}
	}

}