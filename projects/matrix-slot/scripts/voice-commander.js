import { VoiceCommander, colorNamesGrammars } from 'voice-commander';

const options = {
  grammarData: colorNamesGrammars,
  callback: (r) => {
    if (r == 'spin') {
      App.slot.mashine.activateSpinning();
    }
    console.log(r);
  }
}

export const VoiceCommanderInstance = new VoiceCommander(options);

console.log(VoiceCommanderInstance);