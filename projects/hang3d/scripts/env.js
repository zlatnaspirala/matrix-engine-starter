import * as matrixEngine from "matrix-engine";
import * as CANNON from 'cannon';

export const loadDoorsBVH = (world, physics) => {
	const options = {
		world: world,                   // [Required]
		autoPlay: false,                // [Optimal]
		showOnLoad: true,               // [Optimal] if autoPLay is true then showOnLoad is inactive.
		type: 'ANIMATION',              // [Optimal] 'ANIMATION' | "TPOSE'
		loop: 'playInverseAndStop',     // [Optimal] true | 'stopOnEnd' | 'playInverse' | 'stopAndReset'
		globalOffset: [-142, 350, 0],     // [Optimal]
		skeletalBoneScale: 1,           // [Optimal]
		skeletalBoneScaleXYZ: [2, 4, -0.9],
		/*skeletalBlend: {              // [Optimal] remove arg for no blend
			paramDest: 4,
			paramSrc: 4
		},*/
		boneTex: {
			source: [
				"res/images/old-tex/floor.gif",
			],
			mix_operation: "multiply",
		},
		drawTypeBone: "cubeLightTex" // pyramid | triangle | cube | square | squareTex | cubeLightTex | sphereLightTex
	};

	const filePath = "res/3d-objects/env/door-mesh.bvh";
	var door1 = new matrixEngine.MEBvhAnimation(filePath, options, () => {
		console.log('TETS')

		door1.accessBonesObject().forEach((item, index) => {
			console.log("Bones : " + door1.accessBonesObject()[index].name)
			door1.getInfoAboutJoints().allEndBones.forEach((endBone) => {
				// endBone
				var test = door1.options.boneNameBasePrefix + endBone;
				var testRoot = door1.options.boneNameBasePrefix + '__0';
				if(test == item.name || item.name == testRoot) {
					console.log("ENDBONES OBJ DESTROY NOW - NONEED HERE [or root in __0 scene object]!")
					door1.accessBonesObject()[index].selfDestroy(1)
				}
			})
		})

		setTimeout(() => {
			// This mechanics must be integrated in matrix-engine. In future.
			// scale input !?
			door1.accessBonesObject().forEach((isCollider) => {
				isCollider
				console.log("what   options.isCollider.position.x[0] !", isCollider.position.x)
				if(isCollider.name.indexOf('COLLIDER') != -1) {
					var b5 = new CANNON.Body({
						mass: 0,
						linearDamping: 0.01,
						position: new CANNON.Vec3(isCollider.position.x,
							isCollider.position.z,
							isCollider.position.y),
						shape: new CANNON.Box(new CANNON.Vec3(4, 2, 4))
					});
					b5.name = 'TRIGER-BOX1';
					physics.world.addBody(b5);
					isCollider.physics.currentBody = b5;
					isCollider.physics.enabled = true;
					console.log("ADDED COLLIDER  !", isCollider.position.y)
					console.log("ADDED COLLIDER  !", isCollider.position.z)
					isCollider.physics.currentBody.position.set(isCollider.position.x,
						isCollider.position.y,
						isCollider.position.z)

				}
			})
			// FIX for now 
			door1.openDoor()
		}, 550)
	});
	window.door1 = door1

	door1['openDoor'] = () => {
		App.myCustomEnvItems['door1'].options.loop = "stopOnEnd"
		App.myCustomEnvItems['door1'].playAnimationFromKeyframes()
		var P = App.scene['MSBone.UP.COLLIDER'].physics.currentBody.position;
		App.scene['MSBone.UP.COLLIDER'].physics.currentBody.position.set(P.x, P.y, P.z + 6)
	}

	door1['closeDoor'] = () => {
		door1.loopInverse.step = 1;
		door1.loopInverse.value_ = -door1.sumOfFrames;
		door1.actualFrame = door1.sumOfFrames;
		door1.loopInverse.status = 0;
		door1.loopInverse.on_maximum_value = () => {
			console.log('door closed. ', door1.actualFrame)
			door1.stopAnimation()
		}
		App.myCustomEnvItems['door1'].options.loop = "playInverseAndStop"
		App.myCustomEnvItems['door1'].playAnimationFromKeyframes()
		var P = App.scene['MSBone.UP.COLLIDER'].physics.currentBody.position;
		App.scene['MSBone.UP.COLLIDER'].physics.currentBody.position.set(P.x, P.y, P.z-6)
	}

	return door1;
}