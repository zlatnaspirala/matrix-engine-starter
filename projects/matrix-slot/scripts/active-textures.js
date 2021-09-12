
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
        text: "welcome here i am mashine , whats you name ?",
        color: "yellow",
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
          fontStyle: "bold",
          fontName: "helvetica"
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