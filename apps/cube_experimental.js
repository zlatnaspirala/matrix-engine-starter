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

  for (var d = -2; d < 3; d++) {
    for (var t = -1; t < 2; t++) {
      world.Add(
        "cubeLightTex",
        0.3,
        "MyCubeTex" + Math.abs(d),
        textuteImageSamplers
      );
      eval("App.scene.MyCubeTex" + Math.abs(d) + ".position.x += d*0.8");
      eval("App.scene.MyCubeTex" + Math.abs(d) + ".position.y += t*0.8");
      eval(
        "App.scene.MyCubeTex" + Math.abs(d) + ".rotation.rotationSpeed.x = 0;"
      );
    }
  }

  world.Add("triangle", 1, "MyColoredTriangle1");
  world.Add("triangle", 1, "MyColoredTriangle2");
  world.Add("triangle", 1, "MyColoredTriangle3");

  App.scene.MyColoredTriangle1.position.SetX(2.5);
  App.scene.MyColoredTriangle2.position.SetX(0);
  App.scene.MyColoredTriangle3.position.SetX(-2.5);
};
