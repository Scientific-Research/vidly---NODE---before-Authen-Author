const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied.No token provided!");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};

// module.exports = auth; we did this line n line 4 => module.exports = function(....) => we don't need to write the name
// of the function(auth) in fornt of function word!
