import * as matrixEngine from "matrix-engine"
import {stdFonts} from "../../matrix-slot/scripts/standard-fonts";
import {MTM} from "matrix-engine-plugins";
import {RULES} from "./table-events";

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

export function balanceDecorations(nidza, wwwwwwwwwwwwwwww, ref) {
  // var A1 = 111,
  //   f1 = 2,
  //   p1 = 1 / 2,
  //   d1 = 0.2;
  // var A2 = 22,
  //   f2 = 4,
  //   p2 = 3 / 2,
  //   d2 = 0.0315;
  // var A3 = 31,
  //   f3 = 4,
  //   p3 = 13 / 15,
  //   d3 = 0.0012;
  // var A4 = 50,
  //   f4 = 4,
  //   p4 = 1,
  //   d4 = 0.012;
  // var r = 110,
  //   g = 110,
  //   b = 110;

  // var makeHarmonograph = function(c) {
  //   f1 = (f1 / 10) % 10;
  //   f2 = (f2 / 40) % 10;
  //   f3 = (f3 + Math.random() / 80) % 10;
  //   f4 = (f4 + Math.random() / 411) % 10;
  //   p1 += 0.5 % (Math.PI * 2);
  //   if(p1 > 500) p1 = 0;
  //   drawHarmonograph(c);
  // }

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
      // e.fillStyle = 'red';

      // makeHarmonograph(e)
      // e.clearRect(0, 0, 600, 400);
      // e.fillStyle = "rgb(" + matrixEngine.utility.randomIntFromTo(0,250) + "," +  matrixEngine.utility.randomIntFromTo(0,250) + "," +  matrixEngine.utility.randomIntFromTo(0,250) + ")";
      // e.strokeStyle = "rgb(" + p1 + "," + g + "," + b + ")";
      e.fillStyle = "rgb(113,145,144)"
      e.fillRect(0, 0, 600, 400);

      e.fillStyle = 'rgba(0,0,0,0.4)';
      e.fillRect(50, 50, 100 , 100);
      e.fillRect(50, 20, 500 , 20);
      e.fillRect(50, 170, 500 , 20);

      e.fillStyle = 'rgba(250,250,250,1)';
      e.font = 'bold 60px stormfaze'
      e.textAlign = 'left';
      e.fillText(`${ref.playerInfo.balance} ${ref.playerInfo.currency}`, 350, 95, 200, 40)
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

const soundsEnabled = () => {
  if(typeof matrixEngine.utility.QueryString.sounds == 'undefined' ||
    matrixEngine.utility.QueryString.sounds == 'true') {
    return true;
  } else {
    return false;
  }
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
    // console.log('Player info 2d draws ', playerInfo)
    let last10 = [];

    nidza.createNidzaIndentity(n);
    let texCanvas = document.getElementById('statusBox');

    var previewR__small = '';
    var previewR__ = '';
    var previewR = '';
    var previewTitle = 'matrix roulette 1.0 ' + (soundsEnabled() == true ? ' sounds: ON' : ' sounds Off');

    var colorForCOLOR = 'rgba(120,0,0,0.4)'
    var colorForOpenGame = 'lime'
    var colorForLastMoment = 'rgba(255,15,15,1)'
    var p1 = 0;

    addEventListener('MEDITATE_SERVER', (e) => {
      p1 = e.detail * 17
      colorForCOLOR = colorForOpenGame
    })

    addEventListener('RESULT', (e) => {
      // console.log('SYMBOLIC ONLY - CONNECT WITH PROGRESS BAR IN 2d HUD', e)
      p1 = e.detail * 17
      colorForCOLOR = colorForLastMoment
    })

    addEventListener('RESULTS_FROM_SERVER', (e) => {
      console.log('RESULTS_FROM_SERVER ADD TO LAST 10 ', e.detail)
      last10.push(e.detail)
      if(RULES.red.indexOf(parseInt(e.detail)) != -1) {
        previewR = e.detail
        previewR__ = '🔴'
      } else if(RULES.black.indexOf(parseInt(e.detail)) != -1) {
        previewR = e.detail
        previewR__ = '⚫'
      } else if(e.detail == 0) {
        previewR = 'ZERO ' + e.detail
        previewR__ = ''
      }
    })

    addEventListener('RESULTS_FROM_MANUAL', (e) => {
      console.log('RESULTS_FROM_MANUAL ADD TO LAST 10 ', e.detail)
      last10.push(e.detail)
      if(RULES.red.indexOf(parseInt(e.detail)) != -1) {
        previewR = e.detail
        previewR__ = '🔴'
      } else if(RULES.black.indexOf(parseInt(e.detail)) != -1) {
        previewR = e.detail
        previewR__ = '⚫'
      } else if(e.detail == 0) {
        previewR = 'ZERO ' + e.detail
        previewR__ = ''
      }
    })

    addEventListener('SET_STATUSBOX_TEXT', (e) => {
      console.log('previewTitle CONNECT WITH PROGRESS BAR IN 2d HUD', e)
      previewR = e.detail
    })

    addEventListener('SET_STATUSBOX_TITLE', (e) => {
      console.log('SET_STATUSBOX_TEXT CONNECT WITH PROGRESS BAR IN 2d HUD', e)
      previewTitle = e.detail
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

        e.textAlign = 'center';

        e.fillStyle = 'rgba(250,250,250,1)';
        // if (previewR != -1) 
        e.font = 'bold 60px stormfaze'
        e.fillText("" + previewR__.toString(), 340, 152, 250)
        e.font = 'bold 40px stormfaze'
        e.fillText("" + previewR.toString(), 340, 148, 250)


        e.fillRect(170, 66, 250, 43)

        e.textAlign = 'left';
        e.font = 'normal 20px stormfaze'
        e.fillStyle = 'rgba(250,250,250,1)';


        e.fillStyle = 'rgba(250,50,50,1)';
        e.fillText(`maximumroulette.com`, 170, 78, 250, 33)
        e.fillText(`github.com/zlatnaspirala`, 170, 100, 250, 33)

        e.font = 'normal 33px stormfaze'
        e.fillStyle = 'rgba(250,250,250,1)';
        e.fillText(previewTitle, 20, 50, 550, 25)

        e.fillStyle = 'rgba(250,250,250,1)';
        e.fillText(`Game status`, 20, 160, 250, 25)
        // var myGradient = e.createLinearGradient(0, 0, 650, 250);
        // myGradient.addColorStop(0, 'red');
        // myGradient.addColorStop(1, 'orange');
        // e.fillStyle = myGradient;
        // e.fillRect(450 - p1.UPDATE(), 0, 5 , 200)

        // last10
        e.textAlign = 'center';
        last10.forEach((winNum, index) => {
          e.font = 'normal 23px stormfaze'
          if(RULES.red.indexOf(parseInt(winNum)) != -1) {
            previewR__small = '🔴'
          } else if(RULES.black.indexOf(parseInt(winNum)) != -1) {
            previewR__small = '⚫'
          } else if(winNum == 0) {
            previewR__small = 'ZERO'
          }
          e.fillText(previewR__small, 20 + index*30, 230, 250, 25)
          
          e.fillText(winNum, 20 + index*30, 230, 250, 25)

        })

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

export function create2dHUDStatusLine(nidza, status) {

  try {
    var T = status.text;
  } catch(err) {
    console.error('Secound arg status.text must be instance of MTM class from matrix-engine-plugins')
    return;
  }

  return new Promise((resolve, reject) => {
    let n = {
      id: "statusBoxLine",
      size: {
        width: 650,
        height: 50
      }
    }
    nidza.createNidzaIndentity(n);
    let texCanvas = document.getElementById('statusBoxLine');

    addEventListener('SET_STATUS_LINE_TEXT', (e) => {
      T.fillText(e.detail)
    })
    // matrix effect in bg
    // const cols = Math.floor(500 / 20) + 1;
    // const ypos = Array(cols).fill(0);

    nidza.access.statusBoxLine.addCustom2dComponent({
      id: "CUSTOM",
      draw: function(e) {
        if(e instanceof CanvasRenderingContext2D == false) return;

        // e.fillRect(0, 2, 550, 2)
        e.textAlign = 'left';
        e.font = 'normal 45px stormfaze'
        e.fillStyle = 'rgba(250,250,250,1)';
        e.fillText(`☞ ${T.text}🐲`, 10, 31, 550, 60)

        // e.fillStyle = '#0001';
        // // Set color to green and font to 15pt monospace in the drawing context
        // e.fillStyle = '#0f0';
        // e.font = '15pt monospace';

        // // for each column put a random character at the end
        // ypos.forEach((y, ind) => {
        //   // generate a random character
        //   const text = String.fromCharCode(Math.random() * 128);
        //   // x coordinate of the column, y coordinate is already given
        //   const x = ind * 20;
        //   // render the character at (x, y)
        //   e.fillText(text, x, y);
        //   // randomly reset the end of the column if it's at least 100px high
        //   if(y > 100 + Math.random() * 10000) ypos[ind] = 0;
        //   // otherwise just move the y coordinate for the column 20px down,
        //   else ypos[ind] = y + 20;
        // });

        // var myGradient = e.createLinearGradient(0, 0, 650, 250);
        // myGradient.addColorStop(0, 'red');
        // myGradient.addColorStop(1, 'orange');
        // e.fillStyle = myGradient;
        // e.fillRect(450 - p1.UPDATE(), 0, 5 , 200)

      },
      position: {
        x: 30,
        y: 40
      },
      dimension: {
        width: 500,
        height: 100
      }
    });

    nidza.access.statusBoxLine.elements[0].activeDraw()
    nidza.access.statusBoxLine.canvasDom.setAttribute("style", "position: absolute; left: 0;display:none");
    resolve(texCanvas);
  })
}