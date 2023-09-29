import * as matrixEngine from "matrix-engine"
import * as CANNON from 'cannon';

export default class Wheel {

  constructor(pWorld) {
    // dev
    window.CANNON = CANNON;

    console.log('wheel constructor')
    this.pWorld = pWorld;
    this.addStaticWheel()

    this.addBall(111)
  }

  addBall(j) {
    if (typeof j === 'undefined') j = 1
    // for(var j = 0;j < x;j++) {
    //   setTimeout(() => {
        var tex = {
          source: ["res/images/ball.png"],
          mix_operation: "multiply",
        };
        matrixEngine.matrixWorld.world.Add("sphereLightTex", 0.1, "BALL" + j, tex);
        var b2 = new CANNON.Body({
          mass: 1,
          linearDamping: 0.005,
          angularDamping: 0.5,
          angularVelocity: new CANNON.Vec3(0.01, 0.01, 0),
          position: new CANNON.Vec3(-1.5, -16, 3),
          shape: new CANNON.Sphere(0.1)
        });

        this.pWorld.world.addBody(b2);
        App.scene['BALL'+ j].physics.currentBody = b2;
        App.scene['BALL' + j].physics.enabled = true;
    //   }, 1000)
    // }
  }

  addStaticWheel() {
    // matrxiengien obj
    var tex = {
      source: ["res/images/wheel-roll/skin/skin.jpg"],
      mix_operation: "multiply",
    };

    matrixEngine.matrixWorld.world.Add("generatorLightTex", 1, "bigWheel", tex, {
      custom_type: 'torus',
      slices: 32,
      loops: 32,
      inner_rad: 1,
      outerRad: 2
    })

    // App.scene.bigWheel.rotation.adapt_quaternion()

    // cannon
    var wheelsPoly = 32;
    var wheelInput1 = 2;
    var wheelInput2 = 1;
    var bigWheel = new CANNON.Body({
      mass: 10,
      //collisionFilterGroup: GROUP1,
      //collisionFilterMask: GROUP2,
      type: CANNON.Body.DYNAMIC,
      shape: CANNON.Trimesh.createTorus(wheelInput1, wheelInput2, wheelsPoly, wheelsPoly),
      position: new CANNON.Vec3(0, -16.5, 2)
    });
    // var testRot = new CANNON.Quaternion(0,0,0,0);
    // bigWheel.quaternion.setFromEuler(0, -Math.PI / 2, 0)
    // bigWheel.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), Math.PI / 4);
    // dev
    window.bigWheel = bigWheel;

    this.pWorld.world.addBody(bigWheel);
    App.scene.bigWheel.physics.currentBody = bigWheel;
    App.scene.bigWheel.physics.enabled = true;
  }

  addOBJS() {
    var name = 'wheel';
    return new Promise((resolve, reject) => {
      function onLoadObj(meshes) {
        try {
          matrixEngine.objLoader.initMeshBuffers(matrixEngine.matrixWorld.world.GL.gl, meshes[name]);
          var tex = {
            source: ["res/images/chip1.png"],
            mix_operation: "multiply",
          };
          matrixEngine.matrixWorld.world.Add("obj", 0.00001, name, tex, meshes[name]);
          App.scene[name].raycast.enabled = false;
          App.scene[name].position.y = 1;
          App.scene[name].mesh.setScale(0.009)
          resolve(App.scene[name])
        } catch(err) {
          reject('Loading obj chip error: ' + err)
        }
      }
      var _name = {};
      _name[name] = "res/3d-objects/chip1.obj"
      matrixEngine.objLoader.downloadMeshes(_name, onLoadObj);
    })

  }
}