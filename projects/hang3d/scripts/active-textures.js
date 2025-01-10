import {Nidza} from "nidza";

// global
// App.myAccounts.leaderboardData

export class Create2DBanner {

	constructor() {
		return new Promise((resolve, reject) => {
			let n = {
				id: "statusBox",
				size: {
					width: 600,
					height: 600
				}
			}

			let last10 = [];

			let nidza = new Nidza();
			nidza.createNidzaIndentity(n);

			var logo1 = new Image()
			logo1.src = './res/icons/favicon-96x96.png';

			let texCanvas = document.getElementById('statusBox');
			var colorForOpenGame = 'lime'
			var previewR = 'Hang3d matrix';
			var previewTitle = '*FPS Area Hang3d Serials*';
			var colorForCOLOR = 'rgba(252, 86, 86, 0.89)'
			var colorForLastMoment = 'rgba(255,15,15,1)'
			var p1 = 0;

			addEventListener("progressBar", (e) => {
				p1 = e.detail * 17
				colorForCOLOR = colorForOpenGame
			})

			let activeTexture1 = nidza.access.statusBox.addCustom2dComponent({
				id: "CUSTOM",
				draw: function(e) {
					if(e instanceof CanvasRenderingContext2D == false) return;

					e.drawImage(logo1, 10, 10, 90, 90)
					e.fillStyle = colorForCOLOR;
					e.fillRect(50, 185, 10 + p1, 22);

					e.fillRect(50 + 500 - (20 * 17), 180, 500 - (10 * 17), 3);
					e.fillRect(50 + 500 - (20 * 17), 209, 500 - (10 * 17), 3);

					e.fillStyle = colorForLastMoment
					e.fillRect(50, 180, 500 - (20 * 17), 3);
					e.fillRect(50, 209, 500 - (20 * 17), 3);

					e.textAlign = 'center';
					e.fillStyle = 'rgba(250,250,250,1)';
					e.font = 'bold 40px stormfaze'
					e.fillRect(170, 66, 250, 23)

					e.textAlign = 'left';
					e.font = 'normal 20px stormfaze'

					e.fillStyle = 'rgba(250,50,50,1)';
					e.fillText(`maximumroulette.com`, 170, 78, 250, 33)

					e.font = 'normal 80px stormfaze'
					e.fillText(previewR, 55, 130, 450)

					e.font = 'normal 33px stormfaze'
					e.fillStyle = 'rgba(250,250,250,1)';
					e.fillText(previewTitle, 20, 50, 550, 25)

					e.font = 'normal 18px stormfaze'
					e.fillStyle = 'rgb(255, 115, 0)';
					// Table from DB
					if(App.myAccounts.leaderboardData) App.myAccounts.leaderboardData.forEach((item, index) => {
						e.fillText("Nick: " + item.nickname, 30, 270 + index * 25, 550, 25)
						e.fillText("Points: " + item.points, 230, 270 + index * 25, 550, 25)
						e.fillText("Rank: " + item.rank, 410, 270 + index * 25, 550, 25)
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
			resolve(texCanvas);
			return texCanvas;
		});
	}
}