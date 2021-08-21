
import * as AudioSystem from "audio-commander";

var myAudioResources = new AudioSystem.AudioMatrix();

const audioOption1 = {
  id: "shootSpin",
  srcPath: "res/audios/wheel-start.mp3",
}

const audioOption2 = {
  id: "shootSpin2",
  srcPath: "res/audios/wheel-start.mp3",
}

const audioOption3 = {
  id: "shootSpin3",
  srcPath: "res/audios/wheel-start.mp3",
}

const audioOption4 = {
  id: "shootSpin4",
  srcPath: "res/audios/wheel-start.mp3",
}

const audioOption5 = {
  id: "shootSpin5",
  srcPath: "res/audios/wheel-start.mp3",
}

const audioOption6 = {
  id: "shootSpin6",
  srcPath: "res/audios/wheel-start.mp3",
}

let options = [
  audioOption1,
  audioOption2,
  audioOption3,
  audioOption4,
  audioOption5,
  audioOption6
]

export let mashineAudio = myAudioResources.createAudioResource(options);

window.mashineAudio = mashineAudio;

/*
var myPromiseCheck = testMyAudio[0].play();
myPromiseCheck.then( () => {
  alert('You are using auto play allowed browser version or you are lucky.')
})

myPromiseCheck.catch((e) => {
  console.info("Auto play is disabled by browser.");
})

// testMyAudio[0].onerror = function() { console.error("error audio")}

testMyAudio[0].onended = function() {
  console.warn("The audio has ended");
};
*/