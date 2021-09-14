
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

    console.log(this + "<<<<<<<<");
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