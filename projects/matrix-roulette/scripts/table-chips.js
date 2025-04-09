import * as matrixEngine from "matrix-engine"
import * as CANNON from 'cannon';
import {RULES} from "./table-events";

/**
 * @author Nikola Lukic 
 * @email zlatnaspirala@gmail.com
 * @website https://maximumroulette.com
 */
export default class TableChips {
	constructor(pWorld, registerBetPlaces) {
		this.physics = pWorld;
		// Every chips (per real 3d obj) is pushed intro register array.
		// Resolve proper removing (clera chips procedure)
		this.register = [];
		this.registerBetPlaces = registerBetPlaces;

		this.tex = {
			source: ["res/images/chip1.png"],
			mix_operation: "multiply",
		};

		this.tex = {
			source: ["res/images/clear.png"],
			mix_operation: "multiply",
		};

		addEventListener("chip-bet", (e) => {
			if(e.detail.name.indexOf('clearBets') != -1) {
				dispatchEvent(new CustomEvent('clear-chips', {detail: 'CLEAR BETS'}))
			} else {
				if(e.detail.tableEvents) {
					if(roulette.status.game == 'MEDITATE') {
						this.addChip(e.detail);
						roulette.status.text.fillText('Played on ' + e.detail.name)
						if(roulette.soundsEnabled() == true) {
							matrixEngine.App.sounds.play('chip')
						}
					} else {
						dispatchEvent(new CustomEvent('SET_STATUSBOX_TEXT', {detail: 'Please wait...'}))
					}
				}
			}
		})

		addEventListener("clear-chips", (e) => {
			this.clearAll()
			dispatchEvent(new CustomEvent('SET_STATUS_LINE_TEXT', {detail: '✫CLEAR BETS✫'}))
			try {
				matrixEngine.App.sounds.play('clear')
			} catch(e) {}
		})
	}

	addChip(o) {
		// o is matrix engine scene obj
		var size = 0.25;
		// Need to be uniq name
		var name = "chips_" + o.name + "_" + this.register.length;
		this.addObjChip(name).then((d) => {
			var b2 = new CANNON.Body({
				type: CANNON.Body.STATIC, // pragmatic but very nice solution
				mass: 10,
				linearDamping: 0.1,
				position: new CANNON.Vec3(o.position.x, o.position.z, o.position.y + 0 + (o.tableEvents.chips * 0.05)),
				shape: new CANNON.Box(new CANNON.Vec3(0.27, 0.02, 0.27))
			});
			this.physics.world.addBody(b2);
			d.physics.currentBody = b2;
			d.physics.enabled = true;
			d.physics.currentBody.allowSleep = false;
			// memo bet
			o.tableEvents.chips++;
			dispatchEvent(new CustomEvent('update-balance', {detail: 1}))
			this.register.push({chipObj: d, betPlace: o})
		})
	}

	addObjChip(name) {
		return new Promise((resolve, reject) => {
			function onLoadObj(meshes) {
				try {
					matrixEngine.objLoader.initMeshBuffers(matrixEngine.matrixWorld.world.GL.gl, meshes[name]);
					var tex = {
						source: ["res/images/chip1.png"],
						mix_operation: "multiply",
					};
					matrixEngine.matrixWorld.world.Add("obj", 1, name, tex, meshes[name]);
					App.scene[name].raycast.enabled = false;
					App.scene[name].position.y = 1;
					App.scene[name].mesh.setScale(0.01)
					resolve(App.scene[name])
				} catch(err) {
					reject('Loading obj chip error: ' + err)
				}
			}
			var _name = {};
			_name[name] = "res/3d-objects/chip1.obj"
			matrixEngine.objLoader.downloadMeshes(_name, onLoadObj);
		})
	}

