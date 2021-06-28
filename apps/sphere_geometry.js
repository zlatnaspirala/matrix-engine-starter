/**
 * @Author Nikola Lukic
 * @Description Matrix Engine Api Example.
 */

 export var runThis = (matrixEngine) => {

  let world = matrixEngine.matrixWorld.world;
  let App = matrixEngine.App;

  var textuteImageSamplers = {
    source: ["res/images/complex_texture_1/diffuse.png"],
    mix_operation: "multiply", // ENUM : multiply , divide
  };

  world.Add("sphereLightTex", 2, "MySphere", textuteImageSamplers);

  App.scene.MySphere.position.z = -10;
};
