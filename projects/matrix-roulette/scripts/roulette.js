import * as matrixEngine from "matrix-engine"

export class MatrixRoulette {
  physics = null;
  world = null;

  constructor() {
    var App = matrixEngine.App
    // dev only
    window.App = App
    this.world = matrixEngine.matrixWorld.world;

    App.camera.SceneController = true;
    this.texTable = {
      source: ["res/images/bg-pow2.png"],
      mix_operation: "multiply",
    };
    this.texTableNumbers = {
      source: ["res/images/tabla.png"],
      mix_operation: "multiply",
    };

    this.preparePhysics()
    this.attachMatrixRay()

    matrixEngine.matrixWorld.world.Add("squareTex", 1, "table", this.texTableNumbers);
    // App.scene.table.activateShadows('spot');
    App.scene.table.position.SetY(-1.8);
    App.scene.table.position.SetZ(-6);
    App.scene.table.position.SetX(0);

    // App.scene.table.geometry.setScale(-1)
    App.scene.table.geometry.setScaleByX(5)
    App.scene.table.geometry.setScaleByY(0.9)

    // App.scene.table.shadows.activeUpdate();
    // App.scene.table.shadows.animatePositionX();
    matrixEngine.Events.camera.pitch = -35
    matrixEngine.Events.camera.zPos = 6
    matrixEngine.Events.camera.yPos = 5
  }

  attachMatrixRay() {
    window.addEventListener('ray.hit.event', (ev) => {
      console.log("You shoot the object! Nice!", ev)
      if(ev.detail.hitObject.physics.enabled == true) {
        // ev.detail.hitObject.physics.currentBody.force.set(0,0,1000)
      }
    });
  }

  preparePhysics() {
    console.log('TEWTS CONTRUCTOR')
    let gravityVector = [0, 0, -9.82];
    this.physics = this.world.loadPhysics(gravityVector);
    this.physics.addGround(matrixEngine.App, this.world, this.texTable);
  }

}