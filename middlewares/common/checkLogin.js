const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const checkLogin = async (req, res, next) => {
  const { token } = req.headers;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECTET);
      req.user = decoded;
      next();
    } catch (err) {
      console.log(err);
      res.status(400).json({
        common: {
          msg: "Authentication failure!",
        },
      });
    }
  } else {
    res.status(400).json({
      common: {
        msg: "Authentication failured!",
      },
    });
  }
};

module.exports = { checkLogin };
