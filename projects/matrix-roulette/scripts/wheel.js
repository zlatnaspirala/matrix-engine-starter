import * as matrixEngine from "matrix-engine"
import * as CANNON from 'cannon';

var TTT = true;

export default class Wheel {

  b2 = null; // ball body

  constructor(pWorld) {
    // dev
    // window.CANNON = CANNON;

    console.log('wheel constructor')
    this.pWorld = pWorld;
    this.addStaticWheel()
    this.addBall('test')
  }

  momentOftouch = (e) => {
    console.log("Collided with body:", e.body);
    App.scene.balltest.physics.currentBody.force.set(30, -850, 1);
    this.b2.removeEventListener("collide", this.momentOftouch);
  }

  addBall(j) {
    if(typeof j === 'undefined') j = 1
    var tex = {
      source: ["res/images/ball.png"],
      mix_operation: "multiply",
    };
    matrixEngine.matrixWorld.world.Add("sphereLightTex", 0.2, "ball" + j, tex);
    this.b2 = new CANNON.Body({
      mass: 0.5,
      linearDamping: 0.1,
      angularDamping: 0.5,
      angularVelocity: new CANNON.Vec3(0, 0, 0),
      position: new CANNON.Vec3(-3.8, -14, 1.7),
      shape: new CANNON.Sphere(0.2)
    });


    this.b2.addEventListener("collide", this.momentOftouch);

    this.pWorld.world.addBody(this.b2);
    App.scene['ball' + j].physics.currentBody = this.b2;
    App.scene['ball' + j].physics.enabled = true;
  }

  addStaticWheel() {
    // matrix-engine obj
    var tex = {
      source: ["res/images/wheel-roll/skin/skin1.jpg"],
      mix_operation: "multiply",
    };

    // wheel config
    var outerRad = 6;
    var inner_rad = 3;
    var wheelsPoly = 128;

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