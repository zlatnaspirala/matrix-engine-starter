import {stdFonts} from "../../matrix-slot/scripts/standard-fonts";

export function createNidzaTextureText(nidza) {
  return new Promise((resolve, reject) => {
    let myFirstNidzaObjectOptions = {
      id: "footerLabel",
      size: {
        width: 400,
        height: 180
      }
    }
    nidza.createNidzaIndentity(myFirstNidzaObjectOptions);
    let texCanvas = document.getElementById('footerLabel');
    let statusMessageBox = nidza.access.footerLabel.addTextComponent(
      {
        id: "zlatna",
        text: "Balance: 100$",
        color: "lime",
        position: {
          x: 50,
          y: 20
        },
        dimension: {
          width: 365,
          height: 120
        },
        border: {
          fillColor: "rgba(110,10,1,1)",
          strokeColor: "rgba(0,0,0,0)"
        },
        font: {
          fontSize: "40px",
          fontStyle: "normal",
          fontName: stdFonts.CourierNew
        }
      });

    // Create one simple oscillator
    // let rotationOption = new nidza.Osc( 0, 360, 2 );

    // rotationOption.onRepeat = function ( osc ) {
    //   // console.info( "Values reached onrepeat targets osc: ", osc )
    //   statusMessageBox.rotation.clearUpdate();
    //   dispatchEvent( new CustomEvent( "deactivate-updater",
    //     {detail: {id: osc.elementIdentity}} ) );
    // }

    // statusMessageBox.rotation.setRotation( rotationOption )
    // statusMessageBox.rotation.osc.setDelay( 0 )

    nidza.access.footerLabel.canvasDom.setAttribute("style", "position: absolute; left: 0;display:none");

    window.footerLabel = nidza.access.footerLabel;
    resolve(texCanvas);
    return texCanvas;
  });

}
