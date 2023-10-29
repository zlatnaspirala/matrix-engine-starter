
import {stdFonts} from "./standard-fonts";
import * as matrixEngine from "matrix-engine";
var App = matrixEngine.App;

/**
 * @description 
 * Status text
 */
export function createNidzaHudBalance(nidza, statusText, TEXTS, TEXTSHOVERS) {
  return new Promise((resolve, reject) => {
    let n = {
      id: "statusLine",
      size: {
        width: 500,
        height: 250
      }
    };
    var statusLine = nidza.createNidzaIndentity(n);
    let texCanvas = document.getElementById('statusLine');

    console.log(statusText.text)


    nidza.access.statusLine.addCustom2dComponent({
      id: "CUSTOM",
      draw: function(e) {
        if(e instanceof CanvasRenderingContext2D == false) return;
        // e.fillStyle = 'rgba(50,20,20,0.5)';
        // e.fillRect(0, 2, 550, 2)

        e.textAlign = 'left';
        e.font = 'normal 44px stormfaze'
        e.fillStyle = 'rgba(250,250,250,1)';
        e.fillText(`☞ ${statusText.text}🐲`, 0, 25, 550, 70)

        TEXTS.forEach((element, index) => {
          e.font = 'normal 25px stormfaze'
          e.fillStyle = 'rgba(250,10,150,1)';
          e.fillText(`☞ ${element.text}✮ `, 10, 55 + index * 24, 570, 60)
        });

        TEXTSHOVERS.forEach((element, index) => {
          e.font = 'normal 18px stormfaze'
          e.fillStyle = 'rgba(250,60,50,1)';
          e.fillText(`☞ ${element.text}✮ `, 10, 100 + index * 24, 570, 60)
        });
      },
      position: {
        x: 30,
        y: 40
      },
      dimension: {
        width: 500,
        height:250
      }
    });

    nidza.access.statusLine.elements[0].activeDraw()
    nidza.access.statusLine.canvasDom.setAttribute("style", "position: absolute; left: 0;display:none");
    resolve(texCanvas)
  });
}

  /**
 * @description 
 * Status text
 */
export function createHudBtnRotZ(nidza) {
  return new Promise((resolve, reject) => {
    let n = {
      id: "cmdRotZ",
      size: {
        width: 150,
        height: 50
      }
    };
    var cmdRotZ = nidza.createNidzaIndentity(n);
    let texCanvas = document.getElementById('cmdRotZ');
    nidza.access.cmdRotZ.addCustom2dComponent({
      id: "CUSTOM",
      draw: function(e) {
        if(e instanceof CanvasRenderingContext2D == false) return;
        e.fillStyle = 'rgba(5,5,140,40)';
        e.fillRect(0, 2, 550, 2)

        e.textAlign = 'left';
        e.font = 'normal 44px stormfaze'
        e.fillStyle = 'rgba(250,250,250,1)';
        e.fillText(`ROTZ`, 0, 25, 150, 30)
      },
      position: {
        x: 30,
        y: 40
      },
      dimension: {
        width: 500,
        height:250
      }
    });

    nidza.access.cmdRotZ.elements[0].activeDraw()
    nidza.access.cmdRotZ.canvasDom.setAttribute("style", "position: absolute; left: 0;display:none");
    resolve(texCanvas)
  });


}