import * as matrixEngine from "matrix-engine"
import TableEvents from "./table-events.js"
import Wheel from "./wheel.js";
import * as CANNON from 'cannon';
import {Nidza} from 'nidza';
import {createNidzaTextureText} from "./2d-draw.js";

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

    this.nidza = new Nidza();

    matrixEngine.Events.camera.pitch = -35
    matrixEngine.Events.camera.zPos = -6
    matrixEngine.Events.camera.yPos = 19.2

    this.addHUD()

    this.runVideoChat()
  }

  runVideoChat() {
    matrixEngine.Engine.activateNet();
    // let ENUMERATORS = matrixEngine.utility.ENUMERATORS;
    addEventListener('stream-loaded', (e) => {
      var _ = document.querySelectorAll('.media-box')
      var name = "videochat-" + e.detail.data.userId;
      _.forEach((i) => {
        // App.network.connection.userid  REPRESENT LOCAL STREAM 
        if(e.detail.data.userId != App.network.connection.userid) {
          // This is video element!
          world.Add("cubeLightTex", 3, name, tex);
          App.scene[name].position.x = 0;
          App.scene[name].position.z = -20;
          // App.scene[name].rotx = 45
          // App.scene[name].rotation.rotz = -90
          App.scene[name].LightsData.ambientLight.set(1, 1, 1);
          App.scene[name].net.enable = true;
          App.scene[name].net.activate();
          App.scene[name].streamTextures = matrixEngine.Engine.DOM_VT(i.children[1])
          objGenerator(App.scene[name])
  
          App.CUSTOM_TIMER = setInterval(() => {
            try {
              if(typeof App.scene[name] !== 'undefined' && typeof App.scene[name].geometry !== 'undefined') {
                App.scene[name].geometry.texCoordsPoints.front.right_top.x += 0.001;
                App.scene[name].geometry.texCoordsPoints.front.left_bottom.x += 0.001;
                App.scene[name].geometry.texCoordsPoints.front.left_top.x += 0.001;
                App.scene[name].geometry.texCoordsPoints.front.right_bottom.x += 0.001;
              } else {
                clearInterval(App.CUSTOM_TIMER)
                App.CUSTOM_TIMER = null;
              }
            } catch(err) {
              clearInterval(App.CUSTOM_TIMER)
              App.CUSTOM_TIMER = null;
            }
          }, 1);
  
          addEventListener('net.remove-user', (event) => {
            var n = "videochat-" + event.detail.data.userid;
            if(typeof App.scene[n] !== 'undefinde' &&
              typeof App.scene[n].CUSTOM_FLAG_PREVENT_DBCALL === 'undefined') {
              App.scene[n].CUSTOM_FLAG_PREVENT_DBCALL = true;
              App.scene[n].selfDestroy(1)
            }
          })
        } else {
          // own stream 
          function onLoadObj(meshes) {
            App.meshes = meshes;
            matrixEngine.objLoader.initMeshBuffers(world.GL.gl, App.meshes.TV);
            setTimeout(function() {
              world.Add("obj", 1, "TV", tex, App.meshes.TV);
              App.scene.TV.position.setPosition(-9, 4, -15)
              App.scene.TV.rotation.rotateY(90);
              App.scene.TV.LightsData.ambientLight.set(1, 1, 1);
              App.scene.TV.streamTextures = new matrixEngine.Engine.DOM_VT(i.children[1]);
            }, 1000)
          }
          matrixEngine.objLoader.downloadMeshes({TV: "res/3d-objects/balltest2.obj"}, onLoadObj);
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
    console.log('this.physics', this.physics)
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

    createNidzaTextureText(this.nidza).then(canvas2d => {
      App.scene.balance.streamTextures = {
        videoImage: canvas2d,
      }
      addEventListener('update-balance', (e) => {
        roulette.nidza.access.footerLabel.elements[0].text = 'BLABAL'
        roulette.nidza.access.footerLabel.elements[0].activateRotator()
      })
    })

    //
    

  }

}