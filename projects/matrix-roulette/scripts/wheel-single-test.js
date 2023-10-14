import * as matrixEngine from "matrix-engine"
import * as CANNON from 'cannon';

/**
 * @description
 * Single object single physics body system
 * No collide because i use STATIC bodies
 */
export default class Wheel {

  ballBody = null;

  speedRollInit = 0.15;
  rollTimer = null;

  constructor(pWorld) {
    console.log('wheel constructor')
    this.pWorld = pWorld;

    this.texRollWheel = {
      source: ["res/images/ball.png"],
      mix_operation: "multiply",
    };

    this.addStaticWheel()
    this.addCenterRoll()
    this.addFields()
    // this.addBall(0.3, [-5.,-11.4, 3.2], [0,1,0])
    this.animateRoll()
  }

  orbit(cx, cy, angle, p) {

    var s = Math.sin(angle);
    var c = Math.cos(angle);
    p.x -= cx;
    p.y -= cy;
    var xnew = p.x * c - p.y * s;
    var ynew = p.x * s + p.y * c;
    p.x = xnew + cx;
    p.y = ynew + cy;
    return p;

  }

  momentOftouch = (e) => {
    console.log("Collided with body:", e.body);
    App.scene.ball.physics.currentBody.force.set(30, -850, 1);
    this.ballBody.removeEventListener("collide", this.momentOftouch);
  }

  resetBall () {
    // this.pWorld.world.addBody(this.ballBody);
  }

  addBall(j, posArg, force) {
    if(typeof j === 'undefined') j = 1
    if(typeof posArg === 'undefined') posArg = [0, -16, 1.7]

    var tex = {
      source: ["res/images/ball.png"],
      mix_operation: "multiply",
    };

    matrixEngine.matrixWorld.world.Add("sphereLightTex", j, "ball", tex);

    this.ballBody = new CANNON.Body({
      mass: 10,
      linearDamping: 0.01,
      angularDamping: 0.01,
      sleepSpeedLimit: 0.1, // Body will feel sleepy if speed<1 (speed == norm of velocity)
      sleepTimeLimit: 0.1, // Body falls asleep after 1s of sleepiness
      angularVelocity: new CANNON.Vec3(0, 0, 0),
      position: new CANNON.Vec3(posArg[0], posArg[1], posArg[2]),
      shape: new CANNON.Sphere(j),
      // collisionFilterGroup: this.GROUP1,
      // collisionFilterMask: this.GROUP2 | this.GROUP3 | this.GROUP4
    });

    this.ballBody.addEventListener("collide", this.momentOftouch);

    this.pWorld.world.addBody(this.ballBody);
    App.scene['ball'].physics.currentBody = this.ballBody;
    App.scene['ball'].physics.enabled = true;

    App.scene.ball.physics.currentBody.force.set(force[0], force[1], force[2])

  }

  addStaticWheel() {
    // matrix-engine obj
    var tex = {
      source: ["res/images/wheel-roll/skin/skin1.jpg"],
      mix_operation: "multiply",
    };

    // wheel config
    var outerRad = 12.8;
    var inner_rad = 3.125;
    var wheelsPoly = 64;

    // [matrix-engine 1.9.20] custom_type: 'torus',
    matrixEngine.matrixWorld.world.Add("generatorLightTex", 1, "bigWheel", tex, {
      custom_type: 'torus',
      slices: wheelsPoly,
      loops: wheelsPoly,
      inner_rad: inner_rad,
      outerRad: outerRad
    })

    // App.scene.bigWheel.glDrawElements.mode = 'LINES'

    // cannon
    var bigWheel = new CANNON.Body({
      mass: 0,
      type: CANNON.Body.STATIC,
      shape: CANNON.Trimesh.createTorus(outerRad, inner_rad, wheelsPoly, wheelsPoly),
      position: new CANNON.Vec3(0, -21, 0.05)
    });
    // dev
    window.bigWheel = bigWheel;

    this.pWorld.world.addBody(bigWheel);
    App.scene.bigWheel.physics.currentBody = bigWheel;
    App.scene.bigWheel.physics.enabled = true;
  }

