
function randomIntFromTo(min, max) {return Math.floor(Math.random() * (max - min + 1) + min);}

// THIS IS BACKEND NODEJS
// It is example who to use matrix-network": "^1.0.12"
// Inject game logic and use broadcaster from webRTC video chat.

// For prod also for localhost must be https - webrtc related

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

          MatrixRouletteServer.broadcaster.mySockets.forEach(sock => {
            sock.emit('STATUS_MR',
              {
                message: 'MEDITATE',
                counter: MatrixRouletteServer.delta
              })
          });

        }
        // console.log("number of players = " + MatrixRouletteServer.broadcaster.RTCMultiConnectionServer)

      } else if(MatrixRouletteServer.delta >= 20 && MatrixRouletteServer.delta < 30) {

        MatrixRouletteServer.broadcaster.mySockets.forEach(sock => {
          sock.emit('STATUS_MR',
            {
              message: 'WAIT_FOR_RESULT',
              counter: MatrixRouletteServer.delta
            })
        });

        
      } else if(MatrixRouletteServer.delta == 30) {
        var R = MatrixRouletteServer.giveMeNum();
        console.log('\x1b[12m', `----------------------MATRIX ROULETTE RESULTS-[${R}]-🤘-------------------`, Reset)
        MatrixRouletteServer.broadcaster.mySockets.forEach(sock => {
          sock.emit('STATUS_MR',
            {
              message: 'RESULTS',
              counter: MatrixRouletteServer.delta,
              deltaIsZero: true,
              winNumber: R
            })
        });
        MatrixRouletteServer.delta = 0;
      } else {
        console.log('........')
      }
      MatrixRouletteServer.delta++;
    }, MatrixRouletteServer.interval)

  },
  giveMeNum: () => randomIntFromTo(0, 36)
};
