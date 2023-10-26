import * as matrixEngine from "matrix-engine"
import * as CANNON from 'cannon';

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
        this.clearAll()
      } else {
        if(e.detail.tableEvents) {
          if(roulette.status.game == 'MEDITATE') {
            this.addChip(e.detail);
            roulette.status.text.fillText('PLayed on ' + e.detail.name)
            console.log('Add chip roulette.status.game  =>', roulette.status.game)
          } else {
            console.log('Add chip PREVENT GAMEPLAY MODE WAIT_FOR_RESULTS =>')
          }
        }
      }
    })

    addEventListener("clear-chips", (e) => {
      this.clearAll()
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
}