/**
 *@Author Nikola Lukic
 *@Description Matrix Engine Api Example
 */

 export var runThis = (matrixEngine) => {

  let world = matrixEngine.matrixWorld.world;
  let App = matrixEngine.App;

  var textuteImageSamplers = {
    source: [
      "res/images/complex_texture_1/diffuse.png",
      "res/images/texture_spiral1.png",
    ],
    mix_operation: "multiply",
  };

  world.Add("cubeLightTex", 1, "MyCubeTex", textuteImageSamplers);

  setTimeout(function () {
    var textuteImageSamplers = {
      source: [
        "res/images/complex_texture_1/diffuse.png",
        "res/images/texture_spiral1.png",
        "res/images/icon2.png",
      ],
      mix_operation: "divide",
    };

    App.scene.MyCubeTex.changeMaterial(textuteImageSamplers);
  }, 5000);
};
