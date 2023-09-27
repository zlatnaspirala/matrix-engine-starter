import * as matrixEngine from "matrix-engine"
import {TableEvents} from "./table-events.js"

export class MatrixRoulette {
  // me staff
  physics = null;
  world = null;
  // gameplay staff
  tableBet = null;

  constructor() {
    var App = matrixEngine.App
    // dev only
    window.App = App
    this.world = matrixEngine.matrixWorld.world;
    App.camera.SceneController = true;
    App.camera.sceneControllerEdgeCameraYawRate = 0.01;

    this.tableBet = new TableEvents()

    this.preparePhysics()
    this.attachMatrixRay()

    matrixEngine.Events.camera.pitch = -35
    matrixEngine.Events.camera.zPos = 6
    matrixEngine.Events.camera.yPos = 5
  }

  attachMatrixRay() {

    // look like inverse - inside matrix-engine must be done
    // matrixEngine.raycaster.touchCoordinate.stopOnFirstDetectedHit = true

    canvas.addEventListener('mousedown', (ev) => {
      matrixEngine.raycaster.checkingProcedure(ev);
    });

    window.addEventListener('ray.hit.event', (ev) => {
      console.log("You shoot the object :", ev.detail.hitObject.name)
      if(ev.detail.hitObject.physics.enabled == true) {
        // ev.detail.hitObject.physics.currentBody.force.set(0,0,1000)
      }
    });
  }

  preparePhysics() {
    let gravityVector = [0, 0, -9.82];
    this.physics = this.world.loadPhysics(gravityVector);
    this.physics.addGround(matrixEngine.App, this.world, {
      source: ["res/images/bg-pow2.png"],
      mix_operation: "multiply",
    });
  }

}