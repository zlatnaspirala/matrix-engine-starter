import {stdFonts} from "../../matrix-slot/scripts/standard-fonts";

export function create2dHUD(nidza) {
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


export function funnyStar(nidza) {

  let colorR = new nidza.Osc(0, 255, 15);
  let colorG = new nidza.Osc(0, 255, 16);
  let colorB = new nidza.Osc(0, 255, 17);
  colorR.setDelay(0);
  colorB.setDelay(0);
  colorG.setDelay(0);

  let j = 3;
  let sceneGroup = setInterval(() => {
    let myStarElement = nidza.access.footerLabel.addStarComponent({
      id: "star",
      radius: 55,
      inset: j,
      n: 6,
      color: "rgb(" + colorR.getValue() + "," + colorG.getValue() + "," + colorB.getValue() + ")",
      position: {
        x: 50,
        y: 50
      },
      dimension: {
        width: 180,
        height: 180
      }
    });

    let rotationOption = new nidza.Osc(0, 360, 1);
    myStarElement.rotation.setRotation(rotationOption);

    j -= 0.1;
    if(j < 0) clearInterval(sceneGroup);
  }, 20)

}