// add Depertment
const addDepertment = async function (req, res, next) {
  if (req.user && req.user.role === "clinic") {
    res.status(200).json(req.user);
  } else {
    res.status(400).json("Only clinic can add depertment");
  }
};

module.exports = { addDepertment };
