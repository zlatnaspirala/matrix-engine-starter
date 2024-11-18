import * as matrixEngine from "matrix-engine";
let OSC = matrixEngine.utility.OSCILLATOR;
var App = matrixEngine.App;

export async function loadLineEffects() {
	let world = matrixEngine.matrixWorld.world;
	
  var texTopHeader = {
    source: ["res/images/h1.png"],
    mix_operation: "multiply",
  };
  for(let j = 1;j < 3;j++) {
    this.world.Add("squareTex", 1, "footerLine" + j, texTopHeader);
    App.scene["footerLine" + j].geometry.setScaleByX(6);
    App.scene["footerLine" + j].geometry.setScaleByY(0.025);
    App.scene["footerLine" + j].position.SetY(2.5 + j * 0.055);
    App.scene["footerLine" + j].position.SetZ(-5.6);
    App.scene["footerLine" + j].position.SetX(0);
    // TEST 
    App.scene["footerLine" + j].instancedDraws.numberOfInstance = 50;
    App.scene["footerLine" + j].instancedDraws.array_of_local_offset = [0,0.1,0];
    App.scene["footerLine" + j].instancedDraws.overrideDrawArraysInstance = function( object ) {
      
      for (var i=0;i<object.instancedDraws.numberOfInstance;i++) {
          mat4.translate(object.mvMatrix, object.mvMatrix, object.instancedDraws.array_of_local_offset );
          world.setMatrixUniforms(object,world.pMatrix,object.mvMatrix)
          world.GL.gl.drawElements(world.GL.gl.TRIANGLE_STRIP, object.glDrawElements.numberOfIndicesRender , world.GL.gl.UNSIGNED_SHORT, 0);
      }
    };

    // TEST.push(App.scene["footerLine" + j]);
    await delay(j, this);
    
  }

  function delay(j, root) {
    return new Promise((resolve, reject) => {
      root.createNidzaHudLine1(root.nidza).then((streamTex) => {
        App.scene["footerLine" + j].streamTextures = {videoImage: streamTex};
        App.scene["footerLine" + j].rotation.rotx = 180;
        App.operation.squareTex_buffer_procedure(App.scene["footerLine" + j]);
        resolve();
      }).catch(err => reject());
    });
  }
}

export function incraseNumOfDrawInstance() {

  setTimeout(() => {
    App.scene.footerLine1.instancedDraws.numberOfInstance++;
    App.scene.footerLine2.instancedDraws.numberOfInstance++;
    if (App.scene.footerLine1.instancedDraws.numberOfInstance > 46) {
      // console.log("")
    } else {
      this.incraseNumOfDrawInstance();
    }
  }, 50);

  // App.scene.footerLine1.instancedDraws.numberOfInstance

}

export function flashIn() {

  for(var j = 1;j < 3;j++) {
    App.scene["footerLine" + j].position.thrust = 0.1;
    App.scene["footerLine" + j].position.translateByY(App.scene["footerLine" + j].position.y);
    App.scene["footerLine" + j].position.translateByX(0);

    App.scene["footerLine" + j].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[4];
    App.scene["footerLine" + j].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[5];

  }

}

export function startUpAnimMoveToRight() {

  App.scene["footerLine1"].position.thrust = 0.1;
  App.scene["footerLine1"].position.translateByY(App.scene["footerLine1"].position.y);
  App.scene["footerLine1"].position.translateByX(15);

  App.scene["footerLine2"].position.thrust = 0.1;
  App.scene["footerLine2"].position.translateByY(App.scene["footerLine2"].position.y);
  App.scene["footerLine2"].position.translateByX(-15);
}

export function startUpAnimMoveToUp() {

  App.scene["footerLine1"].position.thrust = 0.1;
  App.scene["footerLine1"].position.translateByY(10);

  App.scene["footerLine2"].position.thrust = 0.1;
  App.scene["footerLine2"].position.translateByY(-10);
}