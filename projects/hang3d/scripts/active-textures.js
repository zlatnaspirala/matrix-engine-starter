import {Nidza} from "nidza";

export class Create2DBanner {

	constructor() {
		return new Promise((resolve, reject) => {
			let n = {
				id: "statusBox",
				size: {
					width: 600,
					height: 250
				}
			}

			let last10 = [];

			let nidza = new Nidza();
			nidza.createNidzaIndentity(n);

			let texCanvas = document.getElementById('statusBox');

			var previewR__ = '';
			var previewR = '';
			var previewTitle = 'matrix engine 2.2.0 ';
			var colorForCOLOR = 'rgba(120,0,0,0.4)'
			var colorForLastMoment = 'rgba(255,15,15,1)'
			var p1 = 0;

			addEventListener('SOME_CHANGES', (e) => {
				// p1 = e.detail * 17
				// colorForCOLOR = colorForOpenGame
			})

			let activeTexture1 = nidza.access.statusBox.addCustom2dComponent({
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
			resolve(texCanvas);
			return texCanvas;
		});
	}
}