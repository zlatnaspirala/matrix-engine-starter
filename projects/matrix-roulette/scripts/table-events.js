import * as matrixEngine from "matrix-engine"
import TableChips from './table-chips.js';

/**
 * @description
 * Player gameplay bet MAP
 * 
 */
export const RULES = {
  red: [1, 3, 5, 7, 9, 10, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
  black: [2, 4, 6, 8, 11, 13, 15, 17, 20, 24, 26, 28, 29, 31, 33, 35],
  column3: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
  column2: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
  column1: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]
}

/**
 * @description
 * This class used for bet place objects
 * To memory chips data.
 */
export default class TableEvents {
  chips = {};
  registerBetPlaces = [];

  constructor(pWorld) {
    var App = matrixEngine.App

    this.texTableNumbers = {
      source: ["res/images/tabla.png"],
      mix_operation: "multiply",
    };

    this.markTex = {
      source: ["res/images/senka1.png"],
      mix_operation: "multiply",
    };

    // common position - move table bets by z axis.
    this.GENERAL_Z = 10;

    // internal commons - read only
    this.globalY = -1.88;
    this.colorTop = -4.5;

    this.constructSingleNums()
    this.constructSplitNums()
    this.constructCorner()
    this.constructColor()
    this.constructLowHigh()
    this.constructOddEven()
    this.constructSt12()
    this.constructStreets()
    this.constructColumn()
    this.constructLine()

    // Ground [physics]
    matrixEngine.matrixWorld.world.Add("squareTex", 1, "atable", this.texTableNumbers);
    App.scene.atable.raycast.enabled = false
    App.scene.atable.position.SetY(-1.95);
    App.scene.atable.position.SetZ(-6 + this.GENERAL_Z);
    App.scene.atable.position.SetX(0);
    App.scene.atable.rotation.rotx = -90;
    App.scene.atable.geometry.setScaleByX(5)
    App.scene.atable.geometry.setScaleByY(1.8)

    // new class
    this.chips = new TableChips(pWorld, this.registerBetPlaces)

    // fake results - not working for wheel just test
    // also calc for win sum.
    addEventListener('RESULTS_FROM_SERVER', (e) => {
      console.log('RESULTS_FROM_SERVER SYMBOLIC ONLY ', e.detail)
      var t = this.calculateWin(e.detail)
      console.log('RESULTS_FROM_SERVER SYMBOLIC ONLY CALCULATION FOR WIN=> ', t)
    })

  }

