/**
 *@Author Nikola Lukic
 *@Description Matrix Engine Api Example
 */

 export var runThis = (matrixEngine) => {

  let world = matrixEngine.matrixWorld.world;
  let App = matrixEngine.App;

  var textuteImageSamplers = {
    source: ["res/images/complex_texture_1/diffuse.png"],
    mix_operation: "multiply",
  };

  world.Add("squareTex", 1, "MySquareTexure1", textuteImageSamplers);

  App.scene.MySquareTexure1.rotation.rotationSpeed.x = 10;
};
