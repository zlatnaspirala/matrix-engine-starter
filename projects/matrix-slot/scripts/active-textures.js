
import { stdFonts } from "./standard-fonts";
import * as matrixEngine from "matrix-engine";
var App = matrixEngine.App;

/**
 * @description 
 * AI voice commander ceter top footer text
 */
export function createNidzaTextureText( nidza ) {
  return new Promise( ( resolve, reject ) => {

    let myFirstNidzaObjectOptions = {
      id: "footerLabel",
      size: {
        width: window.innerWidth/100*90,
        height: 135
      }
    };
    //  object.streamTextures.videoImage
    nidza.createNidzaIndentity( myFirstNidzaObjectOptions );
    let texCanvas = document.getElementById( 'footerLabel' );
    let statusMessageBox = nidza.access.footerLabel.addTextComponent(
      {
        id: "zlatna",
        text: "Welcome here. What's your name ?",
        color: "lime",
        position: {
          x: 50,
          y: 10
        },
        dimension: {
          width: 65,
          height: 20
        },
        border: {
          fillColor: "rgba(110,10,10,0.5)",
          strokeColor: "rgba(0,0,0,0)"
        },
        font: {
          fontSize: "130%",
          fontStyle: "normal",
          fontName: stdFonts.CourierNew
        }
      } );

    // Create one simple oscillator
    let rotationOption = new nidza.Osc( 0, 360, 2 );

    rotationOption.onRepeat = function ( osc ) {
      console.info( "Values reached onrepeat targets osc: ", osc )
      statusMessageBox.rotation.clearUpdate();
      dispatchEvent( new CustomEvent( "deactivate-updater",
        {detail: {id: osc.elementIdentity}} ) );
    }

    statusMessageBox.rotation.setRotation( rotationOption )
    statusMessageBox.rotation.osc.setDelay( 0 )

    nidza.access.footerLabel.canvasDom.setAttribute( "style", "position: absolute; left: 0;display:none" );

    window.footerLabel = nidza.access.footerLabel;
    resolve( texCanvas );
    return texCanvas;
  } );

}

/**
 * @description 
 * Active lines
 */

// define
export let footerLinesInfo;
export let footerBalance;
export var activeLinePriview = 0;

export function incActiveLines() {
  if (App.slot.config.winnigLines.length-1 <= activeLinePriview) {
    activeLinePriview = 0;
    return activeLinePriview;
  }
  activeLinePriview++;
  return activeLinePriview;
}

export function createNidzaHudLinesInfo( nidza ) {
  return new Promise( ( resolve, reject ) => {
    let myFirstNidzaObjectOptions = {
      id: "footerLinesInfo",
      size: {
        width: 350,
        height: 55
      }
    };
    footerLinesInfo = nidza.createNidzaIndentity( myFirstNidzaObjectOptions );
    let texCanvas = document.getElementById( 'footerLinesInfo' );
    let activeLines = footerLinesInfo.addTextComponent(
      {
        id: "linesInfo",
        text: "Active lines",
        color: "lime",
        position: {
          x: 25,
          y: 44
        },
        dimension: {
          width: 220,
          height: 20
        },
        font: {
          fontSize: "18px",
          fontStyle: "normal",
          fontName: stdFonts.CourierNew
        }
      });

    // Create one simple oscillator
    // let rotationOption = new nidza.Osc( 0, 360, 2 );

    /*
    rotationOption.onRepeat = function ( osc ) {
      console.info( "Values reached onrepeat targets osc: ", osc )
      statusMessageBox.rotation.clearUpdate();
      dispatchEvent( new CustomEvent( "deactivate-updater",
        {detail: {id: osc.elementIdentity}} ) );
    } */

    // statusMessageBox.rotation.setRotation( rotationOption )
    // statusMessageBox.rotation.osc.setDelay( 0 )
    nidza.access.footerLinesInfo.canvasDom.setAttribute( "style", "position: absolute; left: 0;display:none" );

    // window.footerLinesInfo = nidza.access.footerLinesInfo;
    resolve( { texCanvas: texCanvas, activeLines: activeLines });
    // return texCanvas;
  } );

}

