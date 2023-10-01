import * as matrixEngine from "matrix-engine"
import * as CANNON from 'cannon';

export default class Wheel {

  constructor(pWorld) {
    // dev
    // window.CANNON = CANNON;

    console.log('wheel constructor')
    this.pWorld = pWorld;
    this.addStaticWheel()
    this.addBall('test')
  }

  addBall(j) {
    if(typeof j === 'undefined') j = 1
    var tex = {
      source: ["res/images/ball.png"],
      mix_operation: "multiply",
    };
    matrixEngine.matrixWorld.world.Add("sphereLightTex", 0.2, "ball" + j, tex);
    var b2 = new CANNON.Body({
      mass: 1,
      linearDamping: 0.005,
      angularDamping: 0.5,
      angularVelocity: new CANNON.Vec3(0.01, 0.01, 0),
      position: new CANNON.Vec3(-3.5, -14, 7),
      shape: new CANNON.Sphere(0.2)
    });

    b2.addEventListener("collide", function(e) {
      console.log("The ball just collided with the wheel!");
      console.log("Collided with body:", e.body);
      console.log("Contact between bodies:", e.contact);
    });

    this.pWorld.world.addBody(b2);
    App.scene['ball' + j].physics.currentBody = b2;
    App.scene['ball' + j].physics.enabled = true;
  }

  addStaticWheel() {
    // matrix-engine obj
    var tex = {
      source: ["res/images/wheel-roll/skin/skin1.jpg"],
      // res/images/wheel-roll/metal-separators/reflection-wheel.jpg
      // source: [" res/images/wheel-roll/center/wood.jpg"],
      mix_operation: "multiply",
    };

    // wheel config
    var outerRad = 6;
    var inner_rad = 3;
    var wheelsPoly = 64;

    // [matrix-engine 1.9.20] custom_type: 'torus',
    matrixEngine.matrixWorld.world.Add("generatorLightTex", 1, "bigWheel", tex, {
      custom_type: 'torus',
      slices: wheelsPoly,
      loops: wheelsPoly,
      inner_rad: inner_rad,
      outerRad: outerRad
    })

    App.scene.bigWheel.glDrawElements.mode = 'LINES'

    // cannon
    var bigWheel = new CANNON.Body({
      mass: 10,
      type: CANNON.Body.STATIC,
      shape: CANNON.Trimesh.createTorus(outerRad, inner_rad, wheelsPoly, wheelsPoly),
      position: new CANNON.Vec3(0, -16.5, -3)
    });
    // dev
    window.bigWheel = bigWheel;

    this.pWorld.world.addBody(bigWheel);
    App.scene.bigWheel.physics.currentBody = bigWheel;
    App.scene.bigWheel.physics.enabled = true;
  }

}