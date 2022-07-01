const createError = require("http-errors");
// 404 not foud handler
function notFoundHandler(req, res, next) {
  next(createError(404, "Your Request content was not found!"));
}

// defauld error handler
function errorHandler(err, req, res, next) {
  res.status(err.status || 500);
  res.json(err);
}

// exports modules

module.exports = {
  notFoundHandler,
  errorHandler,
};
