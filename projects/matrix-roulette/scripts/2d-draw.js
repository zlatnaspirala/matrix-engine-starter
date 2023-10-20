import {stdFonts} from "../../matrix-slot/scripts/standard-fonts";


export function create2dHUD(nidza, playerInfo) {
  return new Promise((resolve, reject) => {
    let myFirstNidzaObjectOptions = {
      id: "footerLabel",
      size: {
        width: 600,
        height: 200
      }
    }

    console.log('Player info 2d draws ', playerInfo)

    nidza.createNidzaIndentity(myFirstNidzaObjectOptions);
    let texCanvas = document.getElementById('footerLabel');

    balanceDecorations(nidza)

    let statusMessageBox = nidza.access.footerLabel.addTextComponent(
      {
        id: "zlatna",
        text: `Balance: ${playerInfo.balance} ${playerInfo.currency}`,
        color: "lime",
        position: {
          x: 50,
          y: 40
        },
        dimension: {
          width: 365,
          height: 180
        },
        border: {
          fillColor: "rgba(0,0,0,0)",
          strokeColor: "rgba(110,0,0,0)"
        },
        font: {
          fontSize: "60px",
          fontStyle: "normal",
          fontName: stdFonts.Verdana
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

export function balanceDecorations(nidza) {


  var A1 = 100,
    f1 = 2,
    p1 = 1 / 16,
    d1 = 0.02;
  var A2 = 10,
    f2 = 4,
    p2 = 3 / 2,
    d2 = 0.0315;
  var A3 = 200,
    f3 = 4,
    p3 = 13 / 15,
    d3 = 0.00012;
  var A4 = 10,
    f4 = 4,
    p4 = 1,
    d4 = 0.012;
  var r = 10,
    g = 10,
    b = 0;

  var makeHarmonograph = function(c) {
    f1 = (f1 / 10) % 10;
    f2 = (f2 / 40) % 10;
    f3 = (f3 + Math.random() / 80) % 10;
    f4 = (f4 + Math.random() / 411) % 10;
    p1 += 0.5 % (Math.PI * 2);
    drawHarmonograph(c);
  }

  var drawHarmonograph = function(ctx) {
    ctx.clearRect(0, 0, 850, 450);
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
    ctx.fillRect(0, 0, 800, 400);
    ctx.translate(0, 250);
    ctx.beginPath();
    if(A1 > 100) {
    }
    for(var t = 0;t < 100;t += 0.1) {
      var x =
        A1 * Math.sin(f1 * t + Math.PI * p1) * Math.exp(-d1 * t) +
        A2 * Math.sin(f2 * t + Math.PI * p2) * Math.exp(-d2 * t);
      var y =
        A3 * Math.sin(f3 * t + Math.PI * p1) * Math.exp(-d3 * t) +
        A4 * Math.sin(f4 * t + Math.PI * p4) * Math.exp(-d4 * t);

      ctx.lineTo(x * x + 1, y + 1 / x);
    }

    ctx.stroke();
    ctx.translate(A1, 0);
    ctx.rotate(1.57);
    ctx.beginPath();

    for(var t = 0;t < 100;t += 0.1) {
      var x =
        A1 * A3 * Math.sin(f1 * t + Math.PI * p1) * Math.exp(-d1 * t) +
        A2 * Math.sin(f2 * t + Math.PI * p2) * Math.exp(-d2 * t);
      var y =
        A3 * Math.sin(f3 * t + Math.PI * p1) * Math.exp(-d3 * t) +
        A4 * Math.sin(f4 * t + Math.PI * p4) * Math.exp(-d4 * t);

      ctx.lineTo(x * x + 1, y + 1 / x);
    }

    ctx.stroke();

    ctx.restore();
  }

  let myStarElement = nidza.access.footerLabel.addCustom2dComponent({
    id: "CUSTOM",
    draw: function(e) {
      if(e instanceof CanvasRenderingContext2D == false) return;

      e.fillStyle = 'red';


      // Create gradient
      var myGradient = e.createLinearGradient(0, 0, 600, 200);
      myGradient.addColorStop(0, 'purple');
      myGradient.addColorStop(1, '#f53564');
      e.fillStyle = myGradient;
      e.fillRect(0, 0, 600, 200);

      makeHarmonograph(e)

    },
    position: {
      x: 10,
      y: 10
    },
    dimension: {
      width: 400,
      height: 200
    }
  });

  nidza.access.footerLabel.elements[0].activeDraw()

}