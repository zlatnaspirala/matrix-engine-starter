import * as matrixEngine from "matrix-engine"
import TableEvents from "./table-events.js"
import Wheel from "./wheel.js";
import * as CANNON from 'cannon';
import {Nidza} from 'nidza';
import {create2dHUD, createStatusBoxHUD} from "./2d-draw.js";

export class MatrixRoulette {
  physics = null;
  world = null;
  // gameplay staff
  tableBet = null;
  wheelSystem = null;
  preventDBTrigger = null;
  // Top level vars
  status = {
    cameraView: 'bets'
  }

  constructor() {

    this.playerInfo = {
      balance: 1000,
      currency: '$'
    };

    var App = matrixEngine.App;

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
    this.setupCameraView('initbets')
    // nidza.js small 2d canvas lib
    this.addHUD(this.playerInfo)
    this.runVideoChat()
  }

  setupCameraView(type) {
    let OSC = matrixEngine.utility.OSCILLATOR;
    // console.log('current camera status:', this.status.cameraView)
    if(type == this.status.cameraView) return;
    console.log('current camera status:', this.status.cameraView)

    if(type == 'bets') {
      var c0 = new matrixEngine.utility.OSCILLATOR(-matrixEngine.Events.camera.pitch, 58.970000000000034, 0.05)
      console.log('matrixEngine.Events.camera.yPos ', matrixEngine.Events.camera.yPos)
      var c1 = new matrixEngine.utility.OSCILLATOR(matrixEngine.Events.camera.zPos, 11.526822219793473, 0.05)
      // trick OSC when min > max 
      var c2 = new matrixEngine.utility.OSCILLATOR(-matrixEngine.Events.camera.yPos, -6.49717201776934, 0.05)

      this.internal_flag = 0;
      this.flagc0 = false;
      this.flagc1 = false;
      this.flagc2 = false;

      c0.on_maximum_value = () => {
        console.log('c0 max')
        this.status.cameraView = 'bets'
        this.internal_flag++;
        this.flagc0 = true;
        if(this.internal_flag == 3) {
          console.log('c0 stop max')
          clearInterval(this.c0i)
        }
      }
      c1.on_maximum_value = () => {
        console.log('c1 max')
        this.status.cameraView = 'bets'
        this.internal_flag++;
        this.flagc1 = true;
        if(this.internal_flag == 3) {
          console.log('c1 stop max')
          clearInterval(this.c0i)
        }
      }
      c2.on_maximum_value = () => {
        console.log('c2 max')
        this.status.cameraView = 'bets'
        this.internal_flag++;
        this.flagc2 = true;
        if(this.internal_flag == 3) {
          console.log('c2 stop max')
          clearInterval(this.c0i)
        }
      }

      this.c0i = setInterval(() => {
        if(this.flagc0 == false) {matrixEngine.Events.camera.pitch = -c0.UPDATE()}
        if(this.flagc1 == false) {
          matrixEngine.Events.camera.zPos = c1.UPDATE()
        }
        if(this.flagc2 == false) {
          matrixEngine.Events.camera.yPos = -c2.UPDATE()
          console.log('c2', matrixEngine.Events.camera.yPos)
        }
      }, 20)

    } else if(type == 'wheel') {

      matrixEngine.Events.camera.pitch = -52.67999999999999
      matrixEngine.Events.camera.zPos = -4.6962394866880635
      matrixEngine.Events.camera.yPos = 19.500000000000007

      this.status.cameraView = 'wheel'

    } else {
      // bets
      matrixEngine.Events.camera.pitch = -58.970000000000034
      matrixEngine.Events.camera.zPos = 11.526822219793473
      matrixEngine.Events.camera.yPos = 7.49717201776934
    }

  }

