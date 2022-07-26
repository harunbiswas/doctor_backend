const singleUploader = require("../../utilities/admin/singleUploader");

function fileUpload(req, res, next) {
  const upload = singleUploader(
    "photo",
    ["image/jpeg", "image/jpg", "image/png"],
    1000000,
    "Only .jpg, jpeg or .png and max 1 mb file allowed!"
  );
  upload.any()(req, res, (err) => {
    if (err) {
      res.status(500).json({
        image: {
          msg: err.message,
        },
      });
    } else {
      next();
    }
  });
}

module.exports = fileUpload;
