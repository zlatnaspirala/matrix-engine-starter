import * as matrixEngine from "matrix-engine";
import {planeFont, planeUVFont} from "matrix-engine-plugins";
import {rightHereRightNow} from "./matrix-audio";

var App = matrixEngine.App;

export default class Mashines {
  constructor( world, config ) {

    console.info( rightHereRightNow + " rightHereRightNow test the sound." );

    this.config = config;
    this.status = "free";
    this.font = new planeUVFont();
    this.speed = 0.08;
    this.thread = {
      control: {}
    };
    this.preThread = null;
    this.accessKeys = [];
    this.spinHandler = {
      lastInitY: [],
      bottomLimitY: -3.99,
      orderPositions: [],
    };

    this.winningHandler = {
      order: []
    };

    this.addMashine( world );
    this.addWheel( world );
    this.addHeaderText();
    this.addRaycaster();

    this.constructWinningObject = ( event ) => {
      //console.log( "constructWinningObject wheel id=>  ", event.detail.wheelID );
      //console.log( "constructWinningObject field name=> ", event.detail.fieldname );
      //console.log( "constructWinningObject isLast=> ", event.detail.isLast );
      let localHolder = [...App.slot.mashine.accessKeys[event.detail.wheelID]];
      var newOrder = App.slot.mashine.arrayRotate( localHolder );
      while (newOrder[newOrder.length-1] != event.detail.fieldname) {
        newOrder = App.slot.mashine.arrayRotate( localHolder )
      }
      this.winningHandler.order.push( newOrder );

      if (event.detail.isLast) {

        let countLineWins = [];
        this.winningHandler.order.forEach((wheelData, index) => {
          let accessName = wheelData[this.config.winnigLines[0][index]];
          // console.log(App.scene[accessName])
          countLineWins.push(App.scene[accessName].specialId);
        });

        var finalResult = this.findMax(countLineWins);
        console.log("final " , finalResult)

      }

    };

    window.addEventListener( "wheel.stoped", this.constructWinningObject );

  }

  /**
   * @description
   * Add this to untility matrix engine
   */
  arrayRotate( arr, reverse ) {
    if ( reverse ) arr.unshift( arr.pop() );
    else arr.push( arr.shift() );
    return arr;
  }

  findMax (arr ) {
    var counts = {}, max = 0, res;
    for (var v in arr) {
      counts[arr[v]] = (counts[arr[v]] || 0) + 1;
      if (counts[arr[v]] > max) { 
        max = counts[arr[v]];
        res = arr[v];
      }

    }
    var results = [];
    for (var k in counts){
      if (counts[k] == max){
        //console.log(k + " occurs " + counts[k] + " times");
        var localRes = {wheelId: k, repeat: counts[k] };
        results.push(localRes);
      }
    }
    console.log(results);
    return results;
  }

  findMaxOfStrDuplicates(argArray) {
    var name;
    var map = new Map();
    var max = 1;
    var maxRecurringString = "";
    for(name of argArray) {
      if(map.get(name) === undefined) {
        map.set(name, 1);
      } else {
        var count = map.get(name);
        count = count+1;
        map.set(name, count);
            if(max < count) {
              max = count;
              maxRecurringString = name;
            }
      }
    }
    console.log("Maximum recurring string is ", maxRecurringString, ". Max number of times :" + max);
    return { maxRecurringString, max }
  }