  runVideoChat() {
    matrixEngine.Engine.activateNet();

    var tex = {
      source: ["res/images/field.png"],
      mix_operation: "multiply",
    };

    addEventListener('stream-loaded', (e) => {

      // Safe place for access socket io

      // 'STATUS_MR' Event is only used for Matrix Roulette
      App.network.connection.socket.on('STATUS_MR', (e) => {
        console.log('MSG FROM SERVER: ', e.message)
        if (e.message == '') {

        }
      })

      var _ = document.querySelectorAll('.media-box')
      var name = "videochat_" + e.detail.data.userId;
      _.forEach((i) => {
        var name = "videochat_" + e.detail.data.userId;
        if(e.detail.data.userId != App.network.connection.userid &&
          App.scene[name] !== 'undefined' &&
          sessionStorage.getItem('a_' + name) == null) {
          sessionStorage.setItem('a_' + name, name)
          // This is video element!
          console.log("stream-loaded => ", name)
          matrixEngine.matrixWorld.world.Add("squareTex", 3, name, tex);
          console.log('App.network.connection.getAllParticipants().length => ' + App.network.connection.getAllParticipants().length)
          App.scene[name].position.x = 10;
          App.scene[name].position.z = -20;
          App.scene[name].position.y = 7;
          App.scene[name].geometry.setScale(-1) // invert tex coords
          App.scene[name].geometry.setScaleByX(-2)
          App.scene[name].LightsData.ambientLight.set(1, 1, 1);
          // App.scene[name].net.enable = false;
          console.log('App.network.c  h => ' + App.network.connection.getAllParticipants().length)
          //  App.scene[name].net.activate();
          App.scene[name].streamTextures = matrixEngine.Engine.DOM_VT(i.children[1])
          addEventListener('net.remove-user', (event) => {
            var n = "videochat_" + event.detail.data.userid;
            if(typeof App.scene[n] !== 'undefined' &&
              typeof App.scene[n].CUSTOM_FLAG_PREVENT_DBCALL === 'undefined') {
              App.scene[n].CUSTOM_FLAG_PREVENT_DBCALL = true;
              App.scene[n].selfDestroy(1)
            }
          })
        } else {
          // own stream 

          if(App.network.connection.isInitiator == true) {
            console.log('isInitiator is TRUE!')
          }

          if(sessionStorage.getItem('alocal_' + name) == null) {
            var name = 'LOCAL_STREAM';
            matrixEngine.matrixWorld.world.Add("squareTex", 3, name, tex);
            App.scene[name].position.x = 0;
            App.scene[name].position.z = -30;
            App.scene[name].position.y = 7;
            App.scene[name].geometry.setScale(-1)
            App.scene[name].geometry.setScaleByX(-2)
            App.scene.LOCAL_STREAM.streamTextures = new matrixEngine.Engine.DOM_VT(i.children[1]);
            // TV OBJ
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
      App.onlyClicksPass = true;
      matrixEngine.raycaster.checkingProcedure(ev);
      setTimeout(() => {
        App.onlyClicksPass = false;
      }, 10)
    });

    canvas.addEventListener('mousemove', (ev) => {
      matrixEngine.raycaster.checkingProcedure(ev);
    });

    var LAST_HOVER = null;
    window.addEventListener('ray.hit.event', (ev) => {
      // all physics chips have name prefix chips_
      // must be fixed from matrix engine source !!!
      if(ev.detail.hitObject.name.indexOf('chips_') != -1 ||
        ev.detail.hitObject.name.indexOf('roll') != -1) {
        console.log("PREVENT NO CHIPS TRAY: ", ev.detail.hitObject.name)
        return;
      }
      if(ev.detail.hitObject.hoverEffect) {
        if(LAST_HOVER != null && LAST_HOVER.name != ev.detail.hitObject.name) {
          LAST_HOVER.hoverLeaveEffect(LAST_HOVER)
        } else {
          ev.detail.hitObject.hoverEffect(ev.detail.hitObject)
        }
        LAST_HOVER = ev.detail.hitObject;
      }

      if(App.onlyClicksPass != true) return;

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

      if(ev.detail.hitObject.raycast.enabled != true) {return }

      console.log('VALIDATION BALANCE', this.playerInfo.balance >= 1)
      if(this.playerInfo.balance >= 1) dispatchEvent(new CustomEvent("chip-bet", {detail: ev.detail.hitObject}))

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
    App.scene.FLOOR_STATIC.geometry.setTexCoordScaleFactor(3.5)
  }

  attachGamePlayEvents() {
    window.addEventListener('matrix.roulette.win.number', (ev) => {
      alert(ev.detail)
    })
  }

  addHUD(playerInfo) {
    // 2d canvas nidza.js lib
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
    // App.scene[n].glBlend.blendEnabled = true;
    // App.scene[n].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    // App.scene[n].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[2];
    App.scene.balance.rotation.rotx = 90;

    this.create2dHUD = create2dHUD.bind(this);

    this.create2dHUD(this).then(canvas2d => {
      App.scene.balance.streamTextures = {
        videoImage: canvas2d,
      }
    })

    addEventListener('update-balance', (e) => {

      console.log('TEST DETAILS', e.detail)
      console.log('TEST DETAILS', this.playerInfo.balance)

      var t = this.playerInfo.balance - e.detail;
      this.playerInfo.balance = t;
      roulette.nidza.access.footerLabel.elements[0].text = t
      // roulette.nidza.access.footerLabel.elements[0].activateRotator()
    })

    // funnyStar(this.nidza)

    // balanceDecorations(this.nidza)

    this.addHUDBtns()

    this.addHUDStatus()

  }

  addHUDBtns() {
    var n = 'clearBets';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, n, {
      source: ["res/images/clearH.png"],
      mix_operation: "multiply",
    });
    App.scene[n].position.SetY(-1.9);
    App.scene[n].position.SetZ(7);
    App.scene[n].position.SetX(2.8);
    App.scene[n].rotation.rotx = -90;
    App.scene[n].geometry.setScaleByX(0.83)
    App.scene[n].geometry.setScaleByY(0.5)
    App.scene[n].glBlend.blendEnabled = true;
    App.scene[n].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    App.scene[n].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[2];
  }

  addHUDStatus() {
    this.tex = {
      source: ["res/images/chip1.png"],
      mix_operation: "multiply",
    }
    var n = 'statusBox';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, n, this.tex);
    App.scene[n].position.SetY(-1.6);
    App.scene[n].position.SetZ(1.45);
    App.scene.statusBox.position.SetX(0);
    App.scene[n].geometry.setScaleByX(3.83)
    App.scene[n].geometry.setScaleByY(0.5)
    // App.scene[n].glBlend.blendEnabled = true;
    // App.scene[n].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    // App.scene[n].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[2];
    App.scene.statusBox.rotation.rotx = 122;


    createStatusBoxHUD(this.nidza, this.playerInfo).then(canvas2d => {
      App.scene.statusBox.streamTextures = {
        videoImage: canvas2d,
      }
      // addEventListener('update-balance', (e) => {
      //    console.log(' update bala from statusBox')
      // })
    })
  }

}