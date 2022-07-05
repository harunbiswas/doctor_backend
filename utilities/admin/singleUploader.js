const multer = require("multer");
const path = require("path");
const createError = require("http-errors");

// single file uploader
function singleUploader(subfolderName, allowedFileType, maxFIleSize, errorMsg) {
  const UPLOADSFOLDER = `${__dirname}/../../public/images/${subfolderName}/`;

  //difine the storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOADSFOLDER);
    },
    filename: (req, file, cb) => {
      const fileEXT = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileEXT, "")
          .toLocaleLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now() +
        fileEXT;
      cb(null, fileName);
    },
  });

  // preapre the final multer upload object
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: maxFIleSize,
    },
    fileFilter: (req, file, cb) => {
      if (allowedFileType.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(createError(errorMsg));
      }
    },
  });
  return upload;
}

module.exports = singleUploader;
