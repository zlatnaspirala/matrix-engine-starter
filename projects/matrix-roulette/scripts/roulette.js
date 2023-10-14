import * as matrixEngine from "matrix-engine"
import TableEvents from "./table-events.js"
import Wheel from "./wheel-single-test.js";
import * as CANNON from 'cannon';

export class MatrixRoulette {
  // me staff
  physics = null;
  world = null;
  // gameplay staff
  tableBet = null;
  wheelSystem = null;

  preventDBTrigger = null;

  constructor() {
    var App = matrixEngine.App
    // dev only
    window.App = App
    this.world = matrixEngine.matrixWorld.world;
    App.camera.SceneController = true;
    App.camera.sceneControllerEdgeCameraYawRate = 0.01;
    App.camera.speedAmp = 0.01;
    
    this.preparePhysics()

    this.tableBet = new TableEvents(this.physics)
    this.wheelSystem = new Wheel(this.physics)
    this.attachMatrixRay()

    matrixEngine.Events.camera.pitch = -35
    matrixEngine.Events.camera.zPos = -6
    matrixEngine.Events.camera.yPos = 19.2
  }

  attachMatrixRay() {
    // look like inverse - inside matrix-engine must be done
    // matrixEngine.raycaster.touchCoordinate.stopOnFirstDetectedHit = true
    canvas.addEventListener('mousedown', (ev) => {
      matrixEngine.raycaster.checkingProcedure(ev);
    });

    window.addEventListener('ray.hit.event', (ev) => {
      // all physics chips have name prefix chips_
      // must be fixed from matrix engine source !!!
      if (ev.detail.hitObject.name.indexOf('chips_') != -1 ||
          ev.detail.hitObject.name.indexOf('roll') != -1) {
        console.log("PREEDVNT NO CHIPS TRAY: ", ev.detail.hitObject.name)
        return;
      }

      if (this.preventDBTrigger == null) {
        this.preventDBTrigger = Date.now()
      } else {
        var delta = Date.now() - this.preventDBTrigger;
        if (delta < 100) {
          this.preventDBTrigger = null;
          return;
        }
        this.preventDBTrigger = null;
      }

      if (ev.detail.hitObject.raycast.enabled != true) {
        return;
      }

      dispatchEvent(new CustomEvent("chip-bet",
        {detail: ev.detail.hitObject}));
      // if(ev.detail.hitObject.physics.enabled == true) {
      //   // ev.detail.hitObject.physics.currentBody.force.set(0,0,1000)
      // }
    });
  }

  preparePhysics() {
    let gravityVector = [0, 0, -9.82];
    this.physics = this.world.loadPhysics(gravityVector);
    this.physics.addGround(matrixEngine.App, this.world, {
      source: ["res/images/bg-pow2.png"],
      mix_operation: "multiply",
    });

    this.physics.broadphase = new CANNON.NaiveBroadphase();
    console.log('this.physics', this.physics)
    this.physics.world.solver.iterations = 5;
    // this.physics.world.defaultContactMaterial.contactEquationStiffness = 1e6;
    // this.physics.world.defaultContactMaterial.contactEquationRelaxation = 10;
    App.scene.FLOOR_STATIC.geometry.setScale(3)
  }

}