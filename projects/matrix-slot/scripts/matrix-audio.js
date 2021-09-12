
import * as AudioSystem from "audio-commander";

var myAudioSystem = new AudioSystem.AudioMatrix();

const audioOption1 = {
  id: "shootSpin",
  srcPath: "res/audios/laser6.mp3",
}

const audioOption2 = {
  id: "shootSpin2",
  srcPath: "res/audios/laser7.mp3",
}

const audioOption3 = {
  id: "shootSpin3",
  srcPath: "res/audios/laser6.mp3",
}

const audioOption4 = {
  id: "shootSpin4",
  srcPath: "res/audios/laser7.mp3",
}

const audioOption5 = {
  id: "shootSpin5",
  srcPath: "res/audios/laser6.mp3",
}

const audioOption6 = {
  id: "shootSpin6",
  srcPath: "res/audios/laser7.mp3",
}

let options = [
  audioOption1,
  audioOption2,
  audioOption3,
  audioOption4,
  audioOption5,
  audioOption6
]

export let startSpin = myAudioSystem.createAudioResource(options);

const audioOptionStop1 = {
  id: "stopSpin",
  srcPath: "res/audios/laser8.mp3",
}

const audioOptionStop2 = {
  id: "stopSpin2",
  srcPath: "res/audios/laser8.mp3",
}

const audioOptionStop3 = {
  id: "stopSpin3",
  srcPath: "res/audios/laser8.mp3",
}

const audioOptionStop4 = {
  id: "stopSpin4",
  srcPath: "res/audios/laser8.mp3",
}

const audioOptionStop5 = {
  id: "stopSpin5",
  srcPath: "res/audios/laser8.mp3",
}

const audioOptionStop6 = {
  id: "stopSpin6",
  srcPath: "res/audios/laser8.mp3",
}

let options2 = [
  audioOptionStop1,
  audioOptionStop2,
  audioOptionStop3,
  audioOptionStop4,
  audioOptionStop5,
  audioOptionStop6
]

export let stopSpin = myAudioSystem.createAudioResource(options2);

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