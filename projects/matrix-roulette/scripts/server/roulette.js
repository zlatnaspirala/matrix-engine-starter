
/**
 * @description
 * MatrixNet - Main networking class
 * for matrix-engine workplace.
 */
import { Broadcaster } from "matrix-network";
import ServerConfig from "./server-config.js";

const serverConfig = new ServerConfig();
var broadcaster = new Broadcaster(serverConfig);

var Reset = '\x1b[0m';
console.log('\x1b[42m', 'Matrix Server running... 🤘 [Enjoy]', Reset);
