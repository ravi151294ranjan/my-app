
require('dotenv').config();

module.exports.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
module.exports.AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;

module.exports.S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
module.exports.S3_BUCKET_REGION = process.env.S3_BUCKET_REGION;
module.exports.S3_STORAGE_CLASS = process.env.S3_STORAGE_CLASS;
module.exports.S3_API_VERSION = '2006-03-01';
module.exports.S3_BUCKET_ACL = 'public-read';
module.exports.S3_VIDEO_KEY = 'videos';
module.exports.S3_VIDEO_CONTENT_TYPE = 'video/mp4';
module.exports.S3_MIN_PART_FILESIZE_IN_MB = 5; // in MB
module.exports.S3_UPLOADED_VIDEO_URL = `https://${this.S3_BUCKET_NAME}.s3.${this.S3_BUCKET_REGION}.amazonaws.com/${this.S3_VIDEO_KEY}`;
module.exports.S3_UPLOAD_VIDEO_PROGRESS_CALLBACK = `${process.env.baseUrl}admin/shared/update-video-upload-progress`

module.exports.DIGITAL_STORAGE_CONVERSTION_FACTOR = 1024;