  constructSingleNums() {
    var zero = 'single0';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, zero, this.markTex);
    App.scene[zero].tableEvents = {
      chips: 0,
      q: 36,
    };
    App.scene[zero].position.SetY(this.globalY);
    App.scene[zero].position.SetZ(-6.8 + this.GENERAL_Z);
    App.scene[zero].position.SetX(-4.8);
    App.scene[zero].rotation.rotx = -90;
    App.scene[zero].geometry.setScaleByX(0.23)
    App.scene[zero].geometry.setScaleByY(1.1)
    App.scene[zero].glBlend.blendEnabled = true;
    App.scene[zero].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[zero].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];

    App.scene[zero].hoverEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    }

    App.scene[zero].hoverLeaveEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    }

    this.registerBetPlaces.push(App.scene[zero])

    var numID = 1;
    for(var x = 0;x < 12;x++) {
      for(var y = 3;y > 0;y--) {
        var name = 'single' + numID;
        matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
        App.scene[name].tableEvents = {
          chips: 0,
          q: 36
        };
        App.scene[name].position.SetY(this.globalY);
        App.scene[name].position.SetZ(-8.05 + y * 0.68 + this.GENERAL_Z);
        App.scene[name].position.SetX(-4.08 + x * 0.7);
        App.scene[name].rotation.rotx = -90;
        App.scene[name].geometry.setScaleByX(-0.23)
        App.scene[name].geometry.setScaleByY(-0.23)
        App.scene[name].glBlend.blendEnabled = true;
        App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
        App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];

        App.scene[name].hoverEffect = (me) => {
          me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
          me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
        }

        App.scene[name].hoverLeaveEffect = (me) => {
          me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
          me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
        }

        this.registerBetPlaces.push(App.scene[name])
        numID++;
      }
    }
  }

  constructSplitNums() {
    var numID = 1;
    var numID2 = 2;
    // split 1
    for(var x = 0;x < 12;x++) {
      for(var y = 2;y > 0;y--) {
        var name = 'split_' + numID + '_' + numID2;
        matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
        App.scene[name].tableEvents = {
          chips: 0,
          q: 18
        };
        App.scene[name].position.SetY(this.globalY);
        App.scene[name].position.SetZ(-7.75 + y * 0.705 + this.GENERAL_Z);
        App.scene[name].position.SetX(-4.08 + x * 0.7);
        App.scene[name].rotation.rotx = -90;
        App.scene[name].geometry.setScaleByX(-0.1)
        App.scene[name].geometry.setScaleByY(-0.1)
        App.scene[name].glBlend.blendEnabled = true;
        App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
        App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];

        App.scene[name].hoverEffect = (me) => {
          me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
          me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
        }

        App.scene[name].hoverLeaveEffect = (me) => {
          me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
          me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
        }

        this.registerBetPlaces.push(App.scene[name])
        numID++;
        numID2++;
      }
      numID++;
      numID2++;
    }


    // three in column
    numID = 1;
    numID2 = 4;

    // split 2
    for(var x = 0;x < 11;x++) {
      for(var y = 3;y > 0;y--) {
        var name = 'split_' + numID + '_' + numID2;
        matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
        App.scene[name].tableEvents = {
          chips: 0,
          q: 18
        };
        App.scene[name].position.SetY(this.globalY);
        App.scene[name].position.SetZ(-8.07 + y * 0.705 + this.GENERAL_Z);
        App.scene[name].position.SetX(-3.72 + x * 0.7);
        App.scene[name].rotation.rotx = -90;
        App.scene[name].geometry.setScaleByX(-0.1)
        App.scene[name].geometry.setScaleByY(-0.1)
        App.scene[name].glBlend.blendEnabled = true;
        App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
        App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];


        App.scene[name].hoverEffect = (me) => {
          me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
          me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
        }

        App.scene[name].hoverLeaveEffect = (me) => {
          me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
          me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
        }

        this.registerBetPlaces.push(App.scene[name])
        numID++;
        numID2++;
      }
    }

    // zero connected
    var name = 'street_0_1_2';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 12
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop - 1.84 + this.GENERAL_Z);
    App.scene[name].position.SetX(-4.45);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.1)
    App.scene[name].geometry.setScaleByY(-0.1)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];

    App.scene[name].hoverEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    }

    App.scene[name].hoverLeaveEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    }

    this.registerBetPlaces.push(App.scene[name])

    name = 'street_0_2_3';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 12
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop - 2.5 + this.GENERAL_Z);
    App.scene[name].position.SetX(-4.45);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.1)
    App.scene[name].geometry.setScaleByY(-0.1)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];

    App.scene[name].hoverEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    }

    App.scene[name].hoverLeaveEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    }

    this.registerBetPlaces.push(App.scene[name])

    name = 'corner0_1_2_3';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 9
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop - 1.04 + this.GENERAL_Z);
    App.scene[name].position.SetX(-4.45);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.1)
    App.scene[name].geometry.setScaleByY(-0.1)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];

    App.scene[name].hoverEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    }

    App.scene[name].hoverLeaveEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    }

    this.registerBetPlaces.push(App.scene[name])

    name = 'split_0_1';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 18
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop - 1.4 + this.GENERAL_Z);
    App.scene[name].position.SetX(-4.45);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.1)
    App.scene[name].geometry.setScaleByY(-0.1)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];

    App.scene[name].hoverEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    }

    App.scene[name].hoverLeaveEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    }

    this.registerBetPlaces.push(App.scene[name])

    name = 'split_0_2';
    // 2_5_8_11_14_17_20_23_26_29_32_35
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 18
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop - 2.15 + this.GENERAL_Z);
    App.scene[name].position.SetX(-4.45);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.1)
    App.scene[name].geometry.setScaleByY(-0.1)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];

    App.scene[name].hoverEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    }

    App.scene[name].hoverLeaveEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    }

    this.registerBetPlaces.push(App.scene[name])

    name = 'split_0_3';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 18
    };
    // 3_6_9_12_15_18_21_24_27_30_33_36
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop - 2.9 + this.GENERAL_Z);
    App.scene[name].position.SetX(-4.45);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.1)
    App.scene[name].geometry.setScaleByY(-0.1)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];

    App.scene[name].hoverEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    }

    App.scene[name].hoverLeaveEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    }
    this.registerBetPlaces.push(App.scene[name])
  }

  constructCorner() {
    var numID = 1;
    var numID2 = 2;
    var numID3 = 4;
    var numID4 = 5;
    for(var x = 0;x < 11;x++) {
      for(var y = 1;y < 3;y++) {
        var name = 'corner' + numID + '_' + numID2 + '_' + numID3 + '_' + numID4;
        matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
        App.scene[name].tableEvents = {
          chips: 0,
          q: 9
        };
        App.scene[name].position.SetY(this.globalY);
        App.scene[name].position.SetZ(-5.6 - y * 0.705 + this.GENERAL_Z);
        App.scene[name].position.SetX(-3.72 + x * 0.7);
        App.scene[name].rotation.rotx = -90;
        App.scene[name].geometry.setScaleByX(-0.1)
        App.scene[name].geometry.setScaleByY(-0.1)
        App.scene[name].glBlend.blendEnabled = true;
        App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
        App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];

        App.scene[name].hoverEffect = (me) => {
          me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
          me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
        }

        App.scene[name].hoverLeaveEffect = (me) => {
          me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
          me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
        }

        this.registerBetPlaces.push(App.scene[name])
        numID = numID + y;
        numID2 = numID2 + y;
        numID3 = numID3 + y;
        numID4 = numID4 + y;
      }
    }
  }

  constructColor() {
    var name = 'red';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 2
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop + this.GENERAL_Z);
    App.scene[name].position.SetX(-0.95);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.7)
    App.scene[name].geometry.setScaleByY(-0.3)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];

    App.scene[name].hoverEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    }

    App.scene[name].hoverLeaveEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    }

    this.registerBetPlaces.push(App.scene[name])
    name = 'black';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 2
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop + this.GENERAL_Z);
    App.scene[name].position.SetX(0.5);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.7)
    App.scene[name].geometry.setScaleByY(-0.3)
    this.registerBetPlaces.push(App.scene[name])
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    App.scene[name].hoverEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    }

    App.scene[name].hoverLeaveEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    }

  }

  constructLowHigh() {
    var name = 'low';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 2
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop + this.GENERAL_Z);
    App.scene[name].position.SetX(-3.75);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.7)
    App.scene[name].geometry.setScaleByY(-0.3)
    this.registerBetPlaces.push(App.scene[name])
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];

    App.scene[name].hoverEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    }

    App.scene[name].hoverLeaveEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    }

    name = 'high';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 2
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop + this.GENERAL_Z);
    App.scene[name].position.SetX(3.3);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.7)
    App.scene[name].geometry.setScaleByY(-0.3)
    this.registerBetPlaces.push(App.scene[name])
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];

    App.scene[name].hoverEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    }

    App.scene[name].hoverLeaveEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    }

  }

  constructOddEven() {
    var name = 'even';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 2
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop + this.GENERAL_Z);
    App.scene[name].position.SetX(-2.35);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.7)
    App.scene[name].geometry.setScaleByY(-0.3)
    this.registerBetPlaces.push(App.scene[name])
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];

    App.scene[name].hoverEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    }

    App.scene[name].hoverLeaveEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    }

    // setTimeout(() => {
    var name = 'odd';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 2
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop + this.GENERAL_Z);
    App.scene[name].position.SetX(1.9);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.7)
    App.scene[name].geometry.setScaleByY(-0.3)
    this.registerBetPlaces.push(App.scene[name])
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];

    App.scene[name].hoverEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    }

    App.scene[name].hoverLeaveEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    }

    // }, 10)

  }

  constructSt12() {
    var name = 'from1_12';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 3
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop - 0.6 + this.GENERAL_Z);
    App.scene[name].position.SetX(-3);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-1.35)
    App.scene[name].geometry.setScaleByY(-0.25)
    this.registerBetPlaces.push(App.scene[name])
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];

    App.scene[name].hoverEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    }

    App.scene[name].hoverLeaveEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    }

    name = 'from13_24';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 3
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop - 0.6 + this.GENERAL_Z);
    App.scene[name].position.SetX(-0.24);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-1.35)
    App.scene[name].geometry.setScaleByY(-0.25)
    this.registerBetPlaces.push(App.scene[name])
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];

    App.scene[name].hoverEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    }

    App.scene[name].hoverLeaveEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    }

    name = 'from25_36';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 3
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop - 0.6 + this.GENERAL_Z);
    App.scene[name].position.SetX(2.55);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-1.35)
    App.scene[name].geometry.setScaleByY(-0.25)
    this.registerBetPlaces.push(App.scene[name])
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    App.scene[name].hoverEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    }

    App.scene[name].hoverLeaveEffect = (me) => {
      App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    }
  }

  constructStreets() {
    var numID = 1;
    var numID2 = 2;
    var numID3 = 3;
    // split 1
    for(var x = 0;x < 12;x++) {
      var name = 'street' + numID + '_' + numID2 + '_' + numID3;
      matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
      App.scene[name].tableEvents = {
        chips: 0,
        q: 12
      };
      App.scene[name].position.SetY(this.globalY);
      App.scene[name].position.SetZ(-5.56 + this.GENERAL_Z);
      App.scene[name].position.SetX(-4.08 + x * 0.7);
      App.scene[name].rotation.rotx = -90;
      App.scene[name].geometry.setScaleByX(-0.1)
      App.scene[name].geometry.setScaleByY(-0.1)
      this.registerBetPlaces.push(App.scene[name])
      App.scene[name].glBlend.blendEnabled = true;
      App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
      App.scene[name].hoverEffect = (me) => {
        me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
        me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
      }

      App.scene[name].hoverLeaveEffect = (me) => {
        me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
        me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
      }

      numID = numID + 3;
      numID2 = numID2 + 3;
      numID3 = numID3 + 3;
    }
  }

  constructColumn() {
    var name = 'column_1';
    // 1_4_7_10_13_16_19_22_25_28_31_34
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 3
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop - 1.4 + this.GENERAL_Z);
    App.scene[name].position.SetX(4.5);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.45)
    App.scene[name].geometry.setScaleByY(-0.28)
    this.registerBetPlaces.push(App.scene[name])
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    App.scene[name].hoverEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    }

    App.scene[name].hoverLeaveEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    }

    name = 'column_2';
    // 2_5_8_11_14_17_20_23_26_29_32_35
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 3
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop - 2.15 + this.GENERAL_Z);
    App.scene[name].position.SetX(4.5);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.45)
    App.scene[name].geometry.setScaleByY(-0.28)
    this.registerBetPlaces.push(App.scene[name])
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    App.scene[name].hoverEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    }

    App.scene[name].hoverLeaveEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    }

    name = 'column_3';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 3
    };
    // 3_6_9_12_15_18_21_24_27_30_33_36
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop - 2.9 + this.GENERAL_Z);
    App.scene[name].position.SetX(4.5);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.45)
    App.scene[name].geometry.setScaleByY(-0.28)
    this.registerBetPlaces.push(App.scene[name])
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    App.scene[name].hoverEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    }

    App.scene[name].hoverLeaveEffect = (me) => {
      me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    }

  }

  constructLine() {
    var numID = 1;
    var numID2 = 2;
    var numID3 = 3;
    var numID4 = 4;
    var numID5 = 5;
    var numID6 = 6;
    // split 1
    for(var x = 0;x < 11;x++) {
      var name = 'line_' + numID + '_' + numID2 + '_' + numID3 + '_' + numID4 + '_' + numID5 + '_' + numID6;
      matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
      App.scene[name].tableEvents = {
        chips: 0,
        q: 6
      };
      App.scene[name].position.SetY(this.globalY);
      App.scene[name].position.SetZ(-5.56 + this.GENERAL_Z);
      App.scene[name].position.SetX(-3.73 + x * 0.7);
      App.scene[name].rotation.rotx = -90;
      App.scene[name].geometry.setScaleByX(-0.1)
      App.scene[name].geometry.setScaleByY(-0.1)
      App.scene[name].glBlend.blendEnabled = true;
      App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];

      App.scene[name].hoverEffect = (me) => {
        me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
        me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
      }

      App.scene[name].hoverLeaveEffect = (me) => {
        me.glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
        me.glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
      }

      this.registerBetPlaces.push(App.scene[name])
      numID = numID + 3;
      numID2 = numID2 + 3;
      numID3 = numID3 + 3;
      numID4 = numID4 + 3;
      numID5 = numID5 + 3;
      numID6 = numID6 + 3;
    }
  }

  calculateWin(winningNumber) {

    winningNumber = parseFloat(winningNumber)
    var win = 0;
    this.registerBetPlaces.forEach((ele) => {
      if(ele.tableEvents.chips > 0) {

        if(ele.name == 'red') {
          if(RULES.red.indexOf(winningNumber) != -1) {
            win += ele.tableEvents.chips * ele.tableEvents.q
          }
        } else if(ele.name == 'black') {
          if(RULES.black.indexOf(winningNumber) != -1) {
            win += ele.tableEvents.chips * ele.tableEvents.q
          }
        }

        if(ele.name.indexOf('single') != -1 && winningNumber == parseFloat(ele.name.split('gle')[1])) {
          win += ele.tableEvents.chips * ele.tableEvents.q
          console.log('WINNER SINGLE FIELD1  chips ', ele.tableEvents)
        }

        if(ele.name.indexOf('low') != -1 && winningNumber <= 18 && winningNumber != 0) {
          console.log('WINNER LOW FIELD1  chips ', ele.tableEvents)
          win += ele.tableEvents.chips * ele.tableEvents.q
        }

        if(ele.name.indexOf('high') != -1 && winningNumber >= 19 && winningNumber != 0) {
          console.log('WINNER HIGH FIELD1  chips ', ele.tableEvents)
          win += ele.tableEvents.chips * ele.tableEvents.q
        }

        var test = false;
        if(ele.name.indexOf('corner') != -1 && ele.name.split('orner').length == 2) {
          test = ele.name.split('orner')[1].split('_')
          test.forEach((num) => {

            if(winningNumber == parseFloat(num)) {
              console.log('WINNER CORNER FIELD1  chips ', num)
              win += ele.tableEvents.chips * ele.tableEvents.q
            }

          })
        }

        var testSplit = false;
        if(ele.name.indexOf('split') != -1 && ele.name.split('plit').length == 2) {
          // testSplit = ele.name.split('plit_')[1].split('_') no problem
          testSplit = ele.name.split('plit')[1].split('_')
          testSplit.forEach((num) => {
            if(winningNumber == parseFloat(num)) {
              console.log('WINNER SPLIT FIELD chips ', num)
              win += ele.tableEvents.chips * ele.tableEvents.q
            }
          })
        }

        var testStreet = false;
        if(ele.name.indexOf('street') != -1 && ele.name.split('treet').length == 2) {
          testStreet = ele.name.split('treet')[1].split('_')
          testStreet.forEach((num) => {
            if(winningNumber == parseFloat(num)) {
              console.log('WINNER testStreet FIELD chips ', num)
              win += ele.tableEvents.chips * ele.tableEvents.q
            }
          })
        }

        var testLine = false;
        if(ele.name.indexOf('line_') != -1 && ele.name.split('ine_').length == 2) {
          testLine = ele.name.split('ine_')[1].split('_')
          testLine.forEach((num) => {
            if(winningNumber == parseFloat(num)) {
              console.log('WINNER test Line chips ', num)
              win += ele.tableEvents.chips * ele.tableEvents.q
            }
          })
        }

        if(ele.name == 'column_1' && RULES.column1.indexOf(winningNumber) != -1) {
          console.log('WINNER column FIELD1  chips ', ele.tableEvents)
          win += ele.tableEvents.chips * ele.tableEvents.q
        }

        if(ele.name == 'column_2' && RULES.column2.indexOf(winningNumber) != -1) {
          console.log('WINNER column FIELD2  chips ', ele.tableEvents)
          win += ele.tableEvents.chips * ele.tableEvents.q
        }

        if(ele.name == 'column_3' && RULES.column3.indexOf(winningNumber) != -1) {
          console.log('WINNER column FIELD3  chips ', ele.tableEvents)
          win += ele.tableEvents.chips * ele.tableEvents.q
        }

        var isOdd = function(x) {return x & 1;};
        var isEven = function(x) {return !(x & 1);};

        if(ele.name == 'even' && isEven(winningNumber) == true) {
          console.log('WINNER even FIELD3  chips ', ele.tableEvents)
          win += ele.tableEvents.chips * ele.tableEvents.q
        }

        if(ele.name == 'odd' && isOdd(winningNumber) == true) {
          console.log('WINNER odd FIELD3  chips ', ele.tableEvents)
          win += ele.tableEvents.chips * ele.tableEvents.q
        }

        if(ele.name == 'from1_12' && winningNumber <= 12) {
          win += ele.tableEvents.chips * ele.tableEvents.q
        } else if(ele.name == 'from13_24' && winningNumber >= 13 && winningNumber <= 24) {
          win += ele.tableEvents.chips * ele.tableEvents.q
        } else if(ele.name == 'from25_36' && winningNumber >= 25) {
          win += ele.tableEvents.chips * ele.tableEvents.q
        }

      }
    })

    return win;
  }

  getBetMap(winningNumber) {
    var playerBetMap = [];
    var played = [];
    this.registerBetPlaces.forEach((ele) => {

      playerBetMap.push({
        id: ele.name,
        chips: ele.tableEvents.chips
      })

      if(ele.tableEvents.chips > 0) {
        played.push({
          id: ele.name,
          chips: ele.tableEvents.chips
        })
      }

    })

    return {
      map: playerBetMap,
      played: played
    };
  }
}