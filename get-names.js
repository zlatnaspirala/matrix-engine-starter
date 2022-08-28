
/**
 * @description
 * Make javascript resources objects,
 * This is dev tools. Dont't use it in prodc.
 * @Developer Nikola Lukic
 * @email zlatnaspirala@gmail.com
 */

 var fs = require("fs");
 var path = require('path');
 
 function getDirectories(srcpath) {
   return fs.readdirSync(srcpath).filter(function(file) {
     return fs.statSync(path.join(srcpath, file)).isDirectory();
   });
 }
 
 
 var FILE_STRING = `/** ojsa */\n
                     \n`;
 
 var SUM_OF_IMAGES = 0;
 
 function GET_FILES_NAME(path, n, main_length) {
   fs.readdir(path, function(err, items) {
     for(var i = 0;i < items.length;i++) {
       if(i == 0) {
         SUM_OF_IMAGES++;
         FILE_STRING = " " + FILE_STRING + "var skeletalMap = {";
       }
       var r1 =  items[i].replace(/ /g,"_");
       var r =  r1.replace(/.obj/g,"");
       FILE_STRING = " " + FILE_STRING + r + ":" + "'res/3d-objects/human/skeletal/" + items[i] + "' , \n";
       if((i + 1) == items.length && main_length == false) {
         FILE_STRING += " }; \n";
       }
       if((i + 1) == items.length && main_length == true) {
         FILE_STRING += " };  ";
         CreateFile(  "helper1.js", FILE_STRING);
       }
     }
   });
 }
 
 // console.log(config.PATH_OF_WWW);
 var LIST_OFF_ALL_ANIMATION_DIR = getDirectories("./projects/web-anatomy/res/3d-objects/human/");
 var local__x = -1;
 
 console.log('\x1b[36m%s\x1b[0m', "......................................");
 console.log('\x1b[36m%s\x1b[0m', ".                                    .");
 console.log('\x1b[36m%s\x1b[0m', ". HELPER!                            .");
 console.log('\x1b[36m%s\x1b[0m', ". Version 3.0.0                      .");
 console.log('\x1b[36m%s\x1b[0m', ". Thanks for using my software! 😘   .");
 console.log('\x1b[36m%s\x1b[0m', "......................................");
 
 for(var i in LIST_OFF_ALL_ANIMATION_DIR) {
   local__x++;
   val = LIST_OFF_ALL_ANIMATION_DIR[i];
   console.log('\x1b[33m%s\x1b[0m', "Obj Created :", LIST_OFF_ALL_ANIMATION_DIR[i]);
   if((local__x + 1) == LIST_OFF_ALL_ANIMATION_DIR.length) {
     GET_FILES_NAME( "./projects/web-anatomy/res/3d-objects/human/" + val, val, true);
   } else {
     GET_FILES_NAME(  "./projects/web-anatomy/res/3d-objects/human/" + val, val, false);
   }
 }
 
 CreateFile(  "non-project/resource.list", LIST_OFF_ALL_ANIMATION_DIR);
 
 function CreateFile(path_, CONTENT) {
   fs.writeFile(path_, CONTENT.toString(), function(err) {
     var Reset = "\x1b[0m";
     if(err) {
       return console.log(err);
     } else {
       console.log('\x1b[36m%s\x1b[42m', `${path_}`);
       if (path_.indexOf('resource.list') !== -1) {
         console.log("\x1b[42m", "The resources list file was created. 🤘 [DONE]", Reset );
       } else {
         console.log("\x1b[42m", "The resources file was created. 🤘 [DONE]", Reset);
       }
     }
   });
 }
 