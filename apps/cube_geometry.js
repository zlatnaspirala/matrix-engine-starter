/* eslint-disable no-unused-vars */

/**
 * @Author Nikola Lukic
 * @Description Matrix Engine Api Example.
 */

 export var runThis = (matrixEngine) => {

  let world = matrixEngine.matrixWorld.world;
  let App = matrixEngine.App;

  var textuteImageSamplers = {
    source: ["res/images/complex_texture_1/diffuse.png"],
    mix_operation: "multiply",
  };

  world.Add("cubeLightTex", 1, "MyCubeTex", textuteImageSamplers);
  App.scene.MyCubeTex.rotation.rotationSpeed.z = 70;

  var oscilltor_variable = new matrixEngine.utility.OSCILLATOR(0.05, 2, 0.01);

  setInterval(function () {
    App.scene.MyCubeTex.geometry.setScale(oscilltor_variable.UPDATE());
  }, 10);
};
