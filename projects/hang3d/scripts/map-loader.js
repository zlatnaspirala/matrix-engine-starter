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
				shape: new CANNON.Box(new CANNON.Vec3(item.scaleCollider[0], item.scaleCollider[2], item.scaleCollider[1]))
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
				shape: new CANNON.Box(new CANNON.Vec3(item.scaleCollider[0], item.scaleCollider[2], 0.1)),
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
				scaleCollider: item.scaleCollider,
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

		if(map.staticObjsGroup) map.staticObjsGroup.forEach(item => {

			this.loadObjStaticGroup({
				name: item.name,
				mass: 0,
				path: item.path,
				position: [item.position.x, item.position.y, item.position.z],
				activeRotation: item.activeRotation,
				rotation: item.rotation,
				scale: item.scale,
				scaleCollider: item.scaleCollider,
				textures: item.texture.source,
				shadows: false,
				gamePlayItem: 'STATIC_rock'
			}, physics)
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
			// console.log('>>>>>>>>>>>>>', n)
			App.scene[n.name].mesh.setScale({x: n.scale[0], y: n.scale[1], z: n.scale[2]})
			var b44 = new CANNON.Body({
				mass: n.mass,
				linearDamping: 0.01,
				position: new CANNON.Vec3(n.position[0], n.position[2], n.position[1]),
				shape: new CANNON.Box(new CANNON.Vec3(n.scaleCollider[0], n.scaleCollider[2], n.scaleCollider[1]))
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
	},
	loadObjStaticGroup(n, physics) {
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

			// MUST BE FIXED ---------------------->><
			// console.log('>>>>>App.scene[n.name].>>>>>>>>', App.scene[n.name].mesh.groups)
			var body = new CANNON.Body({
				mass: 0,
				position: new CANNON.Vec3(0, 0, 0)
			});
			App.scene[n.name].mesh.groups.forEach((group, indexGroup) => {
				// We can add the same shape several times to position child shapes within the Compound.
				console.log( '>>>>>GROUP>SUB VERTS>>>>>>>', group)
				var collectX0, collectX4, collectY0, collectY1, collectZ0, collectZ2;
				group.groupVert.forEach((vert, index) => {
					// console.log(index , '>>>>>GROUP>SUB VERTS>>>>>>>', vert)
					if(index == 0) {
						collectX0 = vert[0]
						collectY0 = vert[1]
						collectZ0 = vert[2]
					}else if (index == 1) {
						collectY1 = vert[1]
					}else if (index == 2) {
						collectZ2 = vert[2]
					}	else if(index == 4){
						 collectX4 = vert[0]
					}
					// index 0 vs 4 MAKE X SCALE NARUTE VERT VALUES
				})

				// X
				// Probable cube one be always - other + 90%
				// -.55 0.55 ~ 1.1
				var calcX = Math.abs(collectX0) + Math.abs(collectX4)
				var calcY = Math.abs(collectY0) + Math.abs(collectY1)
				var calcZ = Math.abs(collectZ0) + Math.abs(collectZ2)
				var shape = new CANNON.Box(new CANNON.Vec3(calcX,calcY,calcX));
				// OFFSET 
				// calc from center 0,0,0 probably
				// calcX / 2 HALF to find center of cube then distance from 0,0,0 relative OBJ center...
				//  -4 -2 
			  var offsetX =  calcX/2
				body.addShape(shape,  new CANNON.Vec3(0, 0, 0))
			})

			App.scene[n.name].mesh.setScale({x: n.scale[0], y: n.scale[1], z: n.scale[2]})
			// var b44 = new CANNON.Body({
			// 	mass: n.mass,
			// 	linearDamping: 0.01,
			// 	position: new CANNON.Vec3(n.position[0], n.position[2], n.position[1]),
			// 	shape: new CANNON.Box(new CANNON.Vec3(n.scaleCollider[0], n.scaleCollider[2], n.scaleCollider[1]))
			// });
			// b44._name = n.gamePlayItem;
			physics.world.addBody(body);
			App.scene[n.name].physics.currentBody = body;
			App.scene[n.name].physics.enabled = true;

			App.scene[n.name].rotation.rotx = parseFloat(n.rotation.rotx);
			App.scene[n.name].rotation.roty = parseFloat(n.rotation.roty);
			App.scene[n.name].rotation.rotz = parseFloat(n.rotation.rotz);
			// App.scene[n.name].physics.currentBody.quaternion.setFromEuler(n.rotation.rotx, n.rotation.rotz, n.rotation.roty)

			if(n.shadows == true) {
				App.scene[n.name].activateShadows('spot')
			}
		}
		var arg = {};
		arg[n.name] = n.path;
		matrixEngine.objLoader.downloadMeshes(arg, onLoadObjS)
	}
};