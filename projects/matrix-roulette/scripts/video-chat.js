import * as matrixEngine from "matrix-engine"

export class VideoChat {

	slots = [
		true, false, false, false, false,
	];

	slotsPos = [
		{x: 4, y: 3, z: -21},
		{x: 4, y: 3, z: -20},
		{x: 4, y: 3, z: -19},
		{x: 4, y: 3, z: -18},
		{x: 4, y: 3, z: -17}
	];

	constructor(arg) {
		// local media
		this.createTV(arg)
	}

	createTV(arg) {
		var tex = {
			source: ["res/images/ball.png"],
			mix_operation: "multiply",
		};

		matrixEngine.matrixWorld.world.Add("squareTex", 2, "TV1", tex);
		App.scene.TV1.position.setPosition(-4, 4, -21)
		App.scene.TV1.streamTextures = matrixEngine.Engine.DOM_VT(arg)

		this.slots[0] = true;
	}

	getFreeSlot() {
		var r = {};
		for(var j = 0;j < this.slots.length;j++) {
			if(this.slots[j] == false) {
				r = this.slotsPos[j]
				this.slots[j] = true;
				break;
			}
		}
		return r;
	}

	createRemoteTV(arg) {
		console.log("getFreeSlot() :", getFreeSlot())
		var tex = {
			source: ["res/images/ball.png"],
			mix_operation: "multiply",
		};
		matrixEngine.matrixWorld.world.Add("squareTex", 2, "TV1", tex);
		App.scene.TV1.position.setPosition(4, 4, -21)
		App.scene.TV1.streamTextures = matrixEngine.Engine.DOM_VT(arg)
	}
}