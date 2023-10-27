import * as matrixEngine from "matrix-engine"
import TableEvents from "./table-events.js"
import Wheel from "./wheel.js";
import * as CANNON from 'cannon';
import {Nidza} from 'nidza';
import {create2dHUD, createStatusBoxHUD, create2dHUDStatusLine} from "./2d-draw.js";
import {MTM} from 'matrix-engine-plugins';
import ClientConfig from "../client-config.js";

export class MatrixRoulette {
  physics = null;
  world = null;
  // Gameplay staff
  tableBet = null;
  wheelSystem = null;
  preventDBTrigger = null;

  // Top level vars
  status = {
    text: new MTM('WELCOME MY FRIEND!', {deltaRemove: 1, deltaFill: 40}),
    winNumberMomentDelay: 5000,
    cameraView: 'bets',
    game: 'MEDITATE'
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

    // nidza.js / 2d canvas small library
    // Text oriented - transformation also 3d context variant of components shader oriented.
    this.nidza = new Nidza();
    this.setupCameraView('initbets')
    // nidza.js small 2d canvas lib
    this.addHUD(this.playerInfo)
    this.runVideoChat()

    this.cameraInMove = false;
  }

  setupCameraView(type) {

    // let OSC = matrixEngine.utility.OSCILLATOR;
    if(type == this.status.cameraView) return;
    // console.log('current camera status:', this.status.cameraView)
    if(type == 'bets' && this.cameraInMove == false) {

      this.cameraInMove = true;
      // Disable user access to the camera
      // App.camera.SceneController = false;

      var c0 = new matrixEngine.utility.OSCILLATOR(-matrixEngine.Events.camera.pitch, 54.970000000000034, 0.2)
      var c1 = new matrixEngine.utility.OSCILLATOR(matrixEngine.Events.camera.zPos, 11.526822219793473, 0.2)
      // trick OSC when min > max 
      var c2 = new matrixEngine.utility.OSCILLATOR(-matrixEngine.Events.camera.yPos, -7.49717201776934, 0.2)

      this.internal_flag = 0;
      this.flagc0 = false;
      this.flagc1 = false;
      this.flagc2 = false;

      c0.on_maximum_value = () => {
        // console.log('c0 max')
        this.status.cameraView = 'bets'
        this.internal_flag++;
        this.flagc0 = true;
        if(this.internal_flag == 3) {
          // console.log('c0 stop max')
          // Enable user access to the camera
          clearInterval(this.c0i)
          this.c0i = null;
          this.cameraInMove = false;
          dispatchEvent(new CustomEvent('camera-view-wheel', {detail: {}}))
        }
      }
      c1.on_maximum_value = () => {
        // console.log('c1 max')
        this.status.cameraView = 'bets'
        this.internal_flag++;
        this.flagc1 = true;
        if(this.internal_flag == 3) {
          // console.log('c1 stop max')
          // Enable user access to the camera
          clearInterval(this.c0i)
          this.c0i = null;
          this.cameraInMove = false;
          dispatchEvent(new CustomEvent('camera-view-bets', {detail: {}}))
        }
      }
      c2.on_maximum_value = () => {
        // console.log('c2 max')
        this.status.cameraView = 'bets'
        this.internal_flag++;
        this.flagc2 = true;
        if(this.internal_flag == 3) {
          // console.log('c2 stop max')
          // Enable user access to the camera
          clearInterval(this.c0i)
          this.c0i = null;
          this.cameraInMove = false;
          dispatchEvent(new CustomEvent('camera-view-bets', {detail: {}}))
        }
      }

      this.c0i = setInterval(() => {
        if(this.flagc0 == false) {matrixEngine.Events.camera.pitch = -c0.UPDATE()}
        if(this.flagc1 == false) {matrixEngine.Events.camera.zPos = c1.UPDATE()}
        if(this.flagc2 == false) {matrixEngine.Events.camera.yPos = -c2.UPDATE()}
      }, 15)

    } else if(type == 'wheel' && this.cameraInMove == false) {

      this.cameraInMove = true;
      // Disable user access to the camera
      // App.camera.SceneController = false;

      // trick OSC when min > max - OSCILLATOR from matrix engine utility must be upgraded...
      var c0 = new matrixEngine.utility.OSCILLATOR(matrixEngine.Events.camera.pitch, -52.970000000000034, 0.2)
      var c1 = new matrixEngine.utility.OSCILLATOR(-matrixEngine.Events.camera.zPos, 4.6962394866880635, 0.2)
      var c2 = new matrixEngine.utility.OSCILLATOR(matrixEngine.Events.camera.yPos, 19.500000000000007, 0.2)

      this.internal_flag = 0;
      this.flagc0 = false;
      this.flagc1 = false;
      this.flagc2 = false;

      c0.on_maximum_value = () => {
        this.status.cameraView = 'wheel'
        this.internal_flag++;
        this.flagc0 = true;
        if(this.internal_flag == 3) {
          console.log('c0 stop')
          // Enable user access to the camera
          clearInterval(this.c0i)
          this.c0i = null;
          this.cameraInMove = false;
          dispatchEvent(new CustomEvent('camera-view-wheel', {detail: {}}))
        }
      }
      c1.on_maximum_value = () => {
        this.status.cameraView = 'wheel'
        this.internal_flag++;
        this.flagc1 = true;
        if(this.internal_flag == 3) {
          console.log('c1 stop', this.c0i)
          // Enable user access to the camera
          clearInterval(this.c0i)
          this.c0i = null;
          this.cameraInMove = false;
          dispatchEvent(new CustomEvent('camera-view-wheel', {detail: {}}))
        }
      }
      c2.on_maximum_value = () => {
        this.status.cameraView = 'wheel'
        this.internal_flag++;
        this.flagc2 = true;
        if(this.internal_flag == 3) {
          console.log('c2 stop')
          // Enable user access to the camera
          clearInterval(this.c0i)
          this.c0i = null;
          this.cameraInMove = false;
          dispatchEvent(new CustomEvent('camera-view-wheel', {detail: {}}))
        }
      }

      this.c0i = setInterval(() => {
        if(this.flagc0 == false) {
          matrixEngine.Events.camera.pitch = c0.UPDATE()
        }
        if(this.flagc1 == false) {
          matrixEngine.Events.camera.zPos = -c1.UPDATE()
        }
        if(this.flagc2 == false) {
          matrixEngine.Events.camera.yPos = c2.UPDATE()
        }
      }, 15)
    } else {
      // bets default
      if(this.cameraInMove == true) return;

      matrixEngine.Events.camera.pitch = -54.970000000000034
      matrixEngine.Events.camera.zPos = 11.526822219793473
      matrixEngine.Events.camera.yPos = 7.49717201776934
    }
  }

