
import * as matrixEngine from "matrix-engine";

export const loadDoorsBVH = (world) => {
	const options = {
		world: world,                   // [Required]
		autoPlay: false,                // [Optimal]
		showOnLoad: true,               // [Optimal] if autoPLay is true then showOnLoad is inactive.
		type: 'ANIMATION',              // [Optimal] 'ANIMATION' | "TPOSE'
		loop: 'playInverseAndStop',     // [Optimal] true | 'stopOnEnd' | 'playInverse' | 'stopAndReset'
		globalOffset: [-100, 2, 5],     // [Optimal]
		skeletalBoneScale: 1,           // [Optimal]
		/*skeletalBlend: {              // [Optimal] remove arg for no blend
			paramDest: 4,
			paramSrc: 4
		},*/
		boneTex: {
			source: [
				"res/images/n-stone.png",
			],
			mix_operation: "multiply",
		},
		drawTypeBone: "cubeLightTex" // pyramid | triangle | cube | square | squareTex | cubeLightTex | sphereLightTex
	};

	const filePath = "res/3d-objects/env/door-mesh.bvh";
	var door1 = new matrixEngine.MEBvhAnimation(filePath, options);
	window.door1 = door1

	door1['openDoor'] = () => {
		// playInverseAndStop
		App.myCustomEnvItems['door1'].options.loop = "stopOnEnd"
		App.myCustomEnvItems['door1'].playAnimation()
	}

	door1['closeDoor'] = () => {
		// playInverseAndStop
		App.myCustomEnvItems['door1'].options.loop = "playInverseAndStop"
		App.myCustomEnvItems['door1'].playAnimation()
	}


	return door1;
}