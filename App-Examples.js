import * as matrixEngine from 'matrix-engine';

import {runThis as cube_tex_arrays} from "./apps/cube_tex_arrays";
import {runThis as adding_color_cube} from "./apps/adding_color_cube";
import {runThis as adding_color_piramyde} from "./apps/adding_color_piramyde";
import {runThis as adding_color_triangle} from "./apps/adding_color_triangle";
import {runThis as adding_more_texture_samplers} from "./apps/adding_more_texture_samplers";
import {runThis as adding_square_texture} from "./apps/adding_square_texture";
import {runThis as all_variant_of_blending} from "./apps/all_variant_of_blending";
import {runThis as audio_manipulation} from "./apps/audio_manipulation";
import {runThis as camera_texture} from "./apps/camera_texture";
import {runThis as cube_experimental} from "./apps/cube_experimental";
import {runThis as cube_geometry} from "./apps/cube_geometry";
import {runThis as cube_light_and_texture} from "./apps/cube_light_and_texture";
import {runThis as cube_light_dinamic} from "./apps/cube_light_dinamic";
import {runThis as custom_texture} from "./apps/custom_texture";
import {runThis as first_person_controller} from "./apps/first_person_controller";
import {runThis as load_obj_file} from "./apps/load_obj_file";
import {runThis as my_world} from "./apps/my_world";
import {runThis as obj_animation} from "./apps/obj_animation";
import {runThis as obj_animation_build_mesh_effect} from "./apps/obj_animation_build_mesh_effect";
import {runThis as one_kilo} from "./apps/one-kilo";
import {runThis as porting2d} from "./apps/porting2d";
import {runThis as porting2d_particle} from "./apps/porting2d_particle";
import {runThis as porting2d_text} from "./apps/porting2d_text";
import {runThis as sphere_geometry} from "./apps/sphere_geometry";
import {runThis as texture_dinamic_manipulation} from "./apps/texture_dinamic_manipulation";
import {runThis as video_texture} from "./apps/video_texture";
import {runThis as adding_color_square } from "./apps/adding_color_square";
import {runThis as adding_color_square_raycast } from "./apps/adding_color_square_raycast";
import {runThis as spot_light_basic } from "./apps/spot_light_basic";
import {runThis as physics_sphere } from "./apps/physics_sphere";
import {runThis as physics_cube } from "./apps/physics_cube";
import {runThis as active_editor } from "./apps/active_editor";
import {runThis as basic_fbo } from "./apps/basic_fbo";
import {runThis as fbo_manipulation } from "./apps/fbo_manipulation";


var Examples = {
  fbo_manipulation: fbo_manipulation,
  active_editor: active_editor,
  basic_fbo: basic_fbo,
  physics_sphere: physics_sphere,
  physics_cube: physics_cube,
  spot_light_basic: spot_light_basic,
  cube_tex_arrays: cube_tex_arrays,
  adding_color_cube: adding_color_cube,
  adding_color_piramyde: adding_color_piramyde,
  adding_color_triangle: adding_color_triangle,
  adding_color_square : adding_color_square,
  adding_more_texture_samplers: adding_more_texture_samplers,
  adding_square_texture: adding_square_texture,
  all_variant_of_blending: all_variant_of_blending,
  audio_manipulation: audio_manipulation,
  camera_texture: camera_texture,
  cube_experimental: cube_experimental,
  cube_geometry: cube_geometry,
  cube_light_and_texture: cube_light_and_texture,
  cube_light_dinamic: cube_light_dinamic,
  custom_texture: custom_texture,
  first_person_controller: first_person_controller,
  load_obj_file: load_obj_file,
  my_world: my_world,
  obj_animation: obj_animation,
  obj_animation_build_mesh_effect: obj_animation_build_mesh_effect,
  one_kilo: one_kilo,
  porting2d: porting2d,
  porting2d_particle: porting2d_particle,
  porting2d_text: porting2d_text,
  sphere_geometry: sphere_geometry,
  texture_dinamic_manipulation: texture_dinamic_manipulation,
  video_texture: video_texture,
  adding_color_square_raycast: adding_color_square_raycast
};

/**
 * @description
 * Little help func.
 */
const QueryString = matrixEngine.utility.QueryString;
const scriptManager = matrixEngine.utility.scriptManager;

var world;
var App = matrixEngine.App;
window.matrixEngine = matrixEngine;
window.App = App;

const addBtn = document.querySelector(".button1");
const regularBtn = document.querySelector(".button2");

addBtn.style.display = "none";
regularBtn.style.display = "none";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    // navigator.serviceWorker.register("worker.js");
    setTimeout(() => { matrixEngine.Engine.initApp(webGLStart) }, 250);
  });
} else {
  console.warn("Matrix Engine: No support for web workers in this browser.");
}

function webGLStart() {
  world = matrixEngine.matrixWorld.defineworld(canvas);
  if (world) {
    world.callReDraw();
    if (typeof QueryString.u != "undefined") {
      Examples[QueryString.u](matrixEngine);
    } else {
      Examples["adding_color_cube"](matrixEngine);
    }
  } else {
    console.error("Canvas has not been initialized, contact your programmer...");
  }
}


export default App;
