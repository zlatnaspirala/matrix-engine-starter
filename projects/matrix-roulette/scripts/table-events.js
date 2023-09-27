import * as matrixEngine from "matrix-engine"
import {TableChips} from './table-chips.js';
export class TableEvents {

  chips = {};

  constructor() {
    var App = matrixEngine.App

    this.texTableNumbers = {
      source: ["res/images/tabla.png"],
      mix_operation: "multiply",
    };

    this.markTex = {
      source: ["res/images/senka1.png"],
      mix_operation: "multiply",
    };

    // common position
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
    this.constructDBStreets()

    matrixEngine.matrixWorld.world.Add("squareTex", 1, "atable", this.texTableNumbers);
    App.scene.atable.position.SetY(-1.9);
    App.scene.atable.position.SetZ(-6);
    App.scene.atable.position.SetX(0);
    App.scene.atable.rotation.rotx = -90;
    App.scene.atable.geometry.setScaleByX(5)
    App.scene.atable.geometry.setScaleByY(1.8)


    this.chips = new TableChips()
  }

  constructSingleNums() {

    var zero = 'single0';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, zero, this.markTex);
    App.scene[zero].tableEvents = {
      chips: 0,
      q: 36
    };
    App.scene[zero].position.SetY(this.globalY);
    App.scene[zero].position.SetZ(-6.8);
    App.scene[zero].position.SetX(-4.8);
    App.scene[zero].rotation.rotx = -90;
    App.scene[zero].geometry.setScaleByX(-0.23)
    App.scene[zero].geometry.setScaleByY(1.1)
    App.scene[zero].glBlend.blendEnabled = true;
    App.scene[zero].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    App.scene[zero].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];

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
        App.scene[name].position.SetZ(-8.05 + y * 0.71);
        App.scene[name].position.SetX(-4.08 + x * 0.7);
        App.scene[name].rotation.rotx = -90;
        App.scene[name].geometry.setScaleByX(-0.23)
        App.scene[name].geometry.setScaleByY(-0.23)
        App.scene[name].glBlend.blendEnabled = true;
        App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
        App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
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
        var name = 'split' + numID + '_' + numID2;
        matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
        App.scene[name].tableEvents = {
          chips: 0,
          q: 18
        };
        App.scene[name].position.SetY(this.globalY);
        App.scene[name].position.SetZ(-7.75 + y * 0.705);
        App.scene[name].position.SetX(-4.08 + x * 0.7);
        App.scene[name].rotation.rotx = -90;
        App.scene[name].geometry.setScaleByX(-0.1)
        App.scene[name].geometry.setScaleByY(-0.1)
        App.scene[name].glBlend.blendEnabled = true;
        App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
        App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
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
        var name = 'split' + numID + '_' + numID2;
        matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
        App.scene[name].tableEvents = {
          chips: 0,
          q: 18
        };
        App.scene[name].position.SetY(this.globalY);
        App.scene[name].position.SetZ(-8.07 + y * 0.705);
        App.scene[name].position.SetX(-3.72 + x * 0.7);
        App.scene[name].rotation.rotx = -90;
        App.scene[name].geometry.setScaleByX(-0.1)
        App.scene[name].geometry.setScaleByY(-0.1)
        App.scene[name].glBlend.blendEnabled = true;
        App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
        App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
        numID++;
        numID2++;
      }
    }

    // zero connected
    var name = 'trio_0_1_2';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 12
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop - 1.84);
    App.scene[name].position.SetX(-4.45);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.1)
    App.scene[name].geometry.setScaleByY(-0.1)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];

    name = 'trio_0_2_3';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 12
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop - 2.5);
    App.scene[name].position.SetX(-4.45);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.1)
    App.scene[name].geometry.setScaleByY(-0.1)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];

    name = 'topline_0_1_2_3';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 9
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop - 1.04);
    App.scene[name].position.SetX(-4.45);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.1)
    App.scene[name].geometry.setScaleByY(-0.1)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];

    name = 'split_0_1';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 18
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop - 1.4);
    App.scene[name].position.SetX(-4.45);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.1)
    App.scene[name].geometry.setScaleByY(-0.1)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    name = 'split_0_2';
    // 2_5_8_11_14_17_20_23_26_29_32_35
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 18
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop - 2.15);
    App.scene[name].position.SetX(-4.45);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.1)
    App.scene[name].geometry.setScaleByY(-0.1)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    name = 'split_0_3';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 18
    };
    // 3_6_9_12_15_18_21_24_27_30_33_36
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop - 2.9);
    App.scene[name].position.SetX(-4.45);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.1)
    App.scene[name].geometry.setScaleByY(-0.1)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
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
        App.scene[name].position.SetZ(-5.6 - y * 0.705);
        App.scene[name].position.SetX(-3.72 + x * 0.7);
        App.scene[name].rotation.rotx = -90;
        App.scene[name].geometry.setScaleByX(-0.1)
        App.scene[name].geometry.setScaleByY(-0.1)
        App.scene[name].glBlend.blendEnabled = true;
        App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
        App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
        numID = numID + y;
        numID2 = numID2 + y;
        numID3 = numID3 + y;
        numID4 = numID4 + y;
      }
    }
  }

  constructColor() {
    var name = 'colorRed';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 2
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop);
    App.scene[name].position.SetX(-0.95);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.7)
    App.scene[name].geometry.setScaleByY(-0.3)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    name = 'colorBlack';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 2
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop);
    App.scene[name].position.SetX(0.5);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.7)
    App.scene[name].geometry.setScaleByY(-0.3)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
  }

  constructLowHigh() {
    var name = 'low';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 2
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop);
    App.scene[name].position.SetX(-3.75);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.7)
    App.scene[name].geometry.setScaleByY(-0.3)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    name = 'high';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 2
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop);
    App.scene[name].position.SetX(3.3);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.7)
    App.scene[name].geometry.setScaleByY(-0.3)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
  }

  constructOddEven() {
    var name = 'even';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 2
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop);
    App.scene[name].position.SetX(-2.35);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.7)
    App.scene[name].geometry.setScaleByY(-0.3)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    name = 'odd';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 2
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop);
    App.scene[name].position.SetX(1.9);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.7)
    App.scene[name].geometry.setScaleByY(-0.3)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
  }

  constructSt12() {
    var name = 'st12_1';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 3
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop - 0.6);
    App.scene[name].position.SetX(-3);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(1.35)
    App.scene[name].geometry.setScaleByY(-0.25)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    name = 'st12_2';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 3
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop - 0.6);
    App.scene[name].position.SetX(-0.24);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(1.35)
    App.scene[name].geometry.setScaleByY(-0.25)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    name = 'st12_3';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 3
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop - 0.6);
    App.scene[name].position.SetX(2.55);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(1.35)
    App.scene[name].geometry.setScaleByY(-0.25)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
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
      App.scene[name].position.SetZ(-5.56);
      App.scene[name].position.SetX(-4.08 + x * 0.7);
      App.scene[name].rotation.rotx = -90;
      App.scene[name].geometry.setScaleByX(-0.1)
      App.scene[name].geometry.setScaleByY(-0.1)
      App.scene[name].glBlend.blendEnabled = true;
      App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
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
    App.scene[name].position.SetZ(this.colorTop - 1.4);
    App.scene[name].position.SetX(4.5);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.45)
    App.scene[name].geometry.setScaleByY(-0.28)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    name = 'column_2';
    // 2_5_8_11_14_17_20_23_26_29_32_35
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 3
    };
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop - 2.15);
    App.scene[name].position.SetX(4.5);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.45)
    App.scene[name].geometry.setScaleByY(-0.28)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    name = 'column_3';
    matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
    App.scene[name].tableEvents = {
      chips: 0,
      q: 3
    };
    // 3_6_9_12_15_18_21_24_27_30_33_36
    App.scene[name].position.SetY(this.globalY);
    App.scene[name].position.SetZ(this.colorTop - 2.9);
    App.scene[name].position.SetX(4.5);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.45)
    App.scene[name].geometry.setScaleByY(-0.28)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
  }

  constructDBStreets() {
    var numID = 1;
    var numID2 = 2;
    var numID3 = 3;
    var numID4 = 4;
    var numID5 = 5;
    var numID6 = 6;
    // split 1
    for(var x = 0;x < 11;x++) {
      var name = 'dbstreet' + numID + '_' + numID2 + '_' + numID3 + '_' + numID4 + '_' + numID5 + '_' + numID6;
      matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
      App.scene[name].tableEvents = {
        chips: 0,
        q: 6
      };
      App.scene[name].position.SetY(this.globalY);
      App.scene[name].position.SetZ(-5.56);
      App.scene[name].position.SetX(-3.73 + x * 0.7);
      App.scene[name].rotation.rotx = -90;
      App.scene[name].geometry.setScaleByX(-0.1)
      App.scene[name].geometry.setScaleByY(-0.1)
      App.scene[name].glBlend.blendEnabled = true;
      App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
      App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
      numID = numID + 3;
      numID2 = numID2 + 3;
      numID3 = numID3 + 3;
      numID4 = numID4 + 3;
      numID5 = numID5 + 3;
      numID6 = numID6 + 3;
    }
  }
}