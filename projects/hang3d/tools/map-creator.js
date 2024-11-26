var byId = (id) => {
	return document.getElementById(id)
}

var mapCreator = {
	isMousePressed: false,
	clear: () => {
		location.reload()
	},
	map: {
		staticCubes: [],
		staticFloors: [],
		staticObjs: [],
		noPhysics: {
			cubes: []
		}
	},
	copyToStorage: () => {
		localStorage.setItem('map', JSON.stringify(mapCreator.map))
	},
	createMap: function(size) {
		window.addEventListener('contextmenu', (event) => {
			event.preventDefault()
		})

		var root = document.getElementById('root');
		for(var j = 0;j < size[0];j++) {
			var vertical = document.createElement('div');
			vertical.style = `width:90%;height:${innerHeight / size[1]}px;`;
			vertical.classList.add('vertical')
			vertical.id = 'vertical';
			for(var i = 0;i < size[1];i++) {
				var field = document.createElement('div');
				field.style = `width:${innerWidth / size[0]}`;
				field.classList.add('field')
				field.id = 'field' + i;
				field.setAttribute("data-z", j)
				field.setAttribute("data-x", i)
				const _add = (e) => {mapCreator.isMousePressed = true}
				field.addEventListener("mousedown", _add)
				field.addEventListener("mouseup", () => {mapCreator.isMousePressed = false})
				// mousemove
				const _add_OnHover = (e) => {
					if(mapCreator.isMousePressed == false ||
						e.target.getAttribute('data-status') == 'used'
					) return;
					e.target.setAttribute('data-status', 'used')
					e.target.style.background = `url(${'../' + byId('texinput').selectedOptions[0].value})`
					var X = 4.2 * parseFloat(e.target.getAttribute('data-x'));
					var Z = 4.2 * parseFloat(e.target.getAttribute('data-z'));
					X = parseFloat(X.toFixed(2))
					Z = parseFloat(Z.toFixed(2))
					var Y = parseFloat(byId('levelY').value);

					if(byId('tinput').selectedOptions[0].value == "ME Cube") {

						this.map.staticCubes.push(
							{
								name: "wall_gen" + parseFloat(e.target.getAttribute('data-x')) + "_" + parseFloat(e.target.getAttribute('data-z')),
								position: {x: X, y: Y, z: Z},
								scale: [parseFloat(byId('scaleX').value), parseFloat(byId('scaleY').value), parseFloat(byId('scaleZ').value)],
								rotation: {rotx: parseFloat(byId('rotX').value), roty: parseFloat(byId('rotY').value), rotz: parseFloat(byId('rotZ').value)},
								activeRotation: [parseFloat(byId('arotX').value), parseFloat(byId('arotY').value), parseFloat(byId('arotZ').value)],
								texture: {
									source: [byId('texinput').selectedOptions[0].value],
									mix_operation: "multiply"
								}
							})
					} else if(byId('tinput').selectedOptions[0].value == "Static Floor") {
						this.map.staticFloors.push(
							{
								name: "sf_gen" + parseFloat(e.target.getAttribute('data-x')) + "_" + parseFloat(e.target.getAttribute('data-z')),
								position: {x: X, y: Y, z: Z},
								scale: [parseFloat(byId('scaleX').value), parseFloat(byId('scaleY').value), parseFloat(byId('scaleZ').value)],
								rotation: {rotx: parseFloat(byId('rotX').value), roty: parseFloat(byId('rotY').value), rotz: parseFloat(byId('rotZ').value)},
								// activeRotation: [parseFloat(byId('arotX').value), parseFloat(byId('arotY').value), parseFloat(byId('arotZ').value)],
								texture: {
									source: [byId('texinput').selectedOptions[0].value],
									mix_operation: "multiply"
								}
							})
					} else if(byId('tinput').selectedOptions[0].value == "NOPHYSICS Cube") {
						this.map.noPhysics.cubes.push(
							{
								name: "wall_gen" + parseFloat(e.target.getAttribute('data-x')) + "_" + parseFloat(e.target.getAttribute('data-z')),
								position: {x: X, y: Y, z: Z},
								scale: [parseFloat(byId('scaleX').value), parseFloat(byId('scaleY').value), parseFloat(byId('scaleZ').value)],
								rotation: {rotx: parseFloat(byId('rotX').value), roty: parseFloat(byId('rotY').value), rotz: parseFloat(byId('rotZ').value)},
								activeRotation: [parseFloat(byId('arotX').value), parseFloat(byId('arotY').value), parseFloat(byId('arotZ').value)],
								texture: {
									source: [byId('texinput').selectedOptions[0].value],
									mix_operation: "multiply"
								}
							})
					} else {
						this.map.staticObjs.push(
							{
								name: "mapobjs_" + parseFloat(e.target.getAttribute('data-x')) + "_" + parseFloat(e.target.getAttribute('data-z')),
								path: byId('tinput').selectedOptions[0].value,
								position: {x: X, y: Y, z: Z},
								rotation: {rotx: parseFloat(byId('rotX').value), roty: parseFloat(byId('rotY').value), rotz: parseFloat(byId('rotZ').value)},
								activeRotation: [byId('arotX').value, byId('arotY').value, byId('arotZ').value],
								scale: [parseFloat(byId('scaleX').value), parseFloat(byId('scaleY').value), parseFloat(byId('scaleZ').value)],
								texture: {
									source: [byId('texinput').selectedOptions[0].value],
									mix_operation: "multiply"
								}
							})
					}
					this.copyToStorage()
				}
				field.addEventListener("mousemove", _add_OnHover)

				vertical.appendChild(field)
			}
			root.appendChild(vertical);
		}
	},
	run: () => {
		mapCreator.createMap([byId('sizeX').value, byId('sizeY').value])

		byId('createMapDom').style.display = 'none';
		byId('mapDom').style.display = 'block';
	},
	copyMap: () => {
		navigator.clipboard.writeText(
			localStorage.getItem('map')
		);
	},
	loadMap: (arg) => {
		// make inverse - load map from file. wip
		console.log('TEST LOAD MAP , ', arg)
		if(byId('mapForLoad').files.length == 1) {
			console.log("File selected: ", byId('mapForLoad').files[0]);
			var reader = new FileReader();
			reader.readAsText(byId('mapForLoad').files[0], "UTF-8");
			reader.onload = function(evt) {
				console.log(evt.target.result)
			}
			reader.onerror = function(err) {console.log(err)}
		}
	}
};
window.mapCreator = mapCreator;