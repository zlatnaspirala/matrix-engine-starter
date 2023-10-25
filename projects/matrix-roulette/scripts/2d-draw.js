import * as matrixEngine from "matrix-engine"
import {stdFonts} from "../../matrix-slot/scripts/standard-fonts";

export var create2dHUD = (ref) => {
  return new Promise((resolve, reject) => {
    let myFirstNidzaObjectOptions = {
      id: "footerLabel",
      size: {width: 600, height: 200}
    }
    // console.log('Player info 2d draws ', playerInfo)
    ref.nidza.createNidzaIndentity(myFirstNidzaObjectOptions);
    let texCanvas = document.getElementById('footerLabel');

    balanceDecorations(ref.nidza, ref.playerInfo, ref)

    ref.nidza.access.footerLabel.addTextComponent(
      {
        id: "zlatna",
        text: `Balance: `,
        color: "white",
        position: {
          x: 10,
          y: 50
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
    ref.nidza.access.footerLabel.canvasDom.setAttribute("style", "position: absolute; left: 0;display:none");
    resolve(texCanvas);
    // return texCanvas;
  });

}

export function balanceDecorations(nidza, playerInfo, ref) {
  var A1 = 111,
    f1 = 2,
    p1 = 1 / 2,
    d1 = 0.2;
  var A2 = 22,
    f2 = 4,
    p2 = 3 / 2,
    d2 = 0.0315;
  var A3 = 31,
    f3 = 4,
    p3 = 13 / 15,
    d3 = 0.0012;
  var A4 = 50,
    f4 = 4,
    p4 = 1,
    d4 = 0.012;
  var r = 110,
    g = 110,
    b = 110;

  var makeHarmonograph = function(c) {
    f1 = (f1 / 10) % 10;
    f2 = (f2 / 40) % 10;
    f3 = (f3 + Math.random() / 80) % 10;
    f4 = (f4 + Math.random() / 411) % 10;
    p1 += 0.5 % (Math.PI * 2);
    if(p1 > 500) p1 = 0;
    drawHarmonograph(c);
  }

  var drawHarmonograph = function(ctx) {
    ctx.clearRect(0, 0, 600, 400);
    ctx.save();
    ctx.fillStyle = "rgb(" + A1 + "," + g + "," + b + ")";
    ctx.strokeStyle = "rgb(" + p1 + "," + g + "," + b + ")";
    ctx.fillRect(0, 0, 600, 400);
    ctx.translate(0, 100);
    ctx.beginPath();
    for(var t = 0;t < 22;t += 0.2) {
      var x =
        A1 * Math.sin(f1 * t + Math.PI * p1) * Math.exp(-d1 * t) +
        A2 * Math.sin(f2 * t + Math.PI * p2) * Math.exp(-d2 * t);
      var y =
        A3 * Math.sin(f3 * t + Math.PI * p1) * Math.exp(-d3 * t) +
        A4 * Math.sin(f4 * t + Math.PI * p4) * Math.exp(-d4 * t);
      ctx.lineTo(x * x + 1, y + 1 / x);
    }
    ctx.stroke();
    ctx.restore();
  }

  var byY_ = new matrixEngine.utility.OSCILLATOR(90, 110, 0.3);

  // console.log('WARN THIS ', ref)
  let myStarElement = nidza.access.footerLabel.addCustom2dComponent({
    id: "CUSTOM",
    draw: function(e) {
      if(e instanceof CanvasRenderingContext2D == false) return;
      e.fillStyle = 'red';
      makeHarmonograph(e)
      e.fillStyle = 'rgba(0,0,0,0.4)';
      e.fillRect(50, 50, 100 + p1, 100);
      e.fillRect(50, 20, 500 - p1, 20);
      e.fillRect(50, 170, 500 - p1, 20);

      e.fillStyle = 'rgba(250,250,250,1)';
      e.font = 'bold 60px stormfaze'
      e.textAlign = 'left';
      e.fillText(`${ref.playerInfo.balance} ${ref.playerInfo.currency}`, 350, byY_.UPDATE(), 200, 40)
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

export function createStatusBoxHUD(nidza, playerInfo) {
  return new Promise((resolve, reject) => {
    let n = {
      id: "statusBox",
      size: {
        width: 600,
        height: 250
      }
    }
    console.log('Player info 2d draws ', playerInfo)
    nidza.createNidzaIndentity(n);
    let texCanvas = document.getElementById('statusBox');

    var previewR = '-1';

    var colorForCOLOR = 'rgba(120,0,0,0.4)'
    var colorForOpenGame = 'lime'
    var colorForLastMoment = 'rgba(255,15,15,1)'
    var p1 = 0;

    addEventListener('MEDITATE_SERVER', (e) => {
      // console.log('SYMBOLIC ONLY - CONNECT WITH PROGRESS BAR IN 2d HUD', e)
      p1 = e.detail * 17
      colorForCOLOR = colorForOpenGame
    })
    addEventListener('WAIT_FOR_RESULT', (e) => {
      // console.log('SYMBOLIC ONLY - CONNECT WITH PROGRESS BAR IN 2d HUD', e)
      p1 = e.detail * 17
      colorForCOLOR = colorForLastMoment
    })
    addEventListener('RESULTS_FROM_SERVER', (e) => {
      // console.log('RESULTS_FROM_SERVER SYMBOLIC ONLY - CONNECT WITH PROGRESS BAR IN 2d HUD', e)
      previewR = '🟥' + e.detail
    })

    let myStarElement = nidza.access.statusBox.addCustom2dComponent({
      id: "CUSTOM",
      draw: function(e) {
        if(e instanceof CanvasRenderingContext2D == false) return;

        e.fillStyle = colorForCOLOR;
        e.fillRect(50, 185, 500 - p1, 22);

        e.fillRect(50 + 500 - (20 * 17), 180, 500 - (10 * 17), 3);
        e.fillRect(50 + 500 - (20 * 17), 209, 500 - (10 * 17), 3);

        e.fillStyle = colorForLastMoment
        e.fillRect(50, 180, 500 - (20 * 17), 3);
        e.fillRect(50, 209, 500 - (20 * 17), 3);

        e.textAlign = 'left';
        e.font = 'bold 60px stormfaze'
        e.fillStyle = 'rgba(250,250,250,1)';
        // if (previewR != -1) 
        e.fillText("" + previewR.toString(), 370, 148, 250)


        e.fillRect(170, 66, 250, 43)

        e.textAlign = 'left';
        e.font = 'normal 20px stormfaze'
        e.fillStyle = 'rgba(250,250,250,1)';


        e.fillStyle = 'rgba(250,50,50,1)';
        e.fillText(`maximumroulette.com`, 170, 78, 250, 33)
        e.fillText(`github.com/zlatnaspirala`, 170, 100, 250, 33)

        e.font = 'normal 40px stormfaze'
        e.fillStyle = 'rgba(250,250,250,1)';
        e.fillText(`matrix roulette 1.0 open source GPL v3`, 20, 50, 550, 25)

        e.fillStyle = 'rgba(250,250,250,1)';
        e.fillText(`Game status`, 20, 160, 250, 25)
        // var myGradient = e.createLinearGradient(0, 0, 650, 250);
        // myGradient.addColorStop(0, 'red');
        // myGradient.addColorStop(1, 'orange');
        // e.fillStyle = myGradient;
        // e.fillRect(450 - p1.UPDATE(), 0, 5 , 200)

      },
      position: {
        x: 10,
        y: 10
      },
      dimension: {
        width: 600,
        height: 250
      }
    });

    nidza.access.statusBox.elements[0].activeDraw()

    nidza.access.statusBox.canvasDom.setAttribute("style", "position: absolute; left: 0;display:none");

    // window.footerLabel = nidza.access.footerLabel;
    resolve(texCanvas);
    return texCanvas;
  });

}

export function create2dHUDStatusLine(nidza) {
  return new Promise((resolve, reject) => {
    let n = {
      id: "statusBoxLine",
      size: {
        width: 600,
        height: 150
      }
    }
    console.log('STATUS HUD')
    nidza.createNidzaIndentity(n);
    let texCanvas = document.getElementById('statusBoxLine');
    let myStarElement = nidza.access.statusBoxLine.addCustom2dComponent({
      id: "CUSTOM",
      draw: function(e) {
        if(e instanceof CanvasRenderingContext2D == false) return;

        e.fillRect(170, 76, 350, 3)
        e.textAlign = 'left';
        e.font = 'normal 45px stormfaze'
        e.fillStyle = 'rgba(250,250,250,1)';
        e.fillText(`matrix roulette 1.0 status line`, 10, 60, 550, 150)

        // var myGradient = e.createLinearGradient(0, 0, 650, 250);
        // myGradient.addColorStop(0, 'red');
        // myGradient.addColorStop(1, 'orange');
        // e.fillStyle = myGradient;
        // e.fillRect(450 - p1.UPDATE(), 0, 5 , 200)

      },
      position: {
        x: 10,
        y: 10
      },
      dimension: {
        width: 500,
        height: 150
      }
    });

    nidza.access.statusBoxLine.elements[0].activeDraw()
    nidza.access.statusBoxLine.canvasDom.setAttribute("style", "position: absolute; left: 0;display:none");
    resolve(texCanvas);
  })
}