  addMashine = function ( world ) {
    var texTopHeader = {
      source: ["res/images/metal-sheet.jpg"],
      mix_operation: "multiply",
    };

    world.Add( "squareTex", 1, "topHeader", texTopHeader );
    App.scene.topHeader.geometry.setScaleByX( 11 );
    App.scene.topHeader.geometry.setScaleByY( 0.39 );
    App.scene.topHeader.position.y = 2.56;
    App.scene.topHeader.position.z = -6.5;

    App.scene.topHeader.custom.gl_texture = function ( object, t ) {
      world.GL.gl.bindTexture( world.GL.gl.TEXTURE_2D, object.textures[t] );
      world.GL.gl.texParameteri(
        world.GL.gl.TEXTURE_2D,
        world.GL.gl.TEXTURE_MAG_FILTER,
        world.GL.gl.LINEAR
      );
      world.GL.gl.texParameteri(
        world.GL.gl.TEXTURE_2D,
        world.GL.gl.TEXTURE_MIN_FILTER,
        world.GL.gl.LINEAR
      );
      //  world.GL.gl.texParameteri(world.GL.gl.TEXTURE_2D, world.GL.gl.TEXTURE_WRAP_S, world.GL.gl.MIRRORED_REPEAT);
      //  world.GL.gl.texParameteri(world.GL.gl.TEXTURE_2D, world.GL.gl.TEXTURE_WRAP_T, world.GL.gl.MIRRORED_REPEAT);
      world.GL.gl.texParameteri(
        world.GL.gl.TEXTURE_2D,
        world.GL.gl.TEXTURE_WRAP_S,
        world.GL.gl.REPEAT
      );
      world.GL.gl.texParameteri(
        world.GL.gl.TEXTURE_2D,
        world.GL.gl.TEXTURE_WRAP_T,
        world.GL.gl.REPEAT
      );

      world.GL.gl.texImage2D(
        world.GL.gl.TEXTURE_2D,
        0,
        world.GL.gl.RGBA,
        world.GL.gl.RGBA,
        world.GL.gl.UNSIGNED_BYTE,
        object.textures[t].image
      );

      world.GL.gl.generateMipmap( world.GL.gl.TEXTURE_2D );
    };

    App.scene.topHeader.geometry.texCoordsPoints.right_top.y = 11.4;
    App.scene.topHeader.geometry.texCoordsPoints.right_top.x = 11.4;
    App.scene.topHeader.geometry.texCoordsPoints.left_bottom.x = -10.4;
    App.scene.topHeader.geometry.texCoordsPoints.left_bottom.y = -10.4;
    App.scene.topHeader.geometry.texCoordsPoints.left_top.x = -10.4;
    App.scene.topHeader.geometry.texCoordsPoints.left_top.y = 11.4;
    App.scene.topHeader.geometry.texCoordsPoints.right_bottom.x = 11.4;
    App.scene.topHeader.geometry.texCoordsPoints.right_bottom.y = -10.4;

    // Addin anything at all
    App.scene.topHeader.shake = false;

    var osc_var = new matrixEngine.utility.OSCILLATOR( -0.01, 0.01, 0.001 );

    App.scene.topHeader.runShake = function () {
      if ( this.shake == false ) return;
      setTimeout( () => {
        this.geometry.texCoordsPoints.right_top.x += osc_var.UPDATE();
        this.geometry.texCoordsPoints.left_bottom.x += osc_var.UPDATE();
        this.geometry.texCoordsPoints.left_top.x += osc_var.UPDATE();
        this.geometry.texCoordsPoints.right_bottom.x += osc_var.UPDATE();
        this.runShake();
      }, 20 );
    }

    world.Add( "square", 1, "footerHeader" );
    App.scene.footerHeader.geometry.setScaleByX( 11 );
    App.scene.footerHeader.geometry.setScaleByY( 0.39 );
    App.scene.footerHeader.position.y = -2.56;
    App.scene.footerHeader.position.z = -6.5;

    // Style color buttom of footer
    App.scene.footerHeader.geometry.colorData.color[0].set( 0.1, 0.1, 0.1 );
    App.scene.footerHeader.geometry.colorData.color[1].set( 0.1, 0.1, 0.1 );
    App.scene.footerHeader.geometry.colorData.color[2].set( 0.1, 0.1, 0.1 );
    App.scene.footerHeader.geometry.colorData.color[3].set( 0.1, 0.1, 0.1 );

    App.operation.squareTex_buffer_procedure( App.scene.topHeader );
    App.operation.square_buffer_procedure( App.scene.footerHeader );

    console.info( "Mashine is constructed." );
  };

