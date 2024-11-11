import * as matrixEngine from "matrix-engine";
import {skeletalMap} from "./skeletal.js";
import {muscularMap} from "./muscular.js";

export let loadSystemSkeletal = (App, world) => {
	return new Promise((resolve) => {
		function onLoadObj(meshes) {
			for(let key in meshes) {
				matrixEngine.objLoader.initMeshBuffers(world.GL.gl, meshes[key])
			}

			var textuteImageSamplers2 = {
				source: ["res/images/metal.png"],
				mix_operation: "multiply",
			};

			var h = [];
			for(let key in meshes) {
				var replaced = key.split(' ').join('_');
				replaced = replaced.split('.')[0]
				var id = "s_" + replaced;
				world.Add("obj", 1, id, textuteImageSamplers2, meshes[key]);
				// still must be called with method - SCALE for OBJ Mesh
				App.scene[id].mesh.setScale(-0.055)
				// App.scene[id].glBlend.blendEnabled = true;
				App.scene[id].position.z = 0;
				App.scene[id].position.y = 0;
				App.scene[id].rotation.rotx = 90;
				App.scene[id].rotation.roty = 0;

				App.scene[id].glBlend.blendEnabled = true;
				App.scene[id].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
				App.scene[id].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[2];

				App.scene[id].hoverEffect = (me) => {
					// me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
					// me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
					me.LightsData.ambientLight.set(1, 0, 0);
				}

				App.scene[id].hoverLeaveEffect = (me) => {
					me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
					me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[2];
					me.LightsData.ambientLight.set(1, 1, 1);
				}

				h.push(App.scene[id])
				resolve(h)
				// App.scene[id].rotation.rotz = 0;
				// App.scene[id].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
				// App.scene[id].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[7];
			}
			// App.scene.armor.position.y = 1;
			// App.scene.armor.LightsData.ambientLight.set(2, 2, 2);
		}

		// Load mesh data
		var skeletalMapOBJ = {};
		skeletalMap.source.forEach(element => {
			skeletalMapOBJ[element] = 'res/3d-objects/human2/skeletal/' + element;
			//`res/3d-objects/human/
		});
		matrixEngine.objLoader.downloadMeshes(skeletalMapOBJ, onLoadObj /*{ swap: [0, 1]}*/);
	})
};

export let loadSystemMuscular = (App, world) => {
	return new Promise((resolve) => {
		function onLoadObj(meshes) {
			for(let key in meshes) {
				matrixEngine.objLoader.initMeshBuffers(world.GL.gl, meshes[key])
			}

			var textuteImageSamplers2 = {
				source: ["res/images/muscular.png"],
				mix_operation: "multiply",
			};

			var h = [];
			for(let key in meshes) {
				var replaced = key.split(' ').join('_');
				replaced = replaced.split('.')[0]
				var id = "s_" + replaced;
				world.Add("obj", 1, id, textuteImageSamplers2, meshes[key]);
				// still must be called with method - SCALE for OBJ Mesh
				App.scene[id].mesh.setScale(-0.055)
				// App.scene[id].glBlend.blendEnabled = true;
				App.scene[id].position.z = 0;
				App.scene[id].position.y = 0;
				App.scene[id].rotation.rotx = 90;
				App.scene[id].rotation.roty = 0;

				App.scene[id].glBlend.blendEnabled = false;
				App.scene[id].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
				App.scene[id].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[2];

				App.scene[id].hoverEffect = (me) => {
					// me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
					// me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
					me.LightsData.ambientLight.set(1, 0, 0);
				}

				App.scene[id].hoverLeaveEffect = (me) => {
					me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
					me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[2];
					me.LightsData.ambientLight.set(1, 1, 1);
				}

				h.push(App.scene[id])
				resolve(h)
				// App.scene[id].rotation.rotz = 0;
				// App.scene[id].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
				// App.scene[id].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[7];
			}
			// App.scene.armor.position.y = 1;
			// App.scene.armor.LightsData.ambientLight.set(2, 2, 2);
		}

		// Load mesh data
		var skeletalMapOBJ = {};
		muscularMap.source.forEach(element => {
			skeletalMapOBJ[element] = 'res/3d-objects/human2/muscular-decimate/' + element;
			//`res/3d-objects/human/
		});
		matrixEngine.objLoader.downloadMeshes(skeletalMapOBJ, onLoadObj /*{ swap: [0, 1]}*/);
	})
};