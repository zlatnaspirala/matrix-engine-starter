export let map = {
  staticCubes: [
    {
      name: "wall_gen4_6",
      position: {x: 16.8, y: 1, z: 25.2},
      scale: [10, 4, 4],
      scaleCollider: [10, 4, 4],
      rotation: {rotx: 0, roty: 0, rotz: 0},
      activeRotation: [0, 0, 0],
      texture: {source: ["res/images/diffuse.png"], mix_operation: "multiply"},
      targetDom: {id: "field46", x: 4, y: 6},
    },
  ],
  staticFloors: [],
  staticObjs: [],
  noPhysics: {cubes: []},
};
