import * as matrixEngine from "matrix-engine";
import * as CANNON from 'cannon';
// @version 1.0.0
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
				textureRepeat: (item.textureRepeat ? item.textureRepeat : undefined),
				shadows: false,
				gamePlayItem: 'STATIC_rock'
			}, physics)
		});

		if(map.staticInstancedDraws) map.staticInstancedDraws.forEach(item => {

			this.loadObjCorridorOPTIMISED({
				name: item.name,
				mass: 0,
				path: item.path,
				position: [item.position.x, item.position.y, item.position.z],
				activeRotation: item.activeRotation,
				rotation: item.rotation,
				scale: item.scale,
				scaleCollider: item.scaleCollider,
				offsetCollider: item.offsetCollider,
				textures: item.texture.source,
				shadows: false,
				gamePlayItem: 'STATIC cube'
			}, physics)
		});

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

			// Texture REPEAT
			if(typeof n.textureRepeat != -1 && n.textureRepeat == true) {
				console.log('[Custom tex]')
				// Texture REPEAT
				let world = matrixEngine.matrixWorld.world;
				App.scene[n.name].custom.gl_texture = function(object, t) {
					for(var t = 0;t < object.textures.length;t++) {
						world.GL.gl.bindTexture(world.GL.gl.TEXTURE_2D, object.textures[t]);
						world.GL.gl.texParameteri(world.GL.gl.TEXTURE_2D, world.GL.gl.TEXTURE_MAG_FILTER, world.GL.gl.LINEAR);
						world.GL.gl.texParameteri(world.GL.gl.TEXTURE_2D, world.GL.gl.TEXTURE_MIN_FILTER, world.GL.gl.LINEAR);
						// world.GL.gl.texParameteri(world.GL.gl.TEXTURE_2D, world.GL.gl.TEXTURE_WRAP_S, world.GL.gl.MIRRORED_REPEAT);
						// world.GL.gl.texParameteri(world.GL.gl.TEXTURE_2D, world.GL.gl.TEXTURE_WRAP_T, world.GL.gl.MIRRORED_REPEAT);
						world.GL.gl.texParameteri(world.GL.gl.TEXTURE_2D, world.GL.gl.TEXTURE_WRAP_S, world.GL.gl.REPEAT);
						world.GL.gl.texParameteri(world.GL.gl.TEXTURE_2D, world.GL.gl.TEXTURE_WRAP_T, world.GL.gl.REPEAT);
						// world.GL.gl.texParameteri(world.GL.gl.TEXTURE_2D, world.GL.gl.TEXTURE_SWIZZLE_R, world.GL.gl.ZERO);
						// world.GL.gl.texParameteri(world.GL.gl.TEXTURE_2D, world.GL.gl.TEXTURE_SWIZZLE_G, world.GL.gl.RED);
						// world.GL.gl.texParameteri(world.GL.gl.TEXTURE_2D, world.GL.gl.TEXTURE_SWIZZLE_B, world.GL.gl.ZERO);
						world.GL.gl.texImage2D(world.GL.gl.TEXTURE_2D, 0, world.GL.gl.RGBA, world.GL.gl.RGBA, world.GL.gl.UNSIGNED_BYTE, object.textures[t].image);
						world.GL.gl.generateMipmap(world.GL.gl.TEXTURE_2D);
					}
				};
			}

			var body = new CANNON.Body({
				mass: 0,
				linearDamping: 0.01,
				position: new CANNON.Vec3(n.position[0], n.position[2], n.position[1])
			});
			if (App.scene[n.name].mesh.groups) App.scene[n.name].mesh.groups.forEach((group) => {


				// ANY VERTS SOLUTION _
				if(group.groupName.toString().indexOf('Destruct_cell') != -1 || group.groupName.toString().indexOf('estruct_cell') != -1) {
					console.log('DESTRUCT GROUP FOUND')
					
					return;
				}



				// CUBE PROCEDURE
				// We can add the same shape several times to position child shapes within the Compound.
				// tHIS WORKS ONLY FOR SIMPLY CUBE (no rotate in blender view)
				// i dont know who to hide collider 
				// console.log('<GROUP>', group)
				var collectX0, collectX4, collectY0, collectY1, collectZ0, collectZ2;
				group.groupVert.forEach((vert, index) => {
					if(index == 0) {
						collectX0 = parseFloat(vert[0])
						collectY0 = parseFloat(vert[1])
						collectZ0 = parseFloat(vert[2])
					} else if(index == 1) {
						collectY1 = parseFloat(vert[1])
					} else if(index == 2) {
						collectZ2 = parseFloat(vert[2])
					} else if(index == 4) {
						collectX4 = parseFloat(vert[0])
					}
				})
				// / 2 because elementar cube is -1 1 it is 2 in sum
				var calcX = collectX4 - collectX0;
				var calcXWorldPos = (collectX4 + collectX0) / 2;
				calcX = calcX / 2;
				var calcY = collectY1 - collectY0;
				var calcYWorldPox = (collectY1 + collectY0) / 2;
				calcY = calcY / 2;
				var calcZ = collectZ2 - collectZ0;
				var calcZWorldPos = (collectZ2 + collectZ0) / 2;
				calcZ = calcZ / 2;
				var shape = new CANNON.Box(new CANNON.Vec3(Math.abs(calcX), Math.abs(calcZ), Math.abs(calcY - 1)));
				shape._name = group.groupName
				// console.log('G NAME ', group.groupName.toString())
				if(group.groupName.toString().indexOf('.RotX.') != -1) {
					// fix
					shape = new CANNON.Box(new CANNON.Vec3(Math.abs(calcX), Math.abs(calcZ), Math.abs(calcY)));
					var getValueX = parseFloat(group.groupName.toString().split('.RotX.')[1].replace("_Mesh", ""))
					var rotLocal = new CANNON.Quaternion(0, 0, 0, 1)
					console.log('getValueX = ', getValueX, "  getValueX * Math.PI / 180 ", getValueX * Math.PI / 180)
					rotLocal.setFromEuler((getValueX * Math.PI / 180), 0, 0)
					body.addShape(shape, new CANNON.Vec3(calcXWorldPos, calcZWorldPos, calcYWorldPox - 10),
						rotLocal
					);
					// console.log('body.shapes[body.shapes.length - 1].convexPolyhedronRepresentation.vertices  GET REAL VERTICES FROM ROTATED PHYSC CUBE',body.shapes[body.shapes.length - 1].convexPolyhedronRepresentation.vertices)
				} else {
					body.addShape(shape, new CANNON.Vec3(calcXWorldPos, calcZWorldPos, calcYWorldPox));
				}
			})

			App.scene[n.name].mesh.setScale({x: n.scale[0], y: n.scale[1], z: n.scale[2]})
			physics.world.addBody(body);
			App.scene[n.name].physics.currentBody = body;
			App.scene[n.name].physics.enabled = true;
			App.scene[n.name].rotation.rotx = parseFloat(n.rotation.rotx);
			App.scene[n.name].rotation.roty = parseFloat(n.rotation.roty);
			App.scene[n.name].rotation.rotz = parseFloat(n.rotation.rotz);
			// This is general rot if map loaded then whole map usualy 0 0 0 
			App.scene[n.name].physics.currentBody.quaternion.setFromEuler(n.rotation.rotx, n.rotation.rotz, n.rotation.roty)
			// if(group.groupName.toString().indexOf('.RotX.') != -1) {
			// 	//App.scene[n.name].physics.currentBody.
			// 	// App.scene.mapobjsgroup_1_2.physics.currentBody.shapes[24].convexPolyhedronRepresentation.vertices
			// }

			if(n.shadows == true) {
				App.scene[n.name].activateShadows('spot')
			}
		}
		var arg = {};
		arg[n.name] = n.path;
		matrixEngine.objLoader.downloadMeshes(arg, onLoadObjS)
	},
	loadObjCorridorOPTIMISED(n, physics) {
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
			// matrixEngine already have array - good for buffers optimisation 
			// same buffer just draw with diff position - possible in opengles1.1
			// test numberOfInstance is 10 by my memory - It is good to collect from blender file obj export 
			// info abot modifiers i am not sure ...
			// collider !! must be added - no need for new   bodies 
			App.scene[n.name].instancedDraws.numberOfInstance = 10
			var S1 = new matrixEngine.utility.SWITCHER();
			// colleders visible false must be - from code 
			App.scene[n.name].instancedDraws.array_of_local_offset = [0, 0, 0];
			App.scene[n.name].instancedDraws.overrideDrawArraysInstance = function(object) {
				for(var i = 0;i < object.instancedDraws.numberOfInstance;i++) {
					if(i == 0) {
						object.instancedDraws.array_of_local_offset = [0, 0, i * 19];
						mat4.translate(object.mvMatrix, object.mvMatrix, object.instancedDraws.array_of_local_offset);
					}
					object.instancedDraws.array_of_local_offset = [0, 0, 19];
					mat4.translate(object.mvMatrix, object.mvMatrix, object.instancedDraws.array_of_local_offset);
					matrixEngine.matrixWorld.world.setMatrixUniforms(object, matrixEngine.matrixWorld.world.pMatrix, object.mvMatrix);
					matrixEngine.matrixWorld.world.GL.gl.drawElements(matrixEngine.matrixWorld.world.GL.gl[object.glDrawElements.mode], object.glDrawElements.numberOfIndicesRender, matrixEngine.matrixWorld.world.GL.gl.UNSIGNED_SHORT, 0);
				}
			};
			//
			var body = new CANNON.Body({
				mass: 0,
				position: new CANNON.Vec3(n.position[0], n.position[2], n.position[1])
			});
			App.scene[n.name].mesh.groups.forEach((group, index) => {
				// We can add the same shape several times to position child shapes within the compound.
				// tHIS WORKS ONLY FOR SIMPLY CUBE
				// i dont know who to hide collider
				// console.log('<GROUP>', group)
				var collectX0, collectX4, collectY0, collectY1, collectZ0, collectZ2;
				group.groupVert.forEach((vert, index) => {
					if(index == 0) {
						collectX0 = parseFloat(vert[0])
						collectY0 = parseFloat(vert[1])
						collectZ0 = parseFloat(vert[2])
					} else if(index == 1) {
						collectY1 = parseFloat(vert[1])
					} else if(index == 2) {
						collectZ2 = parseFloat(vert[2])
					} else if(index == 4) {
						collectX4 = parseFloat(vert[0])
					}
				})
				var calcX = collectX4 - collectX0;
				var calcXWorldPos = (collectX4 + collectX0) / 2;
				calcX = calcX / 2;
				var calcY = collectY1 - collectY0;
				var calcYWorldPox = (collectY1 + collectY0) / 2;
				calcY = calcY / 2;
				var calcZ = collectZ2 - collectZ0;
				var calcZWorldPos = (collectZ2 + collectZ0) / 2;
				calcZ = calcZ / 2;
				var shape = new CANNON.Box(new CANNON.Vec3(
					Math.abs(calcX * n.scaleCollider[0]),
					Math.abs(calcY * n.scaleCollider[1]), Math.abs(calcZ * n.scaleCollider[2])));
				body.addShape(shape, new CANNON.Vec3(calcXWorldPos + n.offsetCollider[index][0],
					calcYWorldPox + n.offsetCollider[index][1],
					calcZWorldPos + n.offsetCollider[index][2]))
			})

			App.scene[n.name].mesh.setScale({x: n.scale[0], y: n.scale[1], z: n.scale[2]})
			physics.world.addBody(body);
			App.scene[n.name].physics.currentBody = body;
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
	// test BVH
};