	clearAll() {
		for(var x = this.register.length - 1;x >= 0;x--) {
			console.log('clear -> ', this.register[x].betPlace.tableEvents.chips)
			if(this.register[x].betPlace.tableEvents.chips == 0) {
				// alredy removed like a lost one.
				// console.log('alredy chips 0 -> ', this.register[x].chipObj.name)
				if(typeof App.scene[this.register[x].chipObj.name] != 'undefined' && App.scene[this.register[x].chipObj.name] != null) {
					App.scene[this.register[x].chipObj.name].selfDestroy()
					// console.log('alredy chips 0 -> but remove visuals direct from scene ')
				} else {
					// console.log('alredy chips 0 -> not exist in scene ')
				}
			} else {
				this.register[x].chipObj.selfDestroy()
				this.register[x].betPlace.tableEvents.chips = 0;
			}
		}

		// Double validation
		setTimeout(() => {
			this.register = [];
			var T = matrixEngine.matrixWorld.world.contentList.filter((item) => item.name.indexOf('chips') != -1)
			T.forEach((i) => {i.selfDestroy()});
			// console.log('clearAll ', this.register);
		}, 200)
	}

	isOdd(x) {return x & 1;}
	isEven(x) {return !(x & 1);}

	// Also winning calc...
	removeLostChips(winNumber) {
		var winNumberColor = '';
		if(RULES.red.indexOf(parseInt(winNumber)) != -1) {
			winNumberColor = 'red'
		} else if(RULES.black.indexOf(parseInt(winNumber)) != -1) {
			winNumberColor = 'black';
		} else if(winNumber == 0) {
			winNumberColor = 'ZERO'
		}

		var test = this.register.filter(
			(o) => o.betPlace.tableEvents.chips > 0
		).map(o => {
			// console.log('ONLY PLAYED ', o)
			return o;
		})

		test.forEach((item, index, array) => {
			if(array[index].betPlace.name.indexOf('single') != -1) {
				// it is a single number
				if(winNumber != parseFloat(array[index].betPlace.name.split('gle')[1])) {
					array[index].betPlace.tableEvents.chips = 0;
					array[index].chipObj.selfDestroy()
				} else {
					// winning number
					// console.log('TEST SINGLE WIN CALC')
					var winForSingle = array[index].betPlace.tableEvents.chips * array[index].betPlace.tableEvents.q;
					dispatchEvent(new CustomEvent('update-balance', {detail: -winForSingle}))
				}
			}

			// CORNER 
			var test = false, passedCorner = false;
			if(array[index].betPlace.name.indexOf('corner') != -1 && array[index].betPlace.name.split('orner').length == 2) {
				test = array[index].betPlace.name.split('orner')[1].split('_')
				test.forEach((num) => {
					if(winNumber == parseFloat(num)) {
						passedCorner = true
					}
				})
				test.forEach((num) => {
					if(passedCorner == false) {
						array[index].betPlace.tableEvents.chips = 0;
						array[index].chipObj.selfDestroy()
						passedCorner = null;
					} else {
						// win calc
						if(array[index].betPlace.tableEvents.chips > 0) {
							// console.log('TEST QUATER WIN CALC: ', array[index].betPlace.tableEvents)
							var winForQuater = array[index].betPlace.tableEvents.chips * array[index].betPlace.tableEvents.q;
							array[index].betPlace.tableEvents.chips = 0; // eliminate 
							dispatchEvent(new CustomEvent('update-balance', {detail: -winForQuater}))
						}
					}
				})
			}

			// SPLIT
			var testSplit = false, passedSplit = false;
			if(array[index].betPlace.name.indexOf('split') != -1 && array[index].betPlace.name.split('plit').length == 2) {
				testSplit = array[index].betPlace.name.split('plit')[1].split('_')
				testSplit.forEach((num) => {
					if(winNumber == parseFloat(num)) {
						passedSplit = true
					}
				})
				testSplit.forEach((num) => {
					if(passedSplit == false) {
						array[index].betPlace.tableEvents.chips = 0;
						array[index].chipObj.selfDestroy()
						passedSplit = null;
					} else {
						// console.log('SPLIT test winnning...');
						var winForSplit = array[index].betPlace.tableEvents.chips * array[index].betPlace.tableEvents.q;
						array[index].betPlace.tableEvents.chips = 0; // eliminate 
						dispatchEvent(new CustomEvent('update-balance', {detail: -winForSplit}))
					}
				})
			}

			// STREET
			var testStreet = false, passedStreet = false;
			if(array[index].betPlace.name.indexOf('street') != -1 && array[index].betPlace.name.split('treet').length == 2) {
				testStreet = array[index].betPlace.name.split('treet')[1].split('_')
				testStreet.forEach((num) => {
					if(winNumber == parseFloat(num)) {
						passedStreet = true
					}
				})
				testStreet.forEach((num) => {
					if(passedStreet == false) {
						array[index].betPlace.tableEvents.chips = 0;
						array[index].chipObj.selfDestroy()
						passedStreet = null;
					} else {
						// console.log('STREET test winnning...');
						var winForStreet = array[index].betPlace.tableEvents.chips * array[index].betPlace.tableEvents.q;
						array[index].betPlace.tableEvents.chips = 0; // eliminate
						dispatchEvent(new CustomEvent('update-balance', {detail: -winForStreet}))
					}
				})
			}

			// LINE
			var testLine = false, passedLine = false;
			if(array[index].betPlace.name.indexOf('line_') != -1 && array[index].betPlace.name.split('ine_').length == 2) {
				testLine = array[index].betPlace.name.split('ine_')[1].split('_')
				testLine.forEach((num) => {
					if(winNumber == parseFloat(num)) {
						passedLine = true
					}
				})
				testLine.forEach((num) => {
					if(passedLine == false) {
						array[index].betPlace.tableEvents.chips = 0;
						array[index].chipObj.selfDestroy()
						passedLine = null;
					} else {
						// console.log('LINE test winnning...');
						var winForLine = array[index].betPlace.tableEvents.chips * array[index].betPlace.tableEvents.q;
						array[index].betPlace.tableEvents.chips = 0; // eliminate
						dispatchEvent(new CustomEvent('update-balance', {detail: -winForLine}))
					}
				})
			}

			// column_1 2 3
			if(array[index].betPlace.name == 'column_1' && RULES.column1.indexOf(winNumber) == -1) {
				// console.log('column_1 column FIELD1  chips ')
				array[index].betPlace.tableEvents.chips = 0;
				if(typeof array[index].chipObj != 'undefined' && array[index].chipObj != null) {
					array[index].chipObj.selfDestroy()
				}
			}
			if(array[index].betPlace.name == 'column_1' && RULES.column1.indexOf(winNumber) != -1) {
				// console.log('COLUMN1 test winnning...');
				var winForCOLUMN1 = array[index].betPlace.tableEvents.chips * array[index].betPlace.tableEvents.q;
				array[index].betPlace.tableEvents.chips = 0; // eliminate
				dispatchEvent(new CustomEvent('update-balance', {detail: -winForCOLUMN1}))
			}

			if(array[index].betPlace.name == 'column_2' && RULES.column2.indexOf(winNumber) == -1) {
				// console.log('column_2 column FIELD1  chips ')
				array[index].betPlace.tableEvents.chips = 0;
				if(typeof array[index].chipObj != 'undefined' && array[index].chipObj != null) {
					array[index].chipObj.selfDestroy()
				}
			}
			if(array[index].betPlace.name == 'column_2' && RULES.column2.indexOf(winNumber) != -1) {
				// console.log('COLUMN2 test winnning...');
				var winForCOLUMN2 = array[index].betPlace.tableEvents.chips * array[index].betPlace.tableEvents.q;
				array[index].betPlace.tableEvents.chips = 0; // eliminate
				dispatchEvent(new CustomEvent('update-balance', {detail: -winForCOLUMN2}))
			}

			if(array[index].betPlace.name == 'column_3' && RULES.column3.indexOf(winNumber) == -1) {
				// console.log('column_3 column FIELD1  chips ')
				array[index].betPlace.tableEvents.chips = 0;
				if(typeof array[index].chipObj != 'undefined' && array[index].chipObj != null) {
					array[index].chipObj.selfDestroy()
				}
			}
			if(array[index].betPlace.name == 'column_3' && RULES.column3.indexOf(winNumber) != -1) {
				// console.log('COLUMN3 test winnning...');
				var winForCOLUMN3 = array[index].betPlace.tableEvents.chips * array[index].betPlace.tableEvents.q;
				array[index].betPlace.tableEvents.chips = 0; // eliminate
				dispatchEvent(new CustomEvent('update-balance', {detail: -winForCOLUMN3}))
			}

			if((array[index].betPlace.name.indexOf('from1_12') != -1 && winNumber > 12) ||
				array[index].betPlace.name.indexOf('from1_12') != -1 && winNumber == 0) {
				console.log('weven remove lost   chips ', array[index].betPlace.tableEvents)
				array[index].betPlace.tableEvents.chips = 0;
				if(typeof array[index].chipObj != 'undefined' && array[index].chipObj != null) {
					array[index].chipObj.selfDestroy()
				}
			}
			//win calc
			if(array[index].betPlace.name.indexOf('from1_12') != -1 && winNumber > 0 && winNumber < 13) {
				var winForFrom1to12 = array[index].betPlace.tableEvents.chips * array[index].betPlace.tableEvents.q;
				array[index].betPlace.tableEvents.chips = 0; // eliminate
				dispatchEvent(new CustomEvent('update-balance', {detail: -winForFrom1to12}))
			}

			if((array[index].betPlace.name.indexOf('from13_24') != -1 && winNumber < 13) ||
				(array[index].betPlace.name.indexOf('from13_24') != -1 && winNumber > 24)) {
				array[index].betPlace.tableEvents.chips = 0;
				if(typeof array[index].chipObj != 'undefined' && array[index].chipObj != null) {
					array[index].chipObj.selfDestroy()
				}
			}
			// win calc
			if(array[index].betPlace.name.indexOf('from13_24') != -1 && (winNumber > 12 && winNumber < 24)) {
				var winForFrom13to24 = array[index].betPlace.tableEvents.chips * array[index].betPlace.tableEvents.q;
				array[index].betPlace.tableEvents.chips = 0; // eliminate
				dispatchEvent(new CustomEvent('update-balance', {detail: -winForFrom13to24}))
			}

			if(array[index].betPlace.name.indexOf('from25_36') != -1 && winNumber < 25) {
				array[index].betPlace.tableEvents.chips = 0;
				if(typeof array[index].chipObj != 'undefined' && array[index].chipObj != null) {
					array[index].chipObj.selfDestroy()
				}
			}
			// win calc
			if(array[index].betPlace.name.indexOf('from25_36') != -1 && winNumber > 24) {
				var winForFrom25to36 = array[index].betPlace.tableEvents.chips * array[index].betPlace.tableEvents.q;
				array[index].betPlace.tableEvents.chips = 0; // eliminate
				dispatchEvent(new CustomEvent('update-balance', {detail: -winForFrom25to36}))
			}

			if((array[index].betPlace.name.indexOf('even') != -1 && this.isOdd(winNumber) == true)
				|| (array[index].betPlace.name.indexOf('even') != -1 && winNumber == 0)) {
				if(typeof array[index].chipObj != 'undefined' && array[index].chipObj != null) {
					array[index].betPlace.tableEvents.chips = 0;
					array[index].chipObj.selfDestroy()
				}
			}
			// win calc
			if(array[index].betPlace.name.indexOf('even') != -1 && this.isEven(winNumber) == true && winNumber != 0) {
				var winForEven = array[index].betPlace.tableEvents.chips * array[index].betPlace.tableEvents.q;
				array[index].betPlace.tableEvents.chips = 0; // eliminate
				dispatchEvent(new CustomEvent('update-balance', {detail: -winForEven}))
			}

			if((array[index].betPlace.name.indexOf('odd') != -1 && this.isEven(winNumber) == true)
				|| (array[index].betPlace.name.indexOf('odd') != -1 && winNumber == 0)) {
				if(typeof array[index].chipObj != 'undefined' && array[index].chipObj != null) {
					// console.log('!odd remove stack chips!', array[index].chipObj.name)
					array[index].betPlace.tableEvents.chips = 0;
					array[index].chipObj.selfDestroy()
				}
			}
			// win calc
			if(array[index].betPlace.name.indexOf('odd') != -1 && this.isOdd(winNumber) == true && winNumber != 0) {
				var winForOdd = array[index].betPlace.tableEvents.chips * array[index].betPlace.tableEvents.q;
				array[index].betPlace.tableEvents.chips = 0; // eliminate
				dispatchEvent(new CustomEvent('update-balance', {detail: -winForOdd}))
			}

			if((array[index].betPlace.name.indexOf('low') != -1 && winNumber >= 19) ||
				(array[index].betPlace.name.indexOf('low') != -1 && winNumber == 0)) {
				if(typeof array[index].chipObj != 'undefined' && array[index].chipObj != null) {
					array[index].betPlace.tableEvents.chips = 0;
					array[index].chipObj.selfDestroy()
				}
			}
			// win calc
			if(array[index].betPlace.name.indexOf('low') != -1 && winNumber < 19 && winNumber != 0) {
				var winForLow = array[index].betPlace.tableEvents.chips * array[index].betPlace.tableEvents.q;
				array[index].betPlace.tableEvents.chips = 0; // eliminate
				dispatchEvent(new CustomEvent('update-balance', {detail: -winForLow}))
			}

			if((array[index].betPlace.name.indexOf('high') != -1 && winNumber <= 18) ||
				(array[index].betPlace.name.indexOf('high') != -1 && winNumber == 0)) {
				if(typeof array[index].chipObj != 'undefined' && array[index].chipObj != null) {
					array[index].betPlace.tableEvents.chips = 0;
					array[index].chipObj.selfDestroy()
				}
			}
			// win calc
			if(array[index].betPlace.name.indexOf('high') != -1 && winNumber > 18) {
				var winForHigh = array[index].betPlace.tableEvents.chips * array[index].betPlace.tableEvents.q;
				array[index].betPlace.tableEvents.chips = 0; // eliminate
				dispatchEvent(new CustomEvent('update-balance', {detail: -winForHigh}))
			}

			if(winNumberColor == 'red') { // check zero name ???
				if(array[index].betPlace.name == 'black' || array[index].betPlace.name == 'single0') {
					if(typeof array[index].chipObj != 'undefined' && array[index].chipObj != null) {
						array[index].betPlace.tableEvents.chips = 0;
						array[index].chipObj.selfDestroy()
						// console.log('win is red reset blacks  array[index].betPlace = ', array[index].betPlace)
					}
				}
				// win calc
				if(array[index].betPlace.name == 'red') {
					var winForRed = array[index].betPlace.tableEvents.chips * array[index].betPlace.tableEvents.q;
					array[index].betPlace.tableEvents.chips = 0; // eliminate
					dispatchEvent(new CustomEvent('update-balance', {detail: -winForRed}))
				}
			} else if(winNumberColor == 'black') {
				// console.log('win is balck TEST FILTER2 ')
				if(array[index].betPlace.name == 'red' || array[index].betPlace.name == 'single0') {
					if(typeof array[index].chipObj != 'undefined' && array[index].chipObj != null) {
						array[index].betPlace.tableEvents.chips = 0;
						array[index].chipObj.selfDestroy()
					}
				}
				// win calc
				if(array[index].betPlace.name == 'black') {
					var winForBlack = array[index].betPlace.tableEvents.chips * array[index].betPlace.tableEvents.q;
					array[index].betPlace.tableEvents.chips = 0;
					dispatchEvent(new CustomEvent('update-balance', {detail: -winForBlack}))
				}
			} else if(winNumberColor == "ZERO") {
				if(array[index].betPlace.name == 'red') {
					if(typeof array[index].chipObj != 'undefined' && array[index].chipObj != null) {
						array[index].betPlace.tableEvents.chips = 0;
						array[index].chipObj.selfDestroy()
						// console.log('win is black reset red  array[index].betPlace = ', array[index].betPlace)
					}
				}
				if(array[index].betPlace.name == 'black') {
					if(typeof array[index].chipObj != 'undefined' && array[index].chipObj != null) {
						array[index].betPlace.tableEvents.chips = 0;
						array[index].chipObj.selfDestroy()
						// console.log('win is red reset blacks  array[index].betPlace = ', array[index].betPlace)
					}
				}
			}
		})
	}
}