export function showActiveLinesByIndex(i) {

  footerLinesInfo.elements = [ footerLinesInfo.elements[0] ]
  footerLinesInfo.elements[0].position.translateX(25);

  App.slot.config.winnigLines.forEach((winShemaIndex, Sindex) => {  
    console.log("winShemaIndex ", winShemaIndex);
    winShemaIndex.forEach((winShema, index) => {

      if (Sindex != i) return;

      for (var curIndex = 0;curIndex < 3;curIndex++) {

        if (curIndex == winShema) {
          console.log("WIN MARK")

          let activaLine = footerLinesInfo.addTextComponent(
            {
              id: "linesInfo",
              text: "✅",
              color: "green",
              position: {
                x: 55 + 5.5*index,
                y: 25 + curIndex* 25
              },
              dimension: {
                width: 14,
                height: 14
              },
              font: {
                fontSize: "14px",
                fontStyle: "normal",
                fontName: "arial"
              }
          });

        } else {
          console.log("LOSE MARK")

          let activaLine = footerLinesInfo.addTextComponent(
            {
              id: "linesInfo",
              text: "❌",
              color: "red",
              position: {
                x: 55  + 5.5*index,
                y: 25 + curIndex* 25
              },
              dimension: {
                width: 14,
                height: 14
              },
              font: {
                fontSize: "14px",
                fontStyle: "normal",
                fontName: "arial"
              }
          });

        }

      }

      /*
    var oscAng = new matrixEngine.utility.OSCILLATOR( 1, 100, 5 );
    activaLine.position.translateX(oscAng.UPDATE())
    activaLine.position.onTargetReached = () => {
      activaLine.position.translateX(oscAng.UPDATE())
    };
      // console.log("aaa ->>>>>>>>>>>>>>>>>>", activaLine);
      oscAng.on_maximum_value = function ( osc ) {
      };
      */
    });
  });
}

/**
 * @description 
 * Effect at startup lines effect
 */
