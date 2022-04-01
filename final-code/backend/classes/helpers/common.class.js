const CONVERTING_FACTOR = require("./../../config/aws.constants").DIGITAL_STORAGE_CONVERSTION_FACTOR;

module.exports = class CommonHelper {
  /**
   * Static Method to convert Bytes to Higher Readable bytes units
   *
   * @param {*} fileSizeinBytes
   * @return {*}
   */
  
  static convertBytesToHigher(fileSizeinBytes) {
    
    let KB = (fileSizeinBytes / CONVERTING_FACTOR).toFixed(2);
    let MB = (KB / CONVERTING_FACTOR).toFixed(2);
    let GB = (MB / CONVERTING_FACTOR).toFixed(2);
    let TB = (GB / CONVERTING_FACTOR).toFixed(2);
    if (KB < CONVERTING_FACTOR) return `${KB} KB`;
    if (MB < CONVERTING_FACTOR) return `${MB} MB`;
    if (GB < CONVERTING_FACTOR) return `${GB} GB`;
    if (TB < CONVERTING_FACTOR) return `${TB} TB`;

  }

  /**
   * Static Method to convert milliseconds to higher readable units
   *
   * @param {*} milliSeconds
   * @return {*}
   */
  static convertMilliSecondsToHigher(milliSeconds) {
  
    let Sec = Math.round(milliSeconds / 1000);
    let Min = Math.round(Sec / 60);
    let Hour = Math.round(Min / 60);
    let Day = Math.round(Hour / 24);
    if (Sec < 60) return `${Sec} Sec${Sec > 1 ? "s" : ""}`;
    if (Min < 60) return `${Min} Min${Min > 1 ? "s" : ""}`;
    if (Hour < 24) return `${Hour} Hr${Hour > 1 ? "s" : ""}`;
    else return `${Day} Day${Day > 1 ? "s" : ""}`;

  }
};
