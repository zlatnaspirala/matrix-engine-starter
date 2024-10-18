import { VoiceCommander } from 'voice-commander';

const grammars = ["spin", "play"];
const options = {
  grammarData: grammars,
  callback: (r) => {
    if (r == 'spin' || r =='play') {
      
    }
    console.log(r);
  }
}

export const VoiceCommanderInstance = new VoiceCommander(options);
window.VoiceCommanderInstance = VoiceCommanderInstance;
console.log(VoiceCommanderInstance);


/**
 * @description Voice command procedures.
 * Will be bind direct on object.
 */

VoiceCommanderInstance.setInteraction = function(newInterAct) {
  VoiceCommanderInstance.callback = newInterAct;
};

VoiceCommanderInstance.whatisyourname = (r) => {
  console.warn("Tell me your nickname.")
  VoiceCommanderInstance.setInteraction(options.callback);
  setTimeout( () => {
    VoiceCommanderInstance.run();
  }, 1000)
};
