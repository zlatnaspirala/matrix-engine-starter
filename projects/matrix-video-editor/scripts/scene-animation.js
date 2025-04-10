import {App} from "matrix-engine";
import {world} from "matrix-engine/lib/matrix-world";

export class SceneAnimator {

	constructor(world){
		setTimeout(()=>{
			world.useAnimationLine({sequenceSize: 200, totalSequence: 10});
			this.addTimelineAnim()
		}, 2000)
	}

	addTimelineAnim = () => {
		// matrixEngine.matrixWorld.world.addCommandAtSeqIndex(
		// 	function() {
		// 		console.log("WHAT EVER HERE 10 ")
		// 	}, 10
		// )
		App.scene.title1.position.thrust = 0.1
		
		matrixEngine.matrixWorld.world.addSubCommand(
			function() {
				App.scene.title1.position.translateByX(-10);
				console.log("1 seq FRAMEID!")
			}, 150, 1
		)

		matrixEngine.matrixWorld.world.addSubCommand(
			function() {
				App.scene.title1.position.translateByX(10);
				console.log("2 seq FRAMEID!")
			}, 50, 3
		)

	}

}