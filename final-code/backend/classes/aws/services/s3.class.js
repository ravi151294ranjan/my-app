/**
 * Class S3 to wrap up s3 functionalities
 * @class S3
 * @see {@link User}
 */

const AWS = require("./../aws.class");
const FS = require("fs");
const COMMONHELPER = require("./../../helpers/common.class");
const FSHELPER = require("./../../helpers/fs.class");
const APIHelper = require("./../../helpers/superagent.class");
module.exports = class S3 extends AWS {
  /**
   * Creates an instance of S3.
   */
  constructor() {
    super();
    this.S3 = new this.AWS.S3({
      apiVersion: this.AWS_CONSTANTS.S3_API_VERSION,
      accessKeyId: this.AWS_CONSTANTS.AWS_ACCESS_KEY_ID,
      secretAccessKey: this.AWS_CONSTANTS.AWS_SECRET_KEY,
      region: this.AWS_CONSTANTS.S3_BUCKET_REGION,
    });
    this.startTime = new Date().getTime();
    this.convertingFactor =
      this.AWS_CONSTANTS.DIGITAL_STORAGE_CONVERSTION_FACTOR;
    this.minimumPartSize = this.AWS_CONSTANTS.S3_MIN_PART_FILESIZE_IN_MB;
  }
  /**
   * * In Deletion method we delete the user details in user & groupinfo colletion based on userid.<br>
   * * After that we  decreased user count in Super Admin Collection based on that Tenant.
   * @param  {string} collectionName Its show the collection name.
   * @param  {Object} data Its contain user data to delete based on tenantname.
   */
  async uploadVideo(videoPath, videoRecordId) {
    let response = { status: "success" };
    try {
      let fileStats = await FSHELPER.getFileStat(videoPath);
      let videoFilePathArray = videoPath.split("/");
      let videoFileName = videoFilePathArray[videoFilePathArray.length - 1];
      this.fileSize = fileStats.size;
      this.serviceResponse = {};
      this.UploadId = "";
      this.splitEtags = [];
      this.videoRecordId = videoRecordId;
      this.params = {
        Bucket: this.AWS_CONSTANTS.S3_BUCKET_NAME,
        Key: `${this.AWS_CONSTANTS.S3_VIDEO_KEY}/${videoFileName}`,
        ACL: this.AWS_CONSTANTS.S3_BUCKET_ACL,
        ContentType: this.AWS_CONSTANTS.S3_VIDEO_CONTENT_TYPE,
        StorageClass: this.AWS_CONSTANTS.S3_STORAGE_CLASS,
      };
      this.videoUploadedPath = `${this.AWS_CONSTANTS.S3_UPLOADED_VIDEO_URL}/${videoFileName}`;
      // step 1 - create Multipart Upload
      //-----------------------------------------
      this.serviceResponse = await this.invokeAWSService(
        this.S3,
        "createMultipartUpload",
        this.params
      );
      this.UploadId = this.serviceResponse["data"]["UploadId"];
      if (this.serviceResponse["status"] === "failure")
        throw new Error(this.serviceResponse["error"]);
      this.partNum = 0;
      this.partSize = 0;
      let reader = FS.createReadStream(videoPath, {
        highWaterMark: this.assignVideoSplitSize(this.fileSize),
      });

      for await (const chunk of reader) {
        this.partNum = this.partNum + 1;
        let videoFileBuffer = chunk;
        this.partSize = videoFileBuffer.toString().length + this.partSize;
        // step 2 - create uploadPart
        //-----------------------------------------
        this.params = {
          Bucket: this.params["Bucket"],
          Key: this.params["Key"],
          UploadId: this.UploadId,
        };

        this.params["PartNumber"] = String(this.partNum);
        this.params["Body"] = videoFileBuffer;
        this.serviceResponse = await this.invokeAWSService(
          this.S3,
          "uploadPart",
          this.params
        );

        if (this.serviceResponse["status"] === "failure")
          throw new Error(this.serviceResponse["error"]);

        let splitObj = {};
        splitObj["PartNumber"] = String(this.partNum);
        splitObj["ETag"] = this.serviceResponse["data"]["ETag"];
        this.splitEtags.push(splitObj);
        this.uploadProgress();
      }

      // step 3 - completeMultipartUpload
      //-----------------------------------------
      this.params = {
        Bucket: this.params["Bucket"],
        Key: this.params["Key"],
        MultipartUpload: {
          Parts: this.splitEtags,
        },
        UploadId: this.params["UploadId"],
      };

      this.serviceResponse = await this.invokeAWSService(
        this.S3,
        "completeMultipartUpload",
        this.params
      );

      if (this.serviceResponse["status"] === "failure")
        throw new Error(this.serviceResponse["error"]);

      this.endTime = new Date().getTime();

      response["body"] = {
        uploadedVideoURL: this.videoUploadedPath,
        timeTaken: `${COMMONHELPER.convertMilliSecondsToHigher(
          this.endTime - this.startTime
        )}`,
        filesizeUploaded: COMMONHELPER.convertBytesToHigher(this.fileSize),
      };

      this.partSize = this.fileSize;
      this.uploadProgress();
      return response;
    } catch (err) {
      console.error(err);
      response["status"] = "failure";
      response["body"] = err.toString();
      return response;
    }
  }

  /**
   * Method to display upload progress
   *
   * @param {*} progressData
   */
  async uploadProgress() {
    let progressPercent = Math.round((this.partSize / this.fileSize) * 100);
    this.endTime = new Date().getTime();
    let elapsedTime = COMMONHELPER.convertMilliSecondsToHigher(
      this.endTime - this.startTime
    );

    // post the status of data
    let videoUploadMeta = {};
    videoUploadMeta["fileSize"] = COMMONHELPER.convertBytesToHigher(
      this.fileSize
    );
    videoUploadMeta["uploadedSize"] = COMMONHELPER.convertBytesToHigher(
      this.partSize
    );
    videoUploadMeta["elapsedTime"] = elapsedTime;
    videoUploadMeta["totalProgress"] = progressPercent;

    let videoRecordData = {
      id: this.videoRecordId,
      uploadMeta: videoUploadMeta,
      path:this.videoUploadedPath
    };

    let apiResponse = await APIHelper.postData(
      this.AWS_CONSTANTS.S3_UPLOAD_VIDEO_PROGRESS_CALLBACK,
      videoRecordData,
      {}
    );
    if (apiResponse["status"] === "error") {
      console.error(apiResponse["error"]);
    }

    process.stdout.write(
      `Uploaded ${COMMONHELPER.convertBytesToHigher(
        this.partSize
      )} of ${COMMONHELPER.convertBytesToHigher(
        this.fileSize
      )} (${progressPercent}%) in ${elapsedTime}\r`
    );
  }

  /**
   * Method to assign the video split size
   *
   * @param {*} fileSizeinBytes
   * @return {*}
   */
  assignVideoSplitSize(fileSizeinBytes) {
    let chunkSizeInByes =
      this.minimumPartSize * this.convertingFactor * this.convertingFactor;
    if (
      Math.round(
        fileSizeinBytes / this.convertingFactor / this.convertingFactor
      ) <= 500
    )
      return chunkSizeInByes;
    else return Math.round((fileSizeinBytes * 1) / 100);
  }

  /**
   * Method to delete the video from S3
   *
   * @param {*} videoFileName
   * @return {*}
   */
  async deleteVideo(videoFileName) {
    let response = { status: "success" };
    try {
      this.params = {
        Bucket: this.AWS_CONSTANTS.S3_BUCKET_NAME,
        Key: `${this.AWS_CONSTANTS.S3_VIDEO_KEY}/${videoFileName}`,
      };

      this.serviceResponse = await this.invokeAWSService(
        this.S3,
        "deleteObject",
        this.params
      );

      if (this.serviceResponse["status"] === "failure")
        throw new Error(this.serviceResponse["error"]);
      response["body"] = { data: "deleted successfully" };
      return response;
    } catch (err) {
      console.error(err);
      response["status"] = "failure";
      response["body"] = err.toString();
      return response;
    }
  }
};
