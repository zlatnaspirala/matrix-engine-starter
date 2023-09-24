import { VoiceCommander } from 'voice-commander';

const grammars = ["spin", "play"];
const options = {
  grammarData: grammars,
  callback: (r) => {
    if (r == 'spin' || r =='play') {
      App.slot.mashine.activateSpinning();
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
  // global for now
  App.slot.user = r;
  App.slot.mashine.nidza.access.footerLabel.elements[0].text = "You are welcome Mr/Mrs. " + r + ". Voice command: spin or play ";
  console.warn("Tell me your nickname.")
  VoiceCommanderInstance.setInteraction(options.callback);
  setTimeout( () => {
    VoiceCommanderInstance.run();
  }, 1000)
};
