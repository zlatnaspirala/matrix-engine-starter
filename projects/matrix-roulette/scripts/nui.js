import {byId} from "matrix-engine/lib/utility";
import {
  indicatorsBlocks,
  canvasEngine,
  interActionController,
  nuiMsgBox
} from "nui-commander";

export default class NUICommander {
  nuiCommander = {};

  actionSetViewWheel() {
    dispatchEvent(new CustomEvent('view-wheel', {detail: {}}))
    console.log('..................view-wheel.........ACr', interActionController)
  }

  actionSetViewTable() {
    dispatchEvent(new CustomEvent('view-table', {detail: {}}))
    console.log('...........................ACr', interActionController)
  }

  setTopPosition() {
    byId('nui-commander-container').style.bottom = 'unset';
    byId('nui-commander-container').style.top = '0';
  }

  setBottomPosition() {
    byId('nui-commander-container').style.top = 'unset';
    byId('nui-commander-container').style.bottom = '0';
  }

  constructor(isManual) {

    console.log('.........................is manual.', isManual)
    this.nuiCommander.drawer = new canvasEngine(interActionController, {domVisual: true});
    this.nuiCommander.drawer.draw();
    this.nuiCommander.indicatorsBlocks = indicatorsBlocks;
    console.log('...........................interActionController', this.nuiCommander.indicatorsBlocks.text)

    if(isManual == true) {
      this.nuiCommander.indicatorsBlocks.text[0] = 'MR MANUAL';
      // this.nuiCommander.indicatorsBlocks.text[1] = 'manual';
    } else {
      this.nuiCommander.indicatorsBlocks.text[0] = 'MR SERVER' ;
      // this.nuiCommander.indicatorsBlocks.text[1] = 'server';
    }

    this.nuiCommander.indicatorsBlocks.text[8] = '';

    this.nuiCommander.indicatorsBlocks.text[1] = '💠table';
    interActionController.main[8].action = this.actionSetViewTable;

    this.nuiCommander.indicatorsBlocks.text[8] = '👆👆';
    interActionController.main[1].action = this.setTopPosition;

    this.nuiCommander.indicatorsBlocks.text[16] = '👇👇';
    interActionController.main[2].action = this.setBottomPosition;

    this.nuiCommander.indicatorsBlocks.text[3] = '🎡wheel';
    interActionController.main[24].action = this.actionSetViewWheel;

    this.nuiCommander.drawer.elements.push(this.nuiCommander.indicatorsBlocks);
    this.nuiCommander.drawer.elements.push(
      new nuiMsgBox("Do you love this project?", (answer) => {
        console.log(answer);
        this.nuiCommander.drawer.removeElementByName("nuiMsgBox");
        if(answer == "yes") {

          byId('nui-commander-container').style.width = '256px';
          console.log("Good answer is yes.");
          setTimeout(() => {
            this.nuiCommander.drawer.elements.push(
              new nuiMsgBox(
                "Do you wanna use NUICommander ?",
                (answer) => {
                  this.nuiCommander.drawer.removeElementByName("nuiMsgBox");
                  if(answer == "yes") {
                    alert("ok , interest idea.");

                  }
                }
              )
            );
          }, 2000);
        } else {
          console.log("Answer is no.");
          // window.location.href = "https://google.com";
        }
      })
    );
    console.info("nui-commander controls attached.");
  }

}