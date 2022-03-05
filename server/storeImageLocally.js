const fs = require("fs");
const { v4 } = require("uuid");

const handleFileUploadLocally = async (file) => {
  const { createReadStream, filename, mimetype } = await file;
  const key=v4()
  return new Promise((resolve, reject) => {
    try {
      const stream = createReadStream();
      const writeStream = fs.createWriteStream(
        `${__dirname}/public/images/${key}_${filename}`
      );
      stream.pipe(writeStream);
      resolve({filename,imageUrl: `${process.env.BASE_URL_SERVER}/images/${key}_${filename}`})
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = handleFileUploadLocally;
