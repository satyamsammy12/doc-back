const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(200).json({ message: "Auth Failed", success: false });
      } else {
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};

module.exports = protect;
