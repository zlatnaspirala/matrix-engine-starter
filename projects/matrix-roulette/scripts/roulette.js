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
      source: ["res/images/bg.jpg"],
      mix_operation: "multiply",
    };

    this.texTableNumbers = {
      source: ["res/images/tabla.png"],
      mix_operation: "multiply",
    };

    

    this.preparePhysics()
    this.attachMatrixRay()

    console.log('tets 1')

    matrixEngine.matrixWorld.world.Add("squareTex", 1, "table", this.texTableNumbers);
    // App.scene.table.activateShadows('spot');
    App.scene.table.position.SetY(-1.8);
    App.scene.table.position.SetZ(-6);
    App.scene.table.position.SetX(0);


    // App.scene.table.geometry.setScale(-1)

    App.scene.table.geometry.setScaleByX(5)
    App.scene.table.geometry.setScaleByY(0.9)
    // App.scene.table.geometry.setScaleByZ(10)

    // App.scene.table.rotation.roty = 90

    // App.scene.table.shadows.activeUpdate();

    // App.scene.table.shadows.flyArround({
    //   from: 0.01, to: 0.02, step: 0.001,
    //   centerX: 0, centerY: 0,
    //   flyArroundByIndexs: [0, 2] // Means that X,Z coords are orbiting
    // })
    console.log('tets')
    // App.scene.table.shadows.animatePositionX();

    matrixEngine.Events.camera.pitch = -35
    matrixEngine.Events.camera.zPos = 6
    matrixEngine.Events.camera.yPos = 0

    // App.scene.table.shadows.animateRadius({from: 0, to: 220, step: 2})
    setTimeout(() => {
       
      // App.scene.table.shadows.outerLimit = 2;
      // App.scene.table.shadows.innerLimit = 1;
      // App.scene.table.shadows.lightPosition[2] = 10;
      // App.scene.table.shadows.lightPosition[1] = -21;
    }, 5000)

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
    let gravityVector = [0, 0, -9.82];
    this.physics = this.world.loadPhysics(gravityVector);
    this.physics.addGround(matrixEngine.App, this.world, this.texTable);
  }

}