import * as matrixEngine from "matrix-engine";
import * as CANNON from 'cannon';

export const meMapLoader = {
	load: function(map, physics) {
		map.staticCubes.forEach(item => {
			matrixEngine.matrixWorld.world.Add("cubeLightTex", item.scale[0], item.name, item.texture);
			App.scene[item.name].geometry.setScaleByX(item.scale[0]);
			App.scene[item.name].geometry.setScaleByY(item.scale[1]);
			App.scene[item.name].geometry.setScaleByZ(item.scale[2]);
			var b = new CANNON.Body({
				mass: 0,
				linearDamping: 0.01,
				position: new CANNON.Vec3(item.position.x, item.position.y, item.position.z),
				shape: new CANNON.Box(new CANNON.Vec3(item.scale[0] * 2, item.scale[2] * 2, item.scale[1] * 2))
			});
			physics.world.addBody(b);
			App.scene[item.name].position.setPosition(item.position.x, item.position.y, item.position.z)
			App.scene[item.name].physics.currentBody = b;
			App.scene[item.name].physics.enabled = true;
		});
	},
	// Not work collision - probably too mush overlaping...
	geminiMap: function(numObjects, positionRange, scaleRange) {
		const map = {staticCubes: []};
		for(let i = 0;i < numObjects;i++) {
			const object = {
				name : "wall" + i,
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
	}
};