 


export class SceneAnimator {

	constructor(world){
	  world.useAnimationLine({sequenceSize: 200, totalSequence: 10});
		this.addTimelineAnim();
	}

	addTimelineAnim = () => {
		// matrixEngine.matrixWorld.world.addCommandAtSeqIndex(
		// 	function() {
		// 		console.log("WHAT EVER HERE 10 ")
		// 	}, 10
		// )

		matrixEngine.matrixWorld.world.addSubCommand(
			function() {
				console.log("do it for only 100 frame on 3 seq FRAMEID!")
			}, 100, 3
		)
	}

}