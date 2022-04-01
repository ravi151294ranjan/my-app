const SUPERAGENT = require("superagent");

module.exports = class APIHelper {
  /**
   * Static Method to get the file stats
   *
   * @static
   * @param {*} path
   * @return {*}
   */
  static postData(apiPath, postData, headers={}) {
    let response = {status: "success"};
    return new Promise((resolve) => {
      SUPERAGENT
        .post(apiPath)
        .send(postData)
        .set(headers)
        .set("accept", "json")
        .end((err, res) => {
          if(err) {
            response["status"] = "error";
            response["error"] = err.toString();
          } else {
            response["data"] = res["body"];
          }
          resolve(response)
        });
    });
  }
  
};
