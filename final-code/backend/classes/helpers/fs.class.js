const FS = require("fs");

module.exports = class FSHelper {

/**
 * Static Method to get the file stats
 * 
 * @static
 * @param {*} path
 * @return {*} 
 */
static getFileStat(path) {
    return new Promise((resolve) => {
      FS.stat(path, function (err, stat) {
        if (err) {
          console.error("FAILED ERROR", err);
          resolve(new Error(err));
        } else {
          resolve(stat);
        }
      });
    });
  }
/**
 *
 * Static method to delete the file
 * @static
 * @param {*} filePath
 * @return {*} 
 */
static deleteFile(filePath) {
    return new Promise((resolve) => {
      FS.unlink(filePath, (err, data) => {
        if (err) {
          console.error("Unable to delete file", err);
          resolve(err);
        } else resolve(data);
      });
    });
  }
};
