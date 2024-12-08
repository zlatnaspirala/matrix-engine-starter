
import * as matrixEngine from "matrix-engine";

export const loadDoorsBVH = (world) => {
	const options = {
		world: world,                   // [Required]
		autoPlay: false,                // [Optimal]
		showOnLoad: true,               // [Optimal] if autoPLay is true then showOnLoad is inactive.
		type: 'ANIMATION',              // [Optimal] 'ANIMATION' | "TPOSE'
		loop: 'playInverseAndStop',     // [Optimal] true | 'stopOnEnd' | 'playInverse' | 'stopAndReset'
		globalOffset: [-90, 5, 0],     // [Optimal]
		skeletalBoneScale: 1,           // [Optimal]
		skeletalBoneScaleXYZ : [2,4,0.1],
		/*skeletalBlend: {              // [Optimal] remove arg for no blend
			paramDest: 4,
			paramSrc: 4
		},*/
		boneTex: {
			source: [
				"res/images/RustPaint.jpg",
			],
			mix_operation: "multiply",
		},
		drawTypeBone: "cubeLightTex" // pyramid | triangle | cube | square | squareTex | cubeLightTex | sphereLightTex
	};

	const filePath = "res/3d-objects/env/door-mesh.bvh";
	var door1 = new matrixEngine.MEBvhAnimation(filePath, options);
	window.door1 = door1

	// If i use single bone BVH there is bone root and bone end detected like bones in my parser
	// Solution destroy object
	setTimeout(() => {

		door1.accessBonesObject().forEach((item, index) => {
			console.log("Bones : " + door1.accessBonesObject()[index].name)
			console.log("Bones : " + door1.accessBonesObject()[index].position)
		})
		
		// door1.accessBonesObject()[1].selfDestroy(1)
		// door1.accessBonesObject()[3].selfDestroy(1)
	},1000)


	

	door1['openDoor'] = () => {
		App.myCustomEnvItems['door1'].options.loop = "stopOnEnd"
		App.myCustomEnvItems['door1'].playAnimationFromKeyframes()
	}

	door1['closeDoor'] = () => {
		door1.loopInverse.step = 1;
		door1.loopInverse.value_ = -door1.sumOfFrames;
		door1.actualFrame = door1.sumOfFrames;
		door1.loopInverse.status = 0;
		console.log('....door1.actualFrame....', door1.actualFrame)
		door1.loopInverse.on_maximum_value = () => {
			console.log('....door1.actualFrame..STOP..', door1.actualFrame)
			door1.stopAnimation()
		}
		App.myCustomEnvItems['door1'].options.loop = "playInverseAndStop"
		App.myCustomEnvItems['door1'].playAnimationFromKeyframes()
	}

	return door1;
}