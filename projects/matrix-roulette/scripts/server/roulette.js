
/**
 * @description
 * MatrixNet - Main networking class
 * for matrix-engine workplace.
 * First time broadcaster will used for external module.
 * MatrixRouletteServer.init(broadcaster)
 * Most simply way to inject intro...
 */
import { Broadcaster } from "matrix-network";
import ServerConfig from "./server-config.js";
import {MatrixRouletteServer} from "./core/roulette-server.js";

const serverConfig = new ServerConfig();
var broadcaster = new Broadcaster(serverConfig);

var Reset = '\x1b[0m';
console.log('\x1b[42m', 'Matrix Server running... 🤘 [Enjoy]', Reset);

console.log('\x1b[42m', '------------------------------------------------ ', Reset);
console.log('\x1b[42m', 'Matrix Roulette Server core running... ', Reset);
console.log('\x1b[42m', `Implementation with broadcaster ... ${broadcaster} `, Reset);
MatrixRouletteServer.init(broadcaster)
console.log('\x1b[42m', '------------------------------------------------ ', Reset);