  addCenterRoll() {
    var tex = {
      source: ["res/images/wheel-roll/skin/skin1.jpg"],
      mix_operation: "multiply",
    };

    // wheel config
    var outerRad = 6.2;
    var inner_rad = 2;
    var wheelsPoly = 128;

    // [matrix-engine 1.9.20] custom_type: 'torus',
    matrixEngine.matrixWorld.world.Add("generatorLightTex", 1, "centerWheel", tex, {
      custom_type: 'torus',
      slices: wheelsPoly,
      loops: wheelsPoly,
      inner_rad: inner_rad,
      outerRad: outerRad
    })

    App.scene.centerWheel.glDrawElements.mode = 'LINES'

    // cannon
    var centerWheel = new CANNON.Body({
      mass: 0,
      type: CANNON.Body.STATIC,
      shape: CANNON.Trimesh.createTorus(outerRad, inner_rad, wheelsPoly, wheelsPoly),
      position: new CANNON.Vec3(0, -21, 0.05)
    });
    // dev
    window.centerWheel = centerWheel;

    this.pWorld.world.addBody(centerWheel);
    App.scene.centerWheel.physics.currentBody = centerWheel;
    App.scene.centerWheel.physics.enabled = true;
  }

  animateRoll() {

    this.C = 0;
    this.rollTimer = setInterval(() => {

      for(var i = 0;i < 37;i++) {
        var p = {x: 0.1, y: 0.1, z: 0};
        p = this.orbit(0, 9, i / 5.9 + this.C, p);
        var p3 = {x: 0.1, y: 0.1, z: 0};
        p3 = this.orbit(0, 9, i / 5.9 + this.C , p3);
        App.scene['roll' + i].physics.currentBody.position.set(p.x, p.y - 30, -1.)
        App.scene['centerWheel' + i].physics.currentBody.position.set(p3.x, p3.y - 30, -0.2)
      }
      this.C = this.C + this.speedRollInit
      if(this.speedRollInit < 0.008) {
        // clearInterval(this.rollTimer)
      } else {
        this.speedRollInit = this.speedRollInit - 0.002
      }

    }, 30)

  }

  addFields() {
    for(var i = 0;i < 37;i++) {
      var tex = {
        source: ["res/images/wheel-roll/" + i + ".png"],
        mix_operation: "multiply",
      };

      var texWall = {
        source: ["res/images/wheel-roll/" + 0 + ".png"],
        mix_operation: "multiply",
      };

      matrixEngine.matrixWorld.world.Add("cubeLightTex", 0.5, "roll" + i, tex);
      var p = {x: 5, y: 5, z: 0};
      p = this.orbit(0, 0, i / 5.9, p);
      var b2 = new CANNON.Body({
        type: CANNON.Body.STATIC,
        mass: 0,
        position: new CANNON.Vec3(p.x, p.y - 19.5, -0),
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
      });
      this.pWorld.world.addBody(b2);
      App.scene['roll' + i].physics.currentBody = b2;
      App.scene['roll' + i].physics.enabled = true;

      // small field holders
      var tex = {
        source: ["res/images/field.png"],
        mix_operation: "multiply",
      };
  
      // wheel config
      var outerRad = 0.65;
      var inner_rad = 0.13;
      var wheelsPoly = 8;
  
      // [matrix-engine 1.9.20] custom_type: 'torus',
      matrixEngine.matrixWorld.world.Add("generatorLightTex", 1, "centerWheel" + i, tex, {
        custom_type: 'torus',
        slices: wheelsPoly,
        loops: wheelsPoly,
        inner_rad: inner_rad,
        outerRad: outerRad
      })
  
      // App.scene['centerWheel'+i].glDrawElements.mode = 'LINES'
  
      // cannon
      var centerWheel = new CANNON.Body({
        mass: 0,
        type: CANNON.Body.STATIC,
        shape: CANNON.Trimesh.createTorus(outerRad, inner_rad, wheelsPoly, wheelsPoly),
        // position: new CANNON.Vec3(0, -21, 0.05)
      });
      // dev
      window.centerWheel = centerWheel;
  
      this.pWorld.world.addBody(centerWheel);
      App.scene['centerWheel'+i].physics.currentBody = centerWheel;
      App.scene['centerWheel'+i].physics.enabled = true;
      //////////////

    }
  }

}