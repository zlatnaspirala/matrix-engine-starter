import * as matrixEngine from "matrix-engine"

export class MatrixRoulette {

  constructor() {

    var App = matrixEngine.App

    var textuteImageSamplers = {
      source: ["res/images/bg.jpg"],
      mix_operation: "multiply",
    };
    
    matrixEngine.matrixWorld.world.Add("cubeLightTex", 1, "table", textuteImageSamplers);
    App.scene.table.activateShadows();
    App.scene.table.position.SetY(0);
    App.scene.table.position.SetZ(-17);
    App.scene.table.position.SetX(0);

    App.scene.table.shadows.activeUpdate();
    App.scene.table.shadows.animatePositionY();
    App.scene.table.shadows.outerLimit = 1;
    App.scene.table.shadows.animateRadius({from: 0 , to : 120 , step : 0.1})

  }

}