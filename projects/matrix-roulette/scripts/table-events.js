import * as matrixEngine from "matrix-engine"
import TableChips from './table-chips.js';


/**
 * @description
 * Player gameplay bet MAP
 * 
 */
const ROLES = {
  red: [1, 3, 5, 7, 9, 10, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
  black: [2, 4, 6, 8, 11, 13, 15, 17, 20, 24, 26, 28, 29, 31, 33, 35]
}

const rouletteMapInit = {
  TOTAL_BET: 0,
  CENTER: {"single0": 0, "single1": 0, "single2": 0, "single3": 0, "single4": 0, "single5": 0, "single6": 0, "single7": 0, "single8": 0, "single9": 0, "single10": 0, "single11": 0, "single12": 0, "single13": 0, "single14": 0, "single15": 0, "single16": 0, "single17": 0, "single18": 0, "single19": 0, "single20": 0, "single21": 0, "single22": 0, "single23": 0, "single24": 0, "single25": 0, "single26": 0, "single27": 0, "single28": 0, "single29": 0, "single30": 0, "single31": 0, "single32": 0, "single33": 0, "single34": 0, "single35": 0, "single36": 0, },
  SPLIT: {"s1_2": 0, "s1_4": 0, "s1_0": 0, "s2_0": 0, "s2_3": 0, "s2_5": 0, "s3_0": 0, "s3_6": 0, "s4_5": 0, "s4_7": 0, "s5_6": 0, "s5_8": 0, "s6_9": 0, "s7_8": 0, "s7_10": 0, "s8_9": 0, "s8_11": 0, "s9_12": 0, "s10_11": 0, "s10_13": 0, "s11_12": 0, "s11_14": 0, "s12_15": 0, "s13_14": 0, "s13_16": 0, "s14_15": 0, "s14_17": 0, "s15_18": 0, "s16_17": 0, "s16_19": 0, "s17_18": 0, "s17_20": 0, "s18_21": 0, "s19_20": 0, "s19_22": 0, "s20_21": 0, "s20_23": 0, "s21_24": 0, "s22_23": 0, "s22_25": 0, "s23_24": 0, "s23_26": 0, "s24_27": 0, "s25_26": 0, "s25_28": 0, "s26_27": 0, "s26_29": 0, "s27_30": 0, "s28_29": 0, "s28_31": 0, "s29_30": 0, "s29_32": 0, "s30_33": 0, "s31_32": 0, "s31_34": 0, "s32_33": 0, "s32_35": 0, "s33_36": 0, "s34_35": 0, "s35_36": 0},
  CORNER: {"c0_1_2_3": 0, "c1_2_4_5": 0, "c2_3_5_6": 0, "c4_5_7_8": 0, "c5_6_8_9": 0, "c7_8_10_11": 0, "c8_9_11_12": 0, "c10_11_13_14": 0, "c11_12_14_15": 0, "c13_14_16_17": 0, "c14_15_17_18": 0, "c16_17_19_20": 0, "c17_18_20_21": 0, "c19_20_22_23": 0, "c20_21_23_24": 0, "c22_23_25_26": 0, "c23_24_26_27": 0, "c25_26_28_29": 0, "c26_27_29_30": 0, "c28_29_31_32": 0, "c29_30_32_33": 0, "c31_32_34_35": 0, "c32_33_35_36": 0, },
  LINE_BET: {"l1_2_3_4_5_6": 0, "l4_5_6_7_8_9": 0, "l7_8_9_10_11_12": 0, "l10_11_12_13_14_15": 0, "l13_14_15_16_17_18": 0, "l16_17_18_19_20_21": 0, "l19_20_21_22_23_24": 0, "l22_23_24_25_26_27": 0, "l25_26_27_28_29_30": 0, "l28_29_30_31_32_33": 0, "l31_32_33_34_35_36": 0, },
  STREET: {"street0_1_2": 0, "street0_2_3": 0, "street1_2_3": 0, "street4_5_6": 0, "street7_8_9": 0, "street10_11_12": 0, "street13_14_15": 0, "street16_17_18": 0, "street19_20_21": 0, "street22_23_24": 0, "street25_26_27": 0, "street28_29_30": 0, "street31_32_33": 0, "street34_35_36": 0, },
  COLOR: {"red": 0, "black": 0, },
  EVEN_ODD: {"even": 0, "odd": 0, },
  DOZENS: {"from1_12": 0, "from13_24": 0, "from25_36": 0},
  LOW_HIGH: {"low": 0, "high": 0},
  COLUMN: {"top_col": 0, "mid_col": 0, "bot_col": 0, },
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
    this.constructDBStreets()

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
    App.scene[zero].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
    App.scene[zero].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];

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
        App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
        App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[3];
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
        var name = 's' + numID + '_' + numID2;
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
        App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
        App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
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
        var name = 's' + numID + '_' + numID2;
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
        App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
        App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
        this.registerBetPlaces.push(App.scene[name])
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
    App.scene[name].position.SetZ(this.colorTop - 1.84 + this.GENERAL_Z);
    App.scene[name].position.SetX(-4.45);
    App.scene[name].rotation.rotx = -90;
    App.scene[name].geometry.setScaleByX(-0.1)
    App.scene[name].geometry.setScaleByY(-0.1)
    App.scene[name].glBlend.blendEnabled = true;
    App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    this.registerBetPlaces.push(App.scene[name])

    name = 'trio_0_2_3';
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
    this.registerBetPlaces.push(App.scene[name])

    name = 'topline_0_1_2_3';
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
    this.registerBetPlaces.push(App.scene[name])
  }

  constructCorner() {
    var numID = 1;
    var numID2 = 2;
    var numID3 = 4;
    var numID4 = 5;
    for(var x = 0;x < 11;x++) {
      for(var y = 1;y < 3;y++) {
        var name = 'c' + numID + '_' + numID2 + '_' + numID3 + '_' + numID4;
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
    name = 'odd';
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
      var name = 'l' + numID + '_' + numID2 + '_' + numID3 + '_' + numID4 + '_' + numID5 + '_' + numID6;
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
    var win = 0;

    this.registerBetPlaces.forEach((ele) => {

      if(ele.tableEvents.chips > 0) {
        if(ele.name == 'red') {
          if(ROLES.red.indexOf(winningNumber) != -1) {
            win += ele.tableEvents.chips * ele.tableEvents.q
          }
        } else if(ele.name == 'black') {
          if(ROLES.black.indexOf(winningNumber) != -1) {
            win += ele.tableEvents.chips * ele.tableEvents.q
          }
        }
        console.log('TEST chips !!', ele.tableEvents)
        win += ele.tableEvents.chips * ele.tableEvents.q
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
      if (ele.tableEvents.chips > 0) {
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