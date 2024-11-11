/**
 * @description
 * Make javascript audio resources objects data,
 * This is dev tools. Dont't use it in prodc.
 * @Developer Nikola Lukic
 * @email zlatnaspirala@gmail.com
 */
import fs from "fs";

var FILE_STRING = "";
var SUM_OF_AUDIOS = 0;
console.log('\x1b[36m%s\x1b[0m', "......................................");
console.log('\x1b[36m%s\x1b[0m', ".                                    .");
console.log('\x1b[36m%s\x1b[0m', ". File names reader builder          .");
console.log('\x1b[36m%s\x1b[0m', ". Version 3.0.0                      .");
console.log('\x1b[36m%s\x1b[0m', ". Thanks for using my software! 😘   .");
console.log('\x1b[36m%s\x1b[0m', "......................................");

function GET_FILES_NAME(path) {
	fs.readdir(path, function(err, items) {
		for(var i = 0;i < items.length;i++) {
			var local = items[i];
			local = local.replace(".", "_");

			if(i == 0) {
				FILE_STRING += ' \nvar RESOURCE = {"source":[';
				SUM_OF_AUDIOS++;
			}

			if('resource.audio' != items[i]) {
				FILE_STRING = " " + FILE_STRING + "'" + items[i] + "' , \n";

				if((i + 1) == items.length) {
					FILE_STRING += " ] }; \n";
				}

				if((i + 1) == items.length) {
					// FILE_STRING += "\nAUDIO_RESOURCE.SUM = " + SUM_OF_AUDIOS + "; ";
					CreateFile("./map.js", FILE_STRING);
				}
			}
		}
	});
}

GET_FILES_NAME("./muscular/");

function CreateFile(path_, CONTENT) {
	var Reset = "\x1b[0m";
	fs.writeFile(path_, CONTENT, function(err) {
		if(err) {
			return console.log(err);
		} else {
			console.log("\x1b[42m", "COLLECT list file was created. 🤘 [DONE]", Reset);
		}
	});
}
