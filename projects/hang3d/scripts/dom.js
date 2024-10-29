import {byId} from "matrix-engine/lib/utility";


export function createPauseScreen () {
	var root = document.createElement('div')
	root.id = 'pauseScreen';
	// root.style = '';
	function hidePauseScreen () {
		byId('pauseScreen').style.display = 'none';
	}
	root.innerHTML = `
	  <h2 class="pauseScreenText">
			Hang3d Matrix
			<button id="pauseGame" class='btn'>PLAY</button>
			<div style="font-size:15px;">Powered by matrix-engine</div>
			<div style="display: grid;font-size:15px;">Source code: <a href="https://github.com/zlatnaspirala">github/zlatnaspirala</a></div>
		</h2>
	`;
	document.body.appendChild(root)

	byId('pauseGame').addEventListener('click', hidePauseScreen, {passive: true})
}