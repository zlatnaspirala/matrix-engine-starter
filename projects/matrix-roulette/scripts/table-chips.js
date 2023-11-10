import * as matrixEngine from "matrix-engine"
import * as CANNON from 'cannon';
import {RULES} from "./table-events";

export default class TableChips {

  constructor(pWorld, registerBetPlaces) {
    this.physics = pWorld;
    this.register = [];
    this.registerBetPlaces = registerBetPlaces;

    this.tex = {
      source: ["res/images/chip1.png"],
      mix_operation: "multiply",
    };

    this.tex = {
      source: ["res/images/clear.png"],
      mix_operation: "multiply",
    };

    addEventListener("chip-bet", (e) => {
      if(e.detail.name.indexOf('clearBets') != -1) {
        dispatchEvent(new CustomEvent('clear-chips', {detail: 'CLEAR BETS'}))
      } else {
        if(e.detail.tableEvents) {
          if(roulette.status.game == 'MEDITATE') {

            this.addChip(e.detail);
            roulette.status.text.fillText('Played on ' + e.detail.name)

            if(roulette.soundsEnabled() == true) {
              matrixEngine.App.sounds.play('chip')
            }
            console.log('Add chip game status =>', roulette.status.game)
          } else {
            console.log('Add chip PREVENT MODE WAIT_FOR_RESULTS')
          }
        }
      }
    })

    addEventListener("clear-chips", (e) => {
      this.clearAll()
      dispatchEvent(new CustomEvent('SET_STATUS_LINE_TEXT', {detail: '✫CLEAR BETS✫'}))
      matrixEngine.App.sounds.play('clear')
    })

  }

  addChip(o) {
    // o is matrix engine scene obj
    var size = 0.15;
    // is not to mush interest but need be uniq
    var name = "chips_" + o.name;
    this.addObjChip(name).then((d) => {
      var b2 = new CANNON.Body({
        mass: 1,
        linearDamping: 0.01,
        position: new CANNON.Vec3(o.position.x, o.position.z, o.position.y + 0.5 + (o.tableEvents.chips * 0.16)),
        shape: new CANNON.Box(new CANNON.Vec3(size, size, 0.042))
      });
      this.physics.world.addBody(b2);
      d.physics.currentBody = b2;
      d.physics.enabled = true;

      // memo bet
      o.tableEvents.chips++;
      dispatchEvent(new CustomEvent('update-balance', {detail: 1}))
      // dispatchEvent(new CustomEvent('add-chip', { details : 1}))

      this.register.push({chipObj: d, betPlace: o})
    })
  }

  addObjChip(name) {
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

  clearAll() {
    this.register.forEach((i, index, array) => {
      array[index].chipObj.selfDestroy(1)
      console.log(' TEST CLEAR ', array[index].betPlace.tableEvents.chips)
      array[index].betPlace.tableEvents.chips = 0;
      delete array[index];
    })
  }

  removeLostChips(winNumber) {

    var winNumberColor = '';
    if(RULES.red.indexOf(parseInt(winNumber)) != -1) {
      winNumberColor = 'red'
    } else if(RULES.black.indexOf(parseInt(winNumber)) != -1) {
      winNumberColor = 'black';
    } else if(e.detail == 0) {
      winNumberColor = 'ZERO'
    }

    var test = this.register.filter(
      (o) => o.betPlace.tableEvents.chips > 0
    ).map(o => {
      console.log('ONLY PLAYED ', o)
      return o;
    })

    test.forEach((item, index, array) => {

      if(array[index].betPlace.name.indexOf('single') != -1) {
        // it is a single number
        if(winNumber != parseFloat(array[index].betPlace.name.split('gle')[1])) {
          //
          array[index].betPlace.tableEvents.chips = 0;
          array[index].chipObj.selfDestroy(1)
        }
      }
      
      console.log('WINNER CORNER remove lost chips ')
      var test = false, passedCorner = false;
      if(array[index].betPlace.name.indexOf('corner') != -1 && array[index].betPlace.name.split('orner').length == 2) {
        test = array[index].betPlace.name.split('orner')[1].split('_')

        test.forEach((num) => {
          if(winNumber == parseFloat(num)) {
            passedCorner = true
          }
        })
        test.forEach((num) => {
          if(passedCorner == false) {
            array[index].betPlace.tableEvents.chips = 0;
            array[index].chipObj.selfDestroy(1)
            passedCorner = null;
          }
        })
      }

      console.log('WINNER split remove lost chips ')
      var testSplit = false, passedSplit = false;
      if(array[index].betPlace.name.indexOf('split') != -1 && array[index].betPlace.name.split('plit').length == 2) {
        testSplit = array[index].betPlace.name.split('plit')[1].split('_')

        testSplit.forEach((num) => {
          if(winNumber == parseFloat(num)) {
            passedSplit = true
          }
        })
        testSplit.forEach((num) => {
          if(passedSplit == false) {
            array[index].betPlace.tableEvents.chips = 0;
            array[index].chipObj.selfDestroy(1)
            passedSplit = null;
          }
        })
      }

      if(winNumberColor == 'red') { // check zero name ???
        if(array[index].betPlace.name == 'black' || array[index].betPlace.name == 'single0') {
          array[index].betPlace.tableEvents.chips = 0;
          array[index].chipObj.selfDestroy(1)
          console.log('win is red reset blacks  array[index].betPlace = ', array[index].betPlace)
        }
      } else if(winNumberColor == 'black') {
        console.log('win is balck TEST FILTER2 ')
        if(array[index].betPlace.name == 'red' || array[index].betPlace.name == 'single0') {
          array[index].betPlace.tableEvents.chips = 0;
          array[index].chipObj.selfDestroy(1)
          console.log('win is black reset red  array[index].betPlace = ', array[index].betPlace)
        }
      }



    })
  }
}