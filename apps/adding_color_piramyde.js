/**
 *@Author Nikola Lukic
 *@Description Matrix Engine Api Example
 */

 export var runThis = (matrixEngine) => {

  let world = matrixEngine.matrixWorld.world;
  let App = matrixEngine.App;

  world.Add("pyramid", 1, "MyPyramid1");
  world.Add("pyramid", 1, "MyPyramid2");
  world.Add("pyramid", 1, "MyPyramid3");

  App.scene.MyPyramid1.position.SetX(2.5);
  App.scene.MyPyramid2.position.SetX(0);
  App.scene.MyPyramid3.position.SetX(-2.5);

  App.scene.MyPyramid1.rotation.rotationSpeed.y = 20;
  App.scene.MyPyramid2.rotation.rotationSpeed.y = 20;
  App.scene.MyPyramid3.rotation.rotationSpeed.y = 20;
};
