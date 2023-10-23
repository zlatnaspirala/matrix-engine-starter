
function randomIntFromTo(min, max) {return Math.floor(Math.random() * (max - min + 1) + min);}

// THIS IS BACKEND NODEJS
export var MatrixRouletteServer = {
  interval: 1000,
  coretimer: null,
  allNumbers: [],
  winningNumbers: [],
  delta: 0,
  broadcaster: null,
  init: (broadcaster) => {
    MatrixRouletteServer.broadcaster = broadcaster;
    for(var x = 0;x < 37;x++) {
      MatrixRouletteServer.allNumbers.push(x)
    }
    MatrixRouletteServer.start()
  },
  start: () => {
    var Reset = '\x1b[0m';
    MatrixRouletteServer.coretimer = setInterval(() => {
      if(MatrixRouletteServer.delta < 20) {
        console.log('\x1b[42m', `----------------------MATRIX ROULETTE MEDITATE-[${MatrixRouletteServer.delta}]---------------------`, Reset, Reset)

        if(typeof MatrixRouletteServer.broadcaster.mySockets[0] !== 'undefined') {
          // console.log("Server msg => " + MatrixRouletteServer.broadcaster.mySockets[0].emit('STATUS_MR', { message: 'MEDITATE'} ))
          // for (var key in MatrixRouletteServer.broadcaster.mySockets[0]) {
          //   // console.log( "NET =>>> " + key)
          // }
          MatrixRouletteServer.broadcaster.mySockets[0].emit('STATUS_MR',
            {
              message: 'MEDITATE',
              counter: MatrixRouletteServer.delta
            })
        }
        console.log("number of players = " + MatrixRouletteServer.broadcaster.mySockets.length)
      } else if(MatrixRouletteServer.delta == 20) {
        var R = MatrixRouletteServer.giveMeNum();
        console.log('\x1b[12m', `----------------------MATRIX ROULETTE RESULTS-[${R}]-🤘-------------------`, Reset)
        MatrixRouletteServer.delta = 0;
      } else {
        console.log('RR WAIT FOR RESULTS')
      }
      MatrixRouletteServer.delta++;
    }, MatrixRouletteServer.interval)

  },
  giveMeNum: () => randomIntFromTo(0, 36)
};
