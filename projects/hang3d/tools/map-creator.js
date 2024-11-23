var byId= (id) => {
	return document.getElementById(id)
}

var mapCreator = {
	map: {staticCubes: []},
	copyToStorage: () => {
		localStorage.setItem('map', JSON.stringify(mapCreator.map))
	},
	createMap: function(size) {
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
					var X = 4.2*parseFloat(e.target.getAttribute('data-x'));
					var Z = 4.2*parseFloat(e.target.getAttribute('data-z'));
					this.map.staticCubes.push(
						{
							name: "wall_gen" + parseFloat(e.target.getAttribute('data-x')) + "_" + parseFloat(e.target.getAttribute('data-z')),
							position: {x: X, y: 1, z: Z},
							scale: [1, 1, 1],
							texture: {
								source: ["res/images/diffuse.png"],
								mix_operation: "multiply"
							}
						})
						this.copyToStorage()
						e.target.style.background = 'gray';
				}
				field.addEventListener("click", _add)
				vertical.appendChild(field)
			}
			root.appendChild(vertical);
		}
	},

	run: () => {
		mapCreator.createMap([byId('sizeX').value, byId('sizeY').value])
		// byId("paramsPopup").()
	}
};

// mapCreator.createMap([25, 25])


window.mapCreator = mapCreator;