export function createNidzaHudLine1( nidza ) {
  return new Promise( ( resolve, reject ) => {
    console.log(this + "<<<<<<<<");
    let myShader = {
      id: "myShader",
      size: {
        width: window.innerHeight/2,
        height: window.innerHeight/2,
      },
      parentDom: document.getElementById("testHolder"),
    };

    var indentityMyShader = nidza.createNidza3dIndentity(myShader);
    let myShaderElement = indentityMyShader.addShaderComponentCustom({
      id: "vertex-color-comp",
    });

    myShaderElement.initDefaultFSShader = () => {
      return `
        varying lowp vec4 vColor;

        void main(void) {
          gl_FragColor = vColor;
        }
      `;
    }

    myShaderElement.initDefaultVSShader = () => {
      return `
        attribute vec4 aVertexPosition;
        attribute vec4 aVertexColor;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying lowp vec4 vColor;

        void main(void) {
          gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
          vColor = aVertexColor;
        }
      `;
    }

    myShaderElement.positions = [
      1.0,  1.0,
     -1.0,  1.0,
      1.0, -1.0,
     -1.0, -1.0,
    ];

    myShaderElement.colors = [
      1.0, 1.0, 1.0, 1.0,  // white
      1.0, 0.0, 0.0, 1.0,  // red
      0.0, 1.0, 0.0, 1.0,  // green
      0.0, 0.0, 1.0, 1.0,  // blue
    ];

    myShaderElement.initDefaultBuffers = function() {
      var gl = this.gl;
      const positionBuffer = gl.createBuffer();
      // Select the positionBuffer as the one to apply buffer
      // operations to from here out.
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

      // Now create an array of positions for the square.
      gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(this.positions),
        gl.STATIC_DRAW);

      const colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);

      return {
        position: positionBuffer,
        color: colorBuffer,
      }
    };

    const shaderProgram = myShaderElement.initShaderProgram(
      myShaderElement.gl,
      myShaderElement.initDefaultVSShader(),
      myShaderElement.initDefaultFSShader());

    myShaderElement.programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: myShaderElement.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        vertexColor: myShaderElement.gl.getAttribLocation(shaderProgram, 'aVertexColor'),
      },
      uniformLocations: {
        projectionMatrix: myShaderElement.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: myShaderElement.gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      },
    };

    myShaderElement.buffers = myShaderElement.initDefaultBuffers(myShaderElement.gl);

    // myShaderElement.draw(); Manually call once.
    dispatchEvent(
      new CustomEvent(indentityMyShader.getKey("activate-updater"), {
        detail: {
          id: "vertex-color-comp",
        },
      })
    );


    // Second element intro same gl program

    /*
    var shaderProgram2 = myShaderElement.initShaderProgram(
      myShaderElement.gl,
      myShaderElement.initDefaultVSShader(),
      myShaderElement.initDefaultFSShader());

    myShaderElement.programInfo = {
      program: shaderProgram2,
      attribLocations: {
        vertexPosition: myShaderElement.gl.getAttribLocation(shaderProgram2, 'aVertexPosition'),
        vertexColor: myShaderElement.gl.getAttribLocation(shaderProgram2, 'aVertexColor'),
      },
      uniformLocations: {
        projectionMatrix: myShaderElement.gl.getUniformLocation(shaderProgram2, 'uProjectionMatrix'),
        modelViewMatrix: myShaderElement.gl.getUniformLocation(shaderProgram2, 'uModelViewMatrix'),
      },
    }; */

    // myShaderElement.buffers = myShaderElement.initDefaultBuffers(myShaderElement.gl);

    // myShaderElement.draw(); Manually call once.
    dispatchEvent(
      new CustomEvent(indentityMyShader.getKey("activate-updater"), {
        detail: {
          id: "vertex-color-comp",
        },
      })
    );


    // Create one simple oscillator
    // let rotationOption = new nidza.Osc( 0, 360, 2 );

    /*
    rotationOption.onRepeat = function ( osc ) {
      console.info( "Values reached onrepeat targets osc: ", osc )
      statusMessageBox.rotation.clearUpdate();
      dispatchEvent( new CustomEvent( "deactivate-updater",
        {detail: {id: osc.elementIdentity}} ) );
    } */

    let texCanvas = document.getElementById( 'myShader' );
    // statusMessageBox.rotation.setRotation( rotationOption )
    // statusMessageBox.rotation.osc.setDelay( 0 )
    // nidza.access.myShader.canvasDom.setAttribute( "style", "position: absolute; left: 0;display:none" );

    window.indentityMyShader = nidza.access.indentityMyShader;
    resolve( texCanvas );
    return texCanvas;
  } );

}

/**
 * @description 
 * Footer Balance
 */
 export function createNidzaHudBalance( nidza ) {
  return new Promise( ( resolve, reject ) => {
    let myFirstNidzaObjectOptions = {
      id: "footerBalance",
      size: {
        width: 500,
        height: 80
      }
    };
    footerBalance = nidza.createNidzaIndentity( myFirstNidzaObjectOptions );
    let texCanvas = document.getElementById( 'footerBalance' );

    App.slot.config.matrixMessage.forEach((item, index) => {

    let footerBalanceComp = footerBalance.addTextComponent(
      {
        id: "footerBalance" + index,
        text: item,
        color: "lime",
        position: {
          x: 15 + 2*index,
          y: 15
        },
        dimension: {
          width: 120,
          height: 120
        },
        font: {
          fontSize: "15px",
          fontStyle: "normal",
          fontName: stdFonts.CourierNew
        }
      });

    var oscAng = new matrixEngine.utility.OSCILLATOR( 1, 100, 5 );
    footerBalanceComp.position.translateX(oscAng.UPDATE())
    footerBalanceComp.position.onTargetReached = () => {
      footerBalanceComp.position.translateX(oscAng.UPDATE())
    };

  });

    // statusMessageBox.rotation.setRotation( rotationOption )
    // statusMessageBox.rotation.osc.setDelay( 0 )
    nidza.access.footerBalance.canvasDom.setAttribute( "style", "position: absolute; left: 0;display:none" );

    window.footerBalance = nidza.access.footerBalance;
    resolve( texCanvas );
    return texCanvas;
  } );

}