  addWheel = function ( world ) {
    console.info( "Number of wheels: ", App.slot.config.wheels.length );
    console.info(
      "Number of vertical visible fields of wheels: ",
      App.slot.config.verticalSize
    );
    var WW = App.slot.config.wheels.length;
    var VW = App.slot.config.verticalSize;

    var textuteImageSamplers2 = {
      source: ["res/icons/512.png"],
      mix_operation: "multiply",
    };

    App.slot.config.wheels.forEach( ( wheel, indexWheel ) => {
      var localHandler = [],
        localHandlerPos = [],
        lastY = 0;
      wheel.forEach( ( field, indexField ) => {
        var name = "wheel" + indexWheel + "field" + indexField;
        world.Add( "squareTex", 1, name, textuteImageSamplers2 );
        localHandler.push( name );
        // Referent done for default camera position.
        var O = ( window.innerWidth / 1000 ) * WW;
        var O2 = ( window.innerWidth / 1005 ) * WW;

        // console.log("test .wheel____", wheel)
        // console.log("test .field", field)
        App.scene[name].LightsData.ambientLight.set(
          field.color.r,
          field.color.g,
          field.color.b
        );

        App.scene[name].specialId = field.id;
        var _x = -O * 0.5 + indexWheel * O2 * 0.2;
        var _y = -2 + indexField * 2;
        var _z = -9;
        App.scene[name].position.z = _z;
        App.scene[name].position.x = _x;
        App.scene[name].position.y = _y;

        localHandlerPos.push( {_x, _y, _z} );

        lastY = App.scene[name].position.y;
        App.scene[name].geometry.setScaleByX( O / 10 );
        App.scene[name].geometry.setScaleByY( 2.97 / VW );

        //App.scene[name].glBlend.blendParamSrc = matrixEngine.utility.ENUMERATORS.glBlend.param[5];
        //App.scene[name].glBlend.blendParamDest = matrixEngine.utility.ENUMERATORS.glBlend.param[5] ;

        // App.scene.spinBtn.geometry.setScaleByY(-0.76)
        //App.scene[name].glBlend.blendEnabled = true;

        /*
        App.scene[name].geometry.colorData.color[0].set(field.color.r,field.color.b,field.color.g)
        App.scene[name].geometry.colorData.color[1].set(field.color.r,field.color.b,field.color.g)
        App.scene[name].geometry.colorData.color[2].set(field.color.r,field.color.b,field.color.g)
        App.scene[name].geometry.colorData.color[3].set(1,1,1);
        App.operation.square_buffer_procedure(App.scene[name]);
        */
      } );

      this.spinHandler.orderPositions.push( localHandlerPos );
      this.spinHandler.lastInitY.push( lastY );
      this.accessKeys.push( localHandler );
    } );
  };

  addHeaderText = function () {
    var c = 0;
    var count = 0;
    this.font.charLoaded = objChar => {
      console.log( objChar.name );
      // headerTitleS
      objChar.mesh.setScale( 0.6 );
      objChar.position.SetZ( -6.45 );
      switch ( objChar.name ) {
        case "headerTitleS":
          count = 0;
          break;
        case "headerTitleL":
          count = 1;
          break;
        case "headerTitleO":
          count = 1.4;
          break;
        case "headerTitleT":
          count = 2.5;
          break;
      }
      objChar.position.translateByXY( -1.8 + count * 0.4, 2.2 );
      objChar.glBlend.blendEnabled = true;
      if ( c == 3 ) this.addSpinText();
      c++;
    };
    this.font.loadChar( matrixEngine.objLoader, "s", "headerTitle" );
    this.font.loadChar( matrixEngine.objLoader, "l", "headerTitle" );
    this.font.loadChar( matrixEngine.objLoader, "o", "headerTitle" );
    this.font.loadChar( matrixEngine.objLoader, "t", "headerTitle" );
  };

  fieldOnClick = function ( hitObject ) {
    var oscAng = new matrixEngine.utility.OSCILLATOR( 1, 2, 0.02 );
    hitObject.rotation.rotationSpeed.y = 100;

    var timer = setInterval( () => {
      hitObject.geometry.setScale( oscAng.UPDATE() )

      //  clearInterval(timer)

    }, 1 )

  }

  addRaycaster = () => {
    window.addEventListener( "ray.hit.event", matrixEngineRaycastEvent => {
      console.log( "details > ", matrixEngineRaycastEvent.detail.hitObject.name );
      var r = matrixEngineRaycastEvent.detail.hitObject.name;
      if ( r == "spinBtn" ) {
        this.activateSpinning();
      } else if ( r.indexOf( "wheel" ) != -1 ) {
        this.fieldOnClick( matrixEngineRaycastEvent.detail.hitObject );
      }

    } );

    canvas.addEventListener( "mousedown", ev => {
      matrixEngine.raycaster.checkingProcedure( ev );
    } );

  };

