const jwt = require("jsonwebtoken");

const tokenVerification = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) return res.status(403).json("token is required");
  const bearer = bearerHeader.split(" ");
  const token = bearer[1];
  const user = await validateToken(token);
  if (!user) return res.status(403).json("invalid token");
  req.body.user = user;
  next();
};

const validateToken = (token) => {
  return new Promise((resolve) =>
    jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, encoded) => {
      if (err) return resolve(false);
      return resolve(encoded);
    })
  );
};

module.exports = tokenVerification;
