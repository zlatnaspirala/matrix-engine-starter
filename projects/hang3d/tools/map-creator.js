var byId = (id) => {
	return document.getElementById(id)
}

var mapCreator = {
	isMousePressed: false,
	clear: () => {
		location.reload()
	},
	map: {staticCubes: []},
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
			vertical.style = `width:100%;height:${innerHeight / size[1]}px;`;
			vertical.classList.add('vertical')
			vertical.id = 'vertical';
			for(var i = 0;i < size[1];i++) {
				var field = document.createElement('div');
				field.style = `width:${innerWidth / size[0]}`;
				field.classList.add('field')
				field.id = 'field' + i;
				field.setAttribute("data-z", j)
				field.setAttribute("data-x", i)
				const _add = (e) => {
					if(e.target.getAttribute('data-status') == 'used') return;
					console.log("🖱 mapCreator.isMousePressed = true; ", e)
					e.target.setAttribute('data-status', 'used')
					mapCreator.isMousePressed = true;
					if(e.button == 2) {
						console.log("1 🖱 right click detected!")
					}
					var X = 4.2 * parseFloat(e.target.getAttribute('data-x'));
					var Z = 4.2 * parseFloat(e.target.getAttribute('data-z'));
					X = parseFloat(X.toFixed(2))
					Z = parseFloat(Z.toFixed(2))
					this.map.staticCubes.push(
						{
							name: "wall_gen" + parseFloat(e.target.getAttribute('data-x')) + "_" + parseFloat(e.target.getAttribute('data-z')),
							position: {x: X, y: byId('levelY').value, z: Z},
							scale: [1, 1, 1],
							texture: {
								source: [byId('texinput').selectedOptions[0].value],
								mix_operation: "multiply"
							}
						})
					this.copyToStorage()
					e.target.style.background = 'gray';
				}
				field.addEventListener("mousedown", _add)
				field.addEventListener("mouseup", () => {
					mapCreator.isMousePressed = false;
				})
				// mousemove
				const _add_OnHover = (e) => {
					if(mapCreator.isMousePressed == false ||
						e.target.getAttribute('data-status') == 'used'
					) return;
					e.target.setAttribute('data-status', 'used')
					var X = 4.2 * parseFloat(e.target.getAttribute('data-x'));
					var Z = 4.2 * parseFloat(e.target.getAttribute('data-z'));
					X = parseFloat(X.toFixed(2))
					Z = parseFloat(Z.toFixed(2))
					this.map.staticCubes.push(
						{
							name: "wall_gen" + parseFloat(e.target.getAttribute('data-x')) + "_" + parseFloat(e.target.getAttribute('data-z')),
							position: {x: X, y: byId('levelY').value, z: Z},
							scale: [1, 1, 1],
							texture: {
								source: ["res/images/diffuse.png"],
								mix_operation: "multiply"
							}
						})
					this.copyToStorage()
					e.target.style.background = 'gray';
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
	}
};
window.mapCreator = mapCreator;