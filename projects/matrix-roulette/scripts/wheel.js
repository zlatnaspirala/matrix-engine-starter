import * as matrixEngine from "matrix-engine"
import * as CANNON from 'cannon';

/**
 * @description
 * Multi shapes must be implemented on matrix-engine project level.
 */
window.CANNON = CANNON
export default class Wheel {

  speedRollInit = 0.01;
  rollTimer = null;
  // Collision filter groups - must be powers of 2!
  GROUP1 = 1;
  GROUP2 = 2;
  GROUP3 = 4;
  GROUP4 = 8;

  constructor(pWorld) {
    // console.log('wheel constructor')
    this.C = 0;
    this.pWorld = pWorld;
    this.texRollWheel = {
      source: ["res/images/ball.png"],
      mix_operation: "multiply",
    };

    this.addStaticWheel()
    this.createWheelRoll()
    this.addBall('test')
    // this.animateRoll()
    addEventListener('spin', this.spin)
  }

  spin() {
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
    App.scene.balltest.physics.currentBody.force.set(30, -850, 1);
    this.b2.removeEventListener("collide", this.momentOftouch);
  }

  addBall(j, posArg) {
    if(typeof j === 'undefined') j = 1
    if(typeof posArg === 'undefined') posArg = [0, -16, 1.7]

    var tex = {
      source: ["res/images/ball.png"],
      mix_operation: "multiply",
    };

    matrixEngine.matrixWorld.world.Add("sphereLightTex", j, "ball" + j, tex);

    this.b2 = new CANNON.Body({
      mass: 10,
      linearDamping: 0.05,
      angularDamping: 0.05,
      angularVelocity: new CANNON.Vec3(0, 0, 0),
      // position: new CANNON.Vec3(-3.8, -14, 1.7),
      // position: new CANNON.Vec3(-0, -16, 1.7),
      position: new CANNON.Vec3(posArg[0], posArg[1], posArg[2]),
      shape: new CANNON.Sphere(j),

      collisionFilterGroup: this.GROUP1,
      collisionFilterMask: this.GROUP2 | this.GROUP3 | this.GROUP4

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
    var inner_rad = 3.3;
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

  animateRoll() {

    var STEP = 0;
    this.rollTimer = setInterval(() => {
      for(var i = 0;i < 18;i++) {
        App.scene['roll' + i].rotation.roty =
          matrixEngine.utility.radToDeg(App.scene['roll' + i].physics.currentBody.quaternion.toAxisAngle()[1]);
        var locRot;
        if(STEP > 360) {
          STEP = 0
        }
        var N = (i * 20 + STEP) * Math.PI / 360;
        locRot = new CANNON.Quaternion(0, 0, 0, 0);
        locRot.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), N);

        App.scene['roll' + i].physics.currentBody.quaternion.copy(locRot)

        // numbers
        App.scene['roll__' + i].rotation.roty =
          matrixEngine.utility.radToDeg(App.scene['roll__' + i].physics.currentBody.quaternion.toAxisAngle()[1]);
        var locRot;
        if(STEP > 360) {
          STEP = 0
        }
        var N = (i * 20 + 10 + STEP) * Math.PI / 360;
        locRot = new CANNON.Quaternion(0, 0, 0, 0);
        locRot.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), N);
        App.scene['roll__' + i].physics.currentBody.quaternion.copy(locRot)
      }

      STEP = STEP + 1;

      this.C = this.C + this.speedRollInit
      if(this.speedRollInit < 0.02) {
        // clearInterval(this.rollTimer)
      } else {
        this.speedRollInit = this.speedRollInit - 0.0005
      }
    }, 12)
  }

  createWheelRoll() {

    var tex = {
      source: ["res/images/wheel-roll/metal/1-low.png"],
      mix_operation: "multiply",
    };

    var tex2 = {
      source: ["res/images/bar.png"],
      mix_operation: "multiply",
    };

    // var testb = new CANNON.Body({
    //   type: CANNON.Body.STATIC,
    //   mass: 0,
    //   linearDamping: 0.1,
    //   angularDamping: 0.5,
    //   position: new CANNON.Vec3(0, -16, -1)
    // });

    // var texField = {
    //   source: ["res/images/wheel-roll/" + 0 + ".png"],
    //   mix_operation: "multiply",
    // };
    // matrixEngine.matrixWorld.world.Add("cubeLightTex", 0.2, "rolltest", texField);

    // // var locRot1;
    // //   var local = 0 * Math.PI / 360;
    // //   locRot1 = new CANNON.Quaternion(0, 0, 0, 0);
    // //   locRot1.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), local);
    //   var shape = new CANNON.Box(new CANNON.Vec3(0.2, 3, 0.2))
    //   // testb.addShape(shape, new CANNON.Vec3(0, 0 - 16.5, -2), locRot1)
    //   testb.addShape(shape)
    //   App.scene['rolltest'].raycast.enabled = false;
    //   // App.scene['rolltest' ].geometry.setScaleByX(-0.1)
    //   // App.scene['rolltest'].geometry.setScaleByY(-0.3)
    //   App.scene['rolltest'].geometry.setScaleByZ(2.6)
    //   App.scene['rolltest'].physics.currentBody = testb;
    //   App.scene['rolltest'].physics.enabled = true;
    //   this.pWorld.world.addBody(testb);
    /////////////////////////

    var GLOBAL_Z = -16.5

    var J = 0;
    for(var i = 0;i < 18;i++) {

      var locRot;
      var local = (i * 20) * Math.PI / 360;
      locRot = new CANNON.Quaternion(0, 0, 0, 1);
      locRot.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), local);

      var GLOBAL_Y = -1.6
      // if(i == 9) GLOBAL_Y = -0.5
      if (i == 17) GLOBAL_Y = -0.8

      var b2 = new CANNON.Body({
        // type: CANNON.Body.STATIC,
        mass: 0,
        // linearDamping: 0.1,
        // angularDamping: 0.5,
        quaternion: locRot,
        position: new CANNON.Vec3(0, GLOBAL_Z, GLOBAL_Y),
        // collisionFilterGroup:  ( i == 17 ? this.GROUP4 : this.GROUP2),
        collisionFilterGroup: this.GROUP2,
        collisionFilterMask: this.GROUP1
      });

      b2.fixedRotation = true;

      if(i == 9) GLOBAL_Y = -1.65
      if(i == 10) GLOBAL_Y = -1.6

      var b3 = new CANNON.Body({
        type: CANNON.Body.STATIC,
        mass: 0,
        // linearDamping: 0.1,
        // angularDamping: 0.5,
        position: new CANNON.Vec3(0, GLOBAL_Z, -1.7),
        collisionFilterGroup: this.GROUP3,
        collisionFilterMask: this.GROUP1
      });

      var texField = {
        source: ["res/images/wheel-roll/" + i + ".png"],
        mix_operation: "multiply",
      };

      matrixEngine.matrixWorld.world.Add("cubeLightTex", 0.2, "roll" + i, texField);
      if(i == 0) {
        matrixEngine.matrixWorld.world.Add("cubeLightTex", 0.1, "roll__" + i, tex2);
      } else {
        matrixEngine.matrixWorld.world.Add("cubeLightTex", 0.1, "roll__" + i, tex);
      }
      var shape = new CANNON.Box(new CANNON.Vec3(0.1, 3, 0.1))
      b2.addShape(shape)
      App.scene['roll__' + i].raycast.enabled = false;
      // App.scene['roll__' + i].geometry.setScaleByX(-0.1)
      // App.scene['roll__' + i].geometry.setScaleByY(-0.3)
      App.scene['roll__' + i].geometry.setScaleByX(3.1)
      App.scene['roll__' + i].physics.currentBody = b2;
      App.scene['roll__' + i].physics.enabled = true;
      this.pWorld.world.addBody(b2);

      // NUMBERS FIELDS
      var locRotF;
      var localF = (i * 20 + 10) * Math.PI / 360;
      locRotF = new CANNON.Quaternion(0, 0, 0, 0);
      locRotF.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), localF);
      var shape = new CANNON.Box(new CANNON.Vec3(0.2, 3, 0.1))
      b3.addShape(shape, undefined, locRotF)
      App.scene['roll' + i].raycast.enabled = false;
      // App.scene['roll' + i].geometry.setScaleByX(-0.1)
      App.scene['roll' + i].geometry.setScaleByY(-0.3)
      App.scene['roll' + i].geometry.setScaleByZ(2.6)
      App.scene['roll' + i].geometry.setTexCoordScaleXFactor(-1);
      App.scene['roll' + i].geometry.setTexCoordScaleYFactor(-5);

      App.scene['roll' + i].custom.gl_texture = function(object, t) {
        var world = matrixEngine.matrixWorld.world;
        world.GL.gl.bindTexture(world.GL.gl.TEXTURE_2D, object.textures[t]);
        world.GL.gl.texParameteri(world.GL.gl.TEXTURE_2D, world.GL.gl.TEXTURE_MAG_FILTER, world.GL.gl.LINEAR);
        world.GL.gl.texParameteri(world.GL.gl.TEXTURE_2D, world.GL.gl.TEXTURE_MIN_FILTER, world.GL.gl.LINEAR);
        world.GL.gl.texParameteri(world.GL.gl.TEXTURE_2D, world.GL.gl.TEXTURE_WRAP_S, world.GL.gl.REPEAT);
        world.GL.gl.texParameteri(world.GL.gl.TEXTURE_2D, world.GL.gl.TEXTURE_WRAP_T, world.GL.gl.REPEAT);
        world.GL.gl.texImage2D(world.GL.gl.TEXTURE_2D, 0, world.GL.gl.RGB5_A1,
          world.GL.gl.RGB5_A1, world.GL.gl.UNSIGNED_BYTE, object.textures[t].image)
      }

      App.scene['roll' + i].physics.currentBody = b3;
      App.scene['roll' + i].physics.enabled = true;

      setTimeout(function() {
        for(var i = 0;i < 18;i++) {
          App.scene['roll' + i].geometry.setTexCoordScaleXFactor(-1);
          App.scene['roll' + i].geometry.setTexCoordScaleYFactor(-5);
        }
      }, 500)

      this.pWorld.world.addBody(b3);

      // App.scene.ROLL_ROOT_NUM.subObjs.push(App.scene['roll' + i])
    }

    // for(var i = 0;i < 18;i++) {   }

  }
}