import {byId} from "matrix-engine/lib/utility";


export function createPauseScreen () {
	var root = document.createElement('div')
	root.id = 'pauseScreen';
	root.style = 'display:flex;position:fixed;left:0;top:0;width:100%;height:100%;background:black;opacity:0.7;';
	function hidePauseScreen () {
		byId('pauseScreen').style.display = 'none';
	}
	root.innerHTML = `
	  <h2 style="display: grid;margin: auto;font-size:100px;" > 
			Hang3d Matrix
			<button id="pauseGame" class='btn'>PLAY</button>
			<div style="font-size:15px;">Powered by matrix-engine</div>
			<div style="display: grid;font-size:15px;">Source code: <a href="https://github.com/zlatnaspirala">github/zlatnaspirala</a></div>
		</h2>
	`;
	document.body.appendChild(root)

	byId('pauseGame').addEventListener('click', hidePauseScreen, {passive: true})
}