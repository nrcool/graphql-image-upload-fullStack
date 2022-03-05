const AWS = require("aws-sdk");
// store each image in it's own unique folder to avoid name duplicates
const { v4 } = require("uuid");
// load config data from .env file
require("dotenv").config();
// update AWS config env data
/* AWS.config.update({
  
  region: process.env.AWS_REGION,
}); */
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
  s3ForcePathStyle: true,
});



// the actual upload happens here
const handleFileUploadS3 = async (file) => {
  const { createReadStream, filename,mimetype } = await file;

  const key = v4();
  
// I have a max upload size of 1 MB
  return new Promise((resolve, reject) => {
    s3.upload(
      {
        Bucket: process.env.S3_BUCKET_NAME,
        Body: createReadStream(),
        Key: `${key}_${filename}`,
        ContentType:mimetype ,
      },
      (err, data) => {
        if (err) {
          console.log("error uploading...", err);
          reject(err);
        } else {
          console.log("successfully uploaded file...", data);
          resolve({ filename, imageUrl: data.Location });
        }
      }
    );
  });
};

module.exports = handleFileUploadS3;
