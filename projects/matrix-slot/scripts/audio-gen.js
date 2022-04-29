
let audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext);

//All arguments are optional:

// Duration of the tone in milliseconds. Default is 500.
// Frequency of the tone in hertz. default is 440.
// Volume of the tone. Default is 1, off is 0.
// Type of tone. Possible values are sine, square, sawtooth, triangle, and custom. Default is sine.
// Callback to use on end of tone.
export function beep(duration, frequency, volume, type, callback) {
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (volume){gainNode.gain.value = volume;}
    if (frequency){oscillator.frequency.value = frequency;}
    if (type){oscillator.type = type;}
    if (callback){oscillator.onended = callback;}

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + ((duration || 500) / 1000));
};