  addSpinText = function () {
    var textuteImageSamplers = {
      source: ["res/images/spinBtn1.png"],
      mix_operation: "multiply", // ENUM : multiply , divide ,
    };

    world.Add( "squareTex", 1, "spinBtn", textuteImageSamplers );
    App.scene.spinBtn.position.SetY( -1.87 );
    App.scene.spinBtn.position.SetX( 2 );
    App.scene.spinBtn.position.SetZ( -5 );
    App.scene.spinBtn.geometry.setScale( 0.3 );
    App.scene.spinBtn.glBlend.blendParamSrc =
      matrixEngine.utility.ENUMERATORS.glBlend.param[5];
    App.scene.spinBtn.glBlend.blendParamDest =
      matrixEngine.utility.ENUMERATORS.glBlend.param[4];

    // App.scene.spinBtn.geometry.setScaleByY(-0.76)
    App.scene.spinBtn.glBlend.blendEnabled = true;
    // App.scene.spinBtn.rotation.rotz = 90;
  };

  activateSpinning = () => {
    if ( this.status != "free" ) {
      console.info( "Already spinning..." );
      return;
    }
    this.status = "spinning";
    this.preSpinning( 0 ).then( () => {
      this.spinning( 0 );
      this.preSpinning( 1 ).then( () => {
        this.spinning( 1 );
        this.preSpinning( 2 ).then( () => {
          this.spinning( 2 );
          this.preSpinning( 3 ).then( () => {
            this.spinning( 3 );
            this.preSpinning( 4 ).then( () => {
              this.spinning( 4 );
              this.preSpinning( 5 ).then( () => {
                this.spinning( 5 );
                this.allWheelSpinningMoment();
              } );
            } );
          } );
        } );
      } );
    } );
  };

  allWheelSpinningMoment = () => {
    console.info( "All wheels spinning" );
    setTimeout( () => {
      var index = 0;
      for ( let key in this.thread.control ) {
        setTimeout( () => {
          this.thread.control[key] = true;
        }, ( App.slot.config.stopingInterval * index++ ) );
      }
    }, App.slot.config.spinningInterval );

  };

  spinning = wheelID => {
    this.thread.control['ctrl' + wheelID] = false;
    this.thread['timer' + wheelID] = setInterval( () => {
      this.accessKeys.forEach( ( accessWheelNames, indexWheel, accessKeysArray ) => {
        if ( wheelID == indexWheel ) {
          accessWheelNames.forEach( ( fieldname, indexField, accessWheelNames ) => {
            App.scene[fieldname].position.y -= this.speed;

            if ( wheelID == 0 ) {
              // App.scene[fieldname].rotation.rotationSpeed.x = 100;
            } else if ( wheelID == 1 ) {
              // App.scene[fieldname].rotation.rotationSpeed.y = 100;
            } else if ( wheelID == 2 ) {
              // App.scene[fieldname].rotation.rotationSpeed.x = -100;
            }

            if ( App.scene[fieldname].position.y < this.spinHandler.bottomLimitY ) {
              App.scene[fieldname].position.y =
                this.spinHandler.lastInitY[indexWheel];
              // moment
              if ( this.thread.control['ctrl' + wheelID] == true ) {
                clearInterval( this.thread['timer' + wheelID] );

                App.scene[fieldname].rotation.rotationSpeed.x = 0;
                App.scene[fieldname].rotation.rotationSpeed.y = 0;

                console.log( fieldname );
                var isLast = false;
                // wheel0field5 parse 5 + 1 = 0  or 
                if (indexWheel == accessKeysArray.length - 1) {
                  isLast = true;
                }

                // get winning for wheel id and fieldname
                let wheelStoped = new CustomEvent( 'wheel.stoped', {
                  detail: {
                    wheelID: wheelID,
                    fieldname: fieldname,
                    isLast: isLast
                  }
                } );
                dispatchEvent( wheelStoped );
              }
            }
          } );
        }
      } );

      // test to disable
      clearInterval( this.preThread );
    }, 1 );
  };

  preSpinning = wheelID => {
    return new Promise( ( resolve, reject ) => {
      this.preThread = setInterval( () => {
        this.accessKeys.forEach( ( accessWheelNames, indexWheel ) => {
          if ( indexWheel == wheelID ) {
            accessWheelNames.forEach( ( fieldname, indexField ) => {
              App.scene[fieldname].position.y += 0.002;
            } );
          }
        } );
      }, 1 );
      setTimeout( () => {
        clearInterval( this.preThread );
        resolve();
      }, 150 );
    } );
  };

  deActivateSpiningThread = () => {
    clearInterval( this.thread );
  };
}
