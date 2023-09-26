import * as matrixEngine from "matrix-engine"

export class TableEvents {
  constructor() {
    var App = matrixEngine.App

    this.texTableNumbers = {
      source: ["res/images/tabla.png"],
      mix_operation: "multiply",
    };

    matrixEngine.matrixWorld.world.Add("squareTex", 1, "table", this.texTableNumbers);
    // App.scene.table.activateShadows('spot');
    App.scene.table.position.SetY(-1.9);
    App.scene.table.position.SetZ(-6);
    App.scene.table.position.SetX(0);

    App.scene.table.rotation.rotx = -90;

    // App.scene.table.geometry.setScale(-1)
    App.scene.table.geometry.setScaleByX(5)
    App.scene.table.geometry.setScaleByY(1.8)

    this.constructSingleNums()
    this.constructSplitNums()
  }

  constructSingleNums() {
    this.markTex = {
      source: ["res/images/senka1.png"],
      mix_operation: "multiply",
    };
    var numID = 1;
    for(var x = 0;x < 12;x++) {
      for(var y = 3;y > 0;y--) {
        var name = 'single' + numID;
        matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
        App.scene[name].position.SetY(-1.88);
        App.scene[name].position.SetZ(-8.05  + y*0.7);
        App.scene[name].position.SetX(-4.08 + x*0.7);
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
    this.markTex = {
      source: ["res/images/senka1.png"],
      mix_operation: "multiply",
    };

    var numID = 1;
    var numID2 = 2;

    // split split on 2 by column and 3 ...

    for(var x = 0;x < 12;x++) {
      for(var y = 1;y < 3;y++) {
        var name = 'split' + numID + numID2;
        matrixEngine.matrixWorld.world.Add("squareTex", 1, name, this.markTex);
        App.scene[name].position.SetY(-1.88);
        App.scene[name].position.SetZ(-7.75  + y*0.705);
        App.scene[name].position.SetX(-4.08 + x*0.7);
        App.scene[name].rotation.rotx = -90;
        App.scene[name].geometry.setScaleByX(-0.1)
        App.scene[name].geometry.setScaleByY(-0.1)
        // App.scene[name].glBlend.blendEnabled = true;
        // App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
        // App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
        numID++;
        numID2++;
      }
    }


  }
}