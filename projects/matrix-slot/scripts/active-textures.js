
import { stdFonts } from "./standard-fonts";

export function createNidzaTextureText( nidza ) {
  return new Promise( ( resolve, reject ) => {

    let myFirstNidzaObjectOptions = {
      id: "footerLabel",
      size: {
        width: window.innerWidth,
        height: 135
      }
    };
    //  object.streamTextures.videoImage
    nidza.createNidzaIndentity( myFirstNidzaObjectOptions );
    let texCanvas = document.getElementById( 'footerLabel' );
    let statusMessageBox = nidza.access.footerLabel.addTextComponent(
      {
        id: "zlatna",
        text: "Welcome I'am Matrix-Engine Slot Mashine, What's your name ?",
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
          fillColor: "black",
          strokeColor: "lime"
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

export function createNidzaHudLinesInfo( nidza ) {
  return new Promise( ( resolve, reject ) => {
    // console.log(this + "<<<<<<<<");
    let myFirstNidzaObjectOptions = {
      id: "footerLinesInfo",
      size: {
        width: 200,
        height: 120
      }
    };
    //  object.streamTextures.videoImage
    let footerLinesInfo = nidza.createNidzaIndentity( myFirstNidzaObjectOptions );
    let texCanvas = document.getElementById( 'footerLinesInfo' );
    let statusMessageBox = footerLinesInfo.addTextComponent(
      {
        id: "linesInfo",
        text: "Active lines man",
        color: "lime",
        position: {
          x: 50,
          y: 10
        },
        dimension: {
          width: 100,
          height: 100
        },
        border: {
          fillColor: "black",
          strokeColor: "lime"
        },
        font: {
          fontSize: "130%",
          fontStyle: "normal",
          fontName: "helvetica"
        }
      } );

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

    window.footerLinesInfo = nidza.access.footerLinesInfo;
    resolve( texCanvas );
    return texCanvas;
  } );

}

export function createNidzaHudLinesInfo2( nidza ) {
  return new Promise( ( resolve, reject ) => {

    console.log(this + "<<<<<<<<");
  
    let myShader = {
      id: "myShader",
      size: {
        width: window.innerWidth,
        height: window.innerHeight,
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
      1.0, 1.0,
     -1.0, 1.0,
      1.0, -1.0,
     -1.0, -1.0,
    ];
    myShaderElement.colors = [
      1.0, 1.0, 1.0, 1.0,    // white
      1.0, 0.0, 0.0, 1.0,    // red
      0.0, 1.0, 0.0, 1.0,    // green
      0.0, 0.0, 1.0, 1.0,    // blue
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


    // Second 
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