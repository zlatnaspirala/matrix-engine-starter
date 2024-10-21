import {byId} from "matrix-engine/lib/utility";


export function createPauseScreen () {
	var root = document.createElement('div')
	root.id = 'pauseScreen';
	root.style = 'display:flex;position:fixed;left:0;top:0;width:100%;height:100%;';
	
	function hidePauseScreen () {
		byId('pauseScreen').style.display = 'none';
	}
	root.innerHTML = `
	  <h2> <button id="pauseGame" class='btn'>PLAY</button>  </h2>
	`;
	document.body.appendChild(root)

	byId('pauseGame').addEventListener('click', hidePauseScreen, {passive: true})
}