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
      res.status(400).json({
        image: {
          msg: err.message,
        },
      });
    } else {
      const base = req.protocol;
      req.files[0].path = `${base}://${req.headers.host}/images/photo/${req.files[0].filename}`;
      next();
    }
  });
}

module.exports = fileUpload;
