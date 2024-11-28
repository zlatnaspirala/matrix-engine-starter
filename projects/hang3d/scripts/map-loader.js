import * as matrixEngine from "matrix-engine";
import * as CANNON from 'cannon';

export const meMapLoader = {
	physics: {},
	load: function(map, physics) {
		this.physics = physics;
		map.staticCubes.forEach(item => {
			matrixEngine.matrixWorld.world.Add("cubeLightTex", 1, item.name, item.texture);
			App.scene[item.name].geometry.setScaleByX(item.scale[0]);
			App.scene[item.name].geometry.setScaleByY(item.scale[1]);
			App.scene[item.name].geometry.setScaleByZ(item.scale[2]);
			var b = new CANNON.Body({
				mass: 0,
				linearDamping: 0.01,
				position: new CANNON.Vec3(item.position.x, item.position.z, item.position.y),
				shape: new CANNON.Box(new CANNON.Vec3(item.scale[0] * 1.7, item.scale[2] * 1.7, item.scale[1] * 1.7))
			});
			physics.world.addBody(b);
			App.scene[item.name].rotation.rotx = parseFloat(item.rotation.rotx);
			App.scene[item.name].rotation.roty = parseFloat(item.rotation.roty);
			App.scene[item.name].rotation.rotz = parseFloat(item.rotation.rotz);
			App.scene[item.name].rotation.rotationSpeed.x = item.activeRotation[0];
			App.scene[item.name].rotation.rotationSpeed.y = item.activeRotation[1];
			App.scene[item.name].rotation.rotationSpeed.z = item.activeRotation[2];
			App.scene[item.name].position.setPosition(item.position.x, item.position.y, item.position.z)
			App.scene[item.name].physics.currentBody = b;
			App.scene[item.name].physics.enabled = true;
			App.scene[item.name].physics.currentBody.quaternion.setFromEuler(item.rotation.rotx, item.rotation.rotz, item.rotation.roty)
		});

		// platform angle
		if(map.staticFloors) map.staticFloors.forEach(item => {
			matrixEngine.matrixWorld.world.Add("cubeLightTex", 1, item.name, item.texture);
			const b = new CANNON.Body({
				shape: new CANNON.Box(new CANNON.Vec3(item.scale[0], item.scale[2], 0.1)),
				type: CANNON.Body.STATIC,
				position: new CANNON.Vec3(0, 0, 0)
			})
			b.fixedRotation = true;
			b.updateMassProperties();
			App.scene[item.name].physics.currentBody = b;
			App.scene[item.name].physics.enabled = true;
			App.scene[item.name].geometry.setScaleByX(item.scale[0]);
			App.scene[item.name].geometry.setScaleByZ(item.scale[2]);
			App.scene[item.name].geometry.setScaleByY(-0.9);
			// App.scene[item.name].physics.currentBody.quaternion.setFromEuler(5 * Math.PI/180,0,0)
			// shape: new CANNON.Box(new CANNON.Vec3(item.scale[0] * 2, item.scale[2] * 2, item.scale[1] * 2))
			// App.scene[item.name].rotation.rotx = parseFloat(item.rotation.rotx);
			// App.scene[item.name].rotation.roty = parseFloat(item.rotation.roty);
			// App.scene[item.name].rotation.rotz = parseFloat(item.rotation.rotz);
			// no active rot for floors
			App.scene[item.name].position.setPosition(item.position.x, item.position.y, item.position.z)
			App.scene[item.name].physics.currentBody = b;
			App.scene[item.name].physics.enabled = true;
			App.scene[item.name].physics.currentBody.quaternion.setFromEuler(item.rotation.rotx * Math.PI / 180, 0, 0)
			physics.world.addBody(b);
		});
		//
		if(map.staticObjs) map.staticObjs.forEach(item => {
			// matrixEngine.matrixWorld.world.Add("cubeLightTex", item.scale[0], item.name, item.texture);
			// App.scene[item.name].geometry.setScaleByX(item.scale[0]);
			// App.scene[item.name].geometry.setScaleByY(item.scale[1]);
			// App.scene[item.name].geometry.setScaleByZ(item.scale[2]);
			this.loadObjStatic({
				name: item.name,
				mass: 0,
				path: item.path,
				position: [item.position.x, item.position.y, item.position.z],
				activeRotation: item.activeRotation,
				rotation: item.rotation,
				scale: item.scale,
				textures: item.texture.source,
				shadows: false,
				gamePlayItem: 'STATIC_rock'
			}, physics)
		});

		if(map.noPhysics && map.noPhysics.cubes.length > 0) map.noPhysics.cubes.forEach((item) => {
			matrixEngine.matrixWorld.world.Add("cubeLightTex", item.scale[0], item.name, item.texture);
			App.scene[item.name].geometry.setScaleByX(item.scale[0]);
			App.scene[item.name].geometry.setScaleByY(item.scale[1]);
			App.scene[item.name].geometry.setScaleByZ(item.scale[2]);
			App.scene[item.name].rotation.rotx = parseFloat(item.rotation.rotx);
			App.scene[item.name].rotation.roty = parseFloat(item.rotation.roty);
			App.scene[item.name].rotation.rotz = parseFloat(item.rotation.rotz);
			App.scene[item.name].rotation.rotationSpeed.x = item.activeRotation[0];
			App.scene[item.name].rotation.rotationSpeed.y = item.activeRotation[1];
			App.scene[item.name].rotation.rotationSpeed.z = item.activeRotation[2];
			App.scene[item.name].position.setPosition(item.position.x, item.position.y, item.position.z)
		});
	},
	geminiMap: function(numObjects, positionRange, scaleRange) {
		const map = {staticCubes: []};
		for(let i = 0;i < numObjects;i++) {
			const object = {
				name: "wall" + i,
				texture: {
					source: ["res/images/diffuse.png"],
					mix_operation: "multiply"
				},
				position: {
					x: Math.random() * positionRange * 2 - positionRange,
					y: 1,
					// y: Math.random() * positionRange * 2 - positionRange,
					z: Math.random() * positionRange * 2 - positionRange
				},
				scale: [
					Math.random() * scaleRange + 1,
					Math.random() * scaleRange + 1,
					Math.random() * scaleRange + 1
				]
			};
			map.staticCubes.push(object);
		}
		return map;
	},
	loadObjStatic(n, physics) {
		function onLoadObjS(meshes) {
			var tex = {source: n.textures, mix_operation: "multiply"}
			for(let key in meshes) {
				matrixEngine.objLoader.initMeshBuffers(matrixEngine.matrixWorld.world.GL.gl, meshes[key])
				matrixEngine.matrixWorld.world.Add("obj", n.scale, n.name, tex, meshes[key]);
			}
			App.scene[n.name].position.x = n.position[0];
			App.scene[n.name].position.y = n.position[1];
			App.scene[n.name].position.z = n.position[2];
			App.scene[n.name].rotation.rotationSpeed.x = n.activeRotation[0];
			App.scene[n.name].rotation.rotationSpeed.y = n.activeRotation[1];
			App.scene[n.name].rotation.rotationSpeed.z = n.activeRotation[2];

			// MUST BE FIXED ---------------------->><<---
			App.scene[n.name].mesh.setScale({x: n.scale[0], y: n.scale[1], z: n.scale[2]})
			var b44 = new CANNON.Body({
				mass: n.mass,
				linearDamping: 0.01,
				position: new CANNON.Vec3(n.position[0], n.position[2], n.position[1]),
				shape: new CANNON.Box(new CANNON.Vec3(n.scale[0]*0.5, n.scale[1]*0.5, n.scale[2]*0.5))
			});
			b44._name = n.gamePlayItem;
			physics.world.addBody(b44);
			App.scene[n.name].physics.currentBody = b44;
			App.scene[n.name].physics.enabled = true;
			App.scene[n.name].rotation.rotx = parseFloat(n.rotation.rotx);
			App.scene[n.name].rotation.roty = parseFloat(n.rotation.roty);
			App.scene[n.name].rotation.rotz = parseFloat(n.rotation.rotz);
			App.scene[n.name].physics.currentBody.quaternion.setFromEuler(n.rotation.rotx, n.rotation.rotz, n.rotation.roty)
			if(n.shadows == true) {
				App.scene[n.name].activateShadows('spot')
			}
		}
		var arg = {};
		arg[n.name] = n.path;
		matrixEngine.objLoader.downloadMeshes(arg, onLoadObjS)
	}
};