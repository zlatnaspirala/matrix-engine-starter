import * as matrixEngine from "matrix-engine"
import * as CANNON from 'cannon';

export default class Wheel {

  b2 = null;

  speedRollInit = 0.2;
  rollTimer = null;

  constructor(pWorld) {
    console.log('wheel constructor')
    this.pWorld = pWorld;

    this.texRollWheel = {
      source: ["res/images/ball.png"],
      mix_operation: "multiply",
    };

    this.addStaticWheel()
    this.test()
    // this.test2()
    this.addBall('test')

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
      shape: new CANNON.Sphere(0.12)
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

  animateRoll() {

    this.C =0;
    this.rollTimer = setInterval(() => {

      for(var i = 0;i < 37;i++) {
        var p = {x: 0.2, y: 0.1, z: 0};
        p = this.orbit(0, 3, i / 5.9 + this.C, p);
        App.scene['roll' + i].physics.currentBody.position.set(p.x, p.y - 19.5, -2)
      }
      this.C = this.C + this.speedRollInit
      if (this.speedRollInit < 0.02) {
        // clearInterval(this.rollTimer)
      } else {
        this.speedRollInit = this.speedRollInit - 0.0005
      }

    }, 30)

  }

  test() {
    for(var i = 0;i < 37;i++) {
      var tex = {
        source: ["res/images/wheel-roll/" + i + ".png"],
        mix_operation: "multiply",
      };
      matrixEngine.matrixWorld.world.Add("cubeLightTex", 0.2, "roll" + i, tex);
      var p = {x: 0.2, y: 0.1, z: 0};
      p = this.orbit(0, 3, i / 5.9, p);
      var b2 = new CANNON.Body({
        type: CANNON.Body.STATIC,
        mass: 0.5,
        linearDamping: 0.1,
        angularDamping: 0.5,
        angularVelocity: new CANNON.Vec3(0, 0, 0),
        position: new CANNON.Vec3(p.x, p.y - 19.5, -2),
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 1, 0.15))
      });

      // var locRot;
      // if(i == 0) {
      //   locRot = new CANNON.Quaternion(0, 0, 0, 0);
      //   locRot.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -90 * Math.PI / 360);
      // } else {
      //   var local = -i / 5.95 - 90 * Math.PI / 360;
      //   locRot = new CANNON.Quaternion(0, 0, 0, 0);
      //   locRot.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), local);
      // }
      // b2.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), locRot);
      this.pWorld.world.addBody(b2);
      App.scene['roll' + i].physics.currentBody = b2;
      App.scene['roll' + i].physics.enabled = true;
      App.scene['roll' + i].geometry.setScaleByX(-0.4)
      App.scene['roll' + i].geometry.setScaleByY(-0.1)
      App.scene['roll' + i].geometry.setScaleByZ(-0.4)
    }
  }

  test2() {
    for(var i = 0;i < 37;i++) {
      var tex = {
        source: ["res/images/wheel-roll/" + i + ".png"],
        mix_operation: "multiply",
      };
      matrixEngine.matrixWorld.world.Add("cubeLightTex", 0.2, "roll__" + i, tex);
      var p = {x: 0.2, y: 0.1, z: 0};
      p = this.orbit(0, 3, i / 5.9, p);
      this.b2 = new CANNON.Body({
        type: CANNON.Body.STATIC,
        mass: 0.5,
        linearDamping: 0.1,
        angularDamping: 0.5,
        angularVelocity: new CANNON.Vec3(0, 0, 0),
        position: new CANNON.Vec3(p.x, p.y - 19, -2),
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 1, 0.15))
      });
      this.pWorld.world.addBody(this.b2);
      App.scene['roll__' + i].physics.currentBody = this.b2;
      App.scene['roll__' + i].physics.enabled = true;
    }
  }

  // test 
  initWheelRoll() {

    var TOTAL_Y = 5.3;
    var s1 = 1;
    var s2 = .35;
    var s3 = .15;
    var mass = 1;
    for(var i = 0;i < 37;i++) {

      var help = {x: 1, y: -6, z: 1};
      help = this.orbit(3, 3, i / 5, help);
      var x = help.x;
      var y = 10;
      var z = help.y;
      var locRot = null;

      // console.log('TEST x ', help )

      var body = new CANNON.Body({
        mass: mass,
        position: new CANNON.Vec3(x, 5, -z),
        type: CANNON.Body.STATIC,
        shape: new CANNON.Box(new CANNON.Vec3(0.5 * s1, 0.5 * s2, 0.5 * s3))
      });

      if(i == 0) {
        locRot = new CANNON.Quaternion(0, 0, 0, 0);
        locRot.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -90 * Math.PI / 360);
      } else {
        var local = -i / 5.95 - 90 * Math.PI / 360;
        locRot = new CANNON.Quaternion(0, 0, 0, 0);
        locRot.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), local);
      }

      body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), locRot);
      // var shape = new CANNON.Box(new CANNON.Vec3(0.5 * s1, 0.5 * s2, 0.5 * s3));
      // body.addShape(shape);
      matrixEngine.matrixWorld.world.Add("cubeLightTex", 1, "rollwheelpart1_" + i, this.texRollWheel);
      // body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), 5.23 * Math.PI / 32);
      console.log('TEST body ', body.position)
      this.pWorld.world.addBody(body);
      App.scene['rollwheelpart1_' + i].geometry.setScale(0.5 * s1, 0.5 * s2, 0.5 * s3)
      App.scene['rollwheelpart1_' + i].raycast.enabled = false;
      App.scene['rollwheelpart1_' + i].physics.currentBody = body;
      App.scene['rollwheelpart1_' + i].physics.enabled = true;
    }




    // initWheelRing();

  }

  initWheelRollS() {

    var s1 = 1;
    var s2 = .15;
    var s3 = .72;

    var mass = 5;
    var body = new CANNON.Body({
      mass: mass,
      position: new CANNON.Vec3(0, TOTAL_Y - 0.3, 0),
      type: CANNON.Body.STATIC,
    });

    body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 32);

    for(var i = 0;i < 37;i++) {
      var shape = new CANNON.Box(new CANNON.Vec3(0.5 * s1, 0.5 * s2, 0.5 * s3));
      var help = {x: 3, y: 3, z: 0};
      help = this.orbit(0, 0, i / 5.89, help);
      var x = help.x;
      var y = 10;
      var z = help.y;
      var startUpAngle = -90;
      var locRot = null;

      if(i == 0) {
        locRot = new CANNON.Quaternion(0, 0, 0, 0);
        locRot.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), (startUpAngle) * Math.PI / 360);
      } else {
        var local = -i / 5.85 + startUpAngle * Math.PI / 360;
        locRot = new CANNON.Quaternion(0, 0, 0, 0);
        locRot.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), local);
      }
      shape.wheelnum = i + 1;
      body.addShape(shape, new CANNON.Vec3(x, 6, z), locRot);
    }

    this.pWorld.world.addBody(body);

    App.scene['rollwheelpart2_'].physics.currentBody = body;

    var materials = [];
    var matShema = [
      0, 32, 15, 19, 4, 21, 2,
      25, 17, 34, 6, 27, 13, 36,
      11, 30, 8, 23, 10, 5, 24,
      16, 33, 1, 20, 14, 31, 9, 22,
      18, 29, 7, 28, 12, 35, 3, 26];

    App.matShema = matShema;

    matrixEngine.matrixWorld.world.Add("cubeLightTex", 1, "rollwheelpart2_", this.texRollWheel);

    for(var j = 0;j < 37;j++) {
      materials.push({
        source: ["res/images/wheel-roll/numbers-128/" + matShema[j] + ".png"],
        mix_operation: "multiply"
      });
    }

    // demo.addVisual(body, materials);

  }

}