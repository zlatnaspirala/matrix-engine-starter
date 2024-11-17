
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
					this.map.staticCubes.push(
						{
							name: "wall_gen" + i + "_" + j,
							position: {x: e.target.getAttribute('data-x'), y: 1, z: e.target.getAttribute('data-z')},
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
};

mapCreator.createMap([25, 25])

window.mapCreator = mapCreator;