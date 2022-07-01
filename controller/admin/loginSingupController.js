// singup Controller
function singupController(req, res, next) {
  res.status(200);
  res.json(req.body);
}

module.exports = { singupController };
