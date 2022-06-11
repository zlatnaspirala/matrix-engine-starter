
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

/**
 * @description 
 * Footer Balance
 */
 export function createNidzaHudBalance( nidza ) {
  return new Promise( ( resolve, reject ) => {
    let myFirstNidzaObjectOptions = {
      id: "footerBalance",
      size: {
        width: 400,
        height: 80
      }
    };
    footerBalance = nidza.createNidzaIndentity( myFirstNidzaObjectOptions );
    let texCanvas = document.getElementById( 'footerBalance' );

    App.config.loadingMessage.forEach((item, index) => {

    let footerTitleComponent = footerBalance.addTextComponent(
      {
        id: "footerBalance" + index,
        text: item,
        color: "lime",
        position: {
          x: 15 + 10*index,
          y: 25
        },
        dimension: {
          width: 500,
          height: 100
        },
        font: {
          fontSize: "45px",
          fontStyle: "normal",
          fontName: stdFonts.CourierNew
        }
      });

    var oscAng = new matrixEngine.utility.OSCILLATOR(0, 100, 5);

    footerTitleComponent.myOsc = oscAng;
    footerTitleComponent.position.translateX(oscAng.UPDATE())
    footerTitleComponent.position.onTargetReached = () => {
      // oscAng.step += 10;
      footerTitleComponent.position.translateX(oscAng.UPDATE())
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