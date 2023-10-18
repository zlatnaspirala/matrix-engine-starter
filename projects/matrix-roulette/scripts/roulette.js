import * as matrixEngine from "matrix-engine"
import TableEvents from "./table-events.js"
import Wheel from "./wheel.js";
import * as CANNON from 'cannon';
import {Nidza} from 'nidza';
import {create2dHUD, funnyStar} from "./2d-draw.js";

export class MatrixRoulette {
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
    this.attachGamePlayEvents()

    // 2d canvas small library
    // Text oriented - transformation also 3d context variant of components shader oriented
    this.nidza = new Nidza();

    matrixEngine.Events.camera.pitch = -35
    matrixEngine.Events.camera.zPos = -6
    matrixEngine.Events.camera.yPos = 19.2

    // nidza.js small 2d canvas lib
    this.addHUD()

    this.runVideoChat()
  }

  runVideoChat() {
    matrixEngine.Engine.activateNet();

    var tex = {
      source: ["res/images/field.png"],
      mix_operation: "multiply",
    };

    addEventListener('stream-loaded', (e) => {
      var _ = document.querySelectorAll('.media-box')

      var name = "videochat_" + e.detail.data.userId;

      _.forEach((i) => {
        var name = "videochat_" + e.detail.data.userId;
        if(e.detail.data.userId != App.network.connection.userid &&
          App.scene[name] !== 'undefined' &&
          sessionStorage.getItem('a_' + name) == null) {
          sessionStorage.setItem('a_' + name, name)
          // This is video element!
          console.log("this. stream-loaded  ", name)
          matrixEngine.matrixWorld.world.Add("squareTex", 3, name, tex);

          console.log( 'App.network.connection.getAllParticipants().length => ' + App.network.connection.getAllParticipants().length)

          App.scene[name].position.x = 10;
          App.scene[name].position.z = -20;
          App.scene[name].position.y = 7;

          App.scene[name].geometry.setScale(-1)
          App.scene[name].geometry.setScaleByX(-2)

          // App.scene[name].rotx = 45
          // App.scene[name].rotation.rotz = -90
          App.scene[name].LightsData.ambientLight.set(1, 1, 1);
          App.scene[name].net.enable = false;
          App.scene[name].net.activate();
          App.scene[name].streamTextures = matrixEngine.Engine.DOM_VT(i.children[1])

          addEventListener('net.remove-user', (event) => {
            var n = "videochat_" + event.detail.data.userid;
            if(typeof App.scene[n] !== 'undefinde' &&
              typeof App.scene[n].CUSTOM_FLAG_PREVENT_DBCALL === 'undefined') {
              App.scene[n].CUSTOM_FLAG_PREVENT_DBCALL = true;
              App.scene[n].selfDestroy(1)
            }
          })
        } else {
          // own stream 
          if(sessionStorage.getItem('alocal_' + name) == null) {
            console.log('this. stream-loaded LOCAL ')

            var name = 'LOCAL_STREAM';
            matrixEngine.matrixWorld.world.Add("squareTex", 3, name, tex);
            App.scene[name].position.x = 0;
            App.scene[name].position.z = -30;
            App.scene[name].position.y = 7;
            App.scene.LOCAL_STREAM.streamTextures = new matrixEngine.Engine.DOM_VT(i.children[1]);

            // function onLoadObj(meshes) {
            //   matrixEngine.objLoader.initMeshBuffers(matrixEngine.matrixWorld.world.GL.gl, meshes.TV);
            //   matrixEngine.matrixWorld.world.Add("obj", 1, "TV", tex, meshes.TV);
            //   App.scene.TV.position.setPosition(-20, 2, -25)
            //   App.scene.TV.mesh.setScale(7)
            //   // App.scene.TV.rotation.rotateY(90);
            //   App.scene.TV.LightsData.ambientLight.set(1, 1, 1);
            //   App.scene.TV.streamTextures = new matrixEngine.Engine.DOM_VT(i.children[1]);
            // }
            // sessionStorage.setItem('alocal_' + name, name)
            // matrixEngine.objLoader.downloadMeshes({TV: "res/3d-objects/tv.obj"}, onLoadObj);
          }
        }
      })
    })
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
      if(ev.detail.hitObject.name.indexOf('chips_') != -1 ||
        ev.detail.hitObject.name.indexOf('roll') != -1) {
        console.log("PREEDVNT NO CHIPS TRAY: ", ev.detail.hitObject.name)
        return;
      }

      if(this.preventDBTrigger == null) {
        this.preventDBTrigger = Date.now()
      } else {
        var delta = Date.now() - this.preventDBTrigger;
        if(delta < 100) {
          this.preventDBTrigger = null;
          return;
        }
        this.preventDBTrigger = null;
      }

      if(ev.detail.hitObject.raycast.enabled != true) {
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
    this.physics.world.solver.iterations = 5;
    // this.physics.world.defaultContactMaterial.contactEquationStiffness = 1e6;
    // this.physics.world.defaultContactMaterial.contactEquationRelaxation = 10;
    App.scene.FLOOR_STATIC.geometry.setScale(3)
  }

  attachGamePlayEvents() {
    window.addEventListener('matrix.roulette.win.number', (ev) => {
      alert(ev.detail)
    })
  }

  addHUD() {
    this.tex = {
      source: ["res/images/chip1.png"],
      mix_operation: "multiply",
    }
    var n = 'balance';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, n, this.tex);
    App.scene[n].position.SetY(-1.9);
    App.scene[n].position.SetZ(7);
    App.scene.balance.position.SetX(-3.1);
    App.scene[n].geometry.setScaleByX(1.83)
    App.scene[n].geometry.setScaleByY(0.5)
    App.scene[n].glBlend.blendEnabled = true;
    App.scene[n].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    App.scene[n].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[2];
    App.scene.balance.rotation.rotx = 90;

    create2dHUD(this.nidza).then(canvas2d => {
      App.scene.balance.streamTextures = {
        videoImage: canvas2d,
      }
      addEventListener('update-balance', (e) => {
        roulette.nidza.access.footerLabel.elements[0].text = 'BLABAL'
        roulette.nidza.access.footerLabel.elements[0].activateRotator()
      })
    })

    // funnyStar(this.nidza)
  }

}