  runVideoChat() {
    // Sending class reference
    matrixEngine.Engine.activateNet(ClientConfig);

    var tex = {
      source: ["res/images/field.png"],
      mix_operation: "multiply",
    };

    addEventListener('stream-loaded', (e) => {
      // Safe place for access socket io
      // 'STATUS_MR' Event is only used for Matrix Roulette
      // It is symbolic for now - results must fake physics to preview right number.
      App.network.connection.socket.on('STATUS_MR', (e) => {
        if(e.message == 'RESULTS') {
          console.log('tick-> ', e.message)
          console.log('winNumber-> ', e.winNumber)
          dispatchEvent(new CustomEvent('RESULTS_FROM_SERVER', {detail: e.winNumber}))
        } else {
          // console.log('tick-> ', e.counter)
          if(e.message == 'MEDITATE') dispatchEvent(new CustomEvent('MEDITATE_SERVER', {detail: e.counter}))
          if(e.message == 'WAIT_FOR_RESULT') dispatchEvent(new CustomEvent('WAIT_FOR_RESULT', {detail: e.counter}))
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

  isManual() {
    if(typeof matrixEngine.utility.QueryString.server == 'undefined' ||
      matrixEngine.utility.QueryString.server == 'manual') {
      return true;
    } else {
      return false;
    }
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
        // console.log("PREVENT NO CHIPS TRAY: ", ev.detail.hitObject.name)
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

      if(ev.detail.hitObject.name == 'manualSpin') {
        if(typeof matrixEngine.utility.QueryString.server !== 'undefined' &&
          matrixEngine.utility.QueryString.server == 'manual') {
          console.log("SPIN ROULETTE PROCEDURE: ", ev.detail.hitObject.name)
          dispatchEvent(new CustomEvent('SPIN', {detail: {type: 'manual'}}))
          return;
        }
        return;
      }

      if(ev.detail.hitObject.raycast.enabled != true) {return }

      console.log('VALIDATION BALANCE', this.playerInfo.balance >= 1)
      if(this.playerInfo.balance >= 1) dispatchEvent(new CustomEvent("chip-bet", {detail: ev.detail.hitObject}))

    });
  }

  preparePhysics() {
    let gravityVector = [0, 0, -10];
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

  prepareFire() {
    setTimeout(() => {
      // clear double call
      roulette.wheelSystem.fireBall()
      removeEventListener('camera-view-wheel', this.prepareFire)
    }, this.status.winNumberMomentDelay)
  }

  attachGamePlayEvents() {

    if(this.isManual() == true) {

      window.addEventListener('matrix.roulette.win.number', (ev) => {
        // Final winning number
        console.log('Winning number: ' + ev.detail)
        setTimeout(() => {
          this.setupCameraView('bets')
        }, this.status.winNumberMomentDelay)
      })

      addEventListener('SPIN', (e) => {
        console.log('SPIN PROCEDUTE')
        addEventListener('camera-view-wheel', this.prepareFire, {passive: true})
        this.setupCameraView('wheel')
      })

    }

    // ONLY SYNTETIC - ROULETTE HAVE NOT SYSTEM FOR SET WIN NUMBER
    // IT IS THE PHYSICS REALM
    addEventListener('MEDITATE_SERVER', (e) => {
      this.status.game = 'MEDITATE';
    })

    addEventListener('WAIT_FOR_RESULT', (e) => {
      this.status.game = 'RESULTS';
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
      console.info('Event: update-balance => ', e.detail)
      var t = this.playerInfo.balance - e.detail;
      this.playerInfo.balance = t;
      roulette.nidza.access.footerLabel.elements[0].text = t
    })

    this.addHUDBtns()
    this.addHUDStatus()
  }

  addHUDBtns() {

    var n = 'bottomStatusLine';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, n, {
      source: ["res/images/spin.png"],
      mix_operation: "multiply",
    });
    App.scene[n].position.SetY(-1.9);
    App.scene[n].position.SetZ(6.1);
    App.scene[n].position.SetX(0);
    App.scene[n].rotation.rotx = -90;
    App.scene[n].geometry.setScaleByX(3.83)
    App.scene[n].geometry.setScaleByY(-0.25)
    App.scene[n].glBlend.blendEnabled = true;
    App.scene['bottomStatusLine'].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[2];
    App.scene['bottomStatusLine'].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[0];

    create2dHUDStatusLine(this.nidza, this.status).then(canvas2d => {
      App.scene.bottomStatusLine.streamTextures = {videoImage: canvas2d}
    })

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
    App.scene[n].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[2];
    App.scene[n].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[0];


    var n = 'manualSpin';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, n, {
      source: ["res/images/spin.png"],
      mix_operation: "multiply",
    });
    App.scene[n].position.SetY(-1.9);
    App.scene[n].position.SetZ(7);
    App.scene[n].position.SetX(0);
    App.scene[n].rotation.rotx = -90;
    App.scene[n].geometry.setScaleByX(0.83)
    App.scene[n].geometry.setScaleByY(0.5)
    App.scene[n].glBlend.blendEnabled = true;
    App.scene['manualSpin'].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[2];
    App.scene['manualSpin'].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[0];

    App.scene['manualSpin'].hoverEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[2];
    }

    App.scene['manualSpin'].hoverLeaveEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[2];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[0];
    }

  }

  addHUDStatus() {
    this.tex = {
      source: ["res/images/chip1.png"],
      mix_operation: "multiply",
    }
    var n = 'statusBox';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, n, this.tex);
    App.scene[n].position.SetY(-.6);
    App.scene[n].position.SetZ(1.45);
    App.scene.statusBox.position.SetX(0);
    App.scene[n].geometry.setScaleByX(3.83)
    App.scene[n].geometry.setScaleByY(1.55)
    App.scene[n].glBlend.blendEnabled = true;
    App.scene[n].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[6];
    App.scene[n].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    App.scene.statusBox.rotation.rotx = 122;

    createStatusBoxHUD(this.nidza, this.playerInfo).then(canvas2d => {
      App.scene.statusBox.streamTextures = {videoImage: canvas2d}
    })
  }

}