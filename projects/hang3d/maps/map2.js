export let map = {
  staticCubes: [],
  staticFloors: [],
  staticObjs: [],
  staticObjsGroup: [
    {
      name: "mapobjsgroup_1_2",
      path: "res/3d-objects/env/door1.obj",
      position: {x: 4.2, y: 1, z: 8.4},
      rotation: {rotx: 0, roty: 0, rotz: 0},
      activeRotation: [0, 0, 0],
      scale: [1, 1, 1],
      scaleCollider: [1, 1, 1],
      texture: {source: ["res/images/diffuse.png"], mix_operation: "multiply"},
      targetDom: {id: "field12", x: 1, y: 2},
    },
  ],
  noPhysics: {cubes: []},
};
