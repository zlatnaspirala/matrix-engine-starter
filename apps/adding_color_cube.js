/**
 *@Author Nikola Lukic
 *@Description Matrix Engine Api Example
 * Adding default color cube.
 */

export var runThis = (matrixEngine) => {

  let world = matrixEngine.matrixWorld.world;
  let App = matrixEngine.App;

  world.Add("cube", 1, "MyColoredCube1");
  world.Add("cube", 1, "MyColoredCube2");
  world.Add("cube", 1, "MyColoredCube3");

  App.scene.MyColoredCube1.position.SetX(0);
  App.scene.MyColoredCube2.position.SetX(-2.5);
  App.scene.MyColoredCube3.position.SetX(2.5);

  App.scene.MyColoredCube1.rotation.rotationSpeed.x = 15;
  App.scene.MyColoredCube2.rotation.rotationSpeed.y = 15;
  App.scene.MyColoredCube3.rotation.rotationSpeed.z = 15;

};
