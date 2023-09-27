
export class TableChips {

  constructor() {

    addEventListener("test-chips", (e) => {
      console.log('TEST NAME ', e.detail.name)
      console.log('TEST QVOTA ', e.detail.tableEvents.q)
      console.log('TEST BET', e.detail.tableEvents.chips)


    })

  }

  addChip () {
    
  }
}