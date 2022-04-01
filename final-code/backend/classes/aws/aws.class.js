const CONSTANTS = require("./../../config/aws.constants");

module.exports = class AWS {

  /**
   * Creates an instance of AWS.
   */
  constructor() {
    this.AWS_CONSTANTS = CONSTANTS;
    this.AWS = require('aws-sdk');
  }

  /**
   * Method to invoke AWS service
   *
   * @param {*} serviceObj
   * @param {*} serviceName
   * @param {*} serviceParams
   * @return {*}
   */
  invokeAWSService(serviceObj, serviceName, serviceParams) {
    let response = { status: "success" };
    return new Promise((resolve) => {
        serviceObj[serviceName](serviceParams, function (err, data) {
        if (err) {
          console.log("SERVICE==>", serviceName, err.stack); // an error occurred
          response["status"] = "failure";
          response["error"] = err;
        } else response["data"] = data;
        resolve(response);
      });
    });
  }
};
