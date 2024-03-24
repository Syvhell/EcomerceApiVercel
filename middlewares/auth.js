// [SECTION] JSON Web Token
const jwt = require("jsonwebtoken");

// [SECTION] Secret Keyword
const secret = "PitStopAPI";

// [SECTION] Token Creation
module.exports.createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
  };
  return jwt.sign(data, secret, {});
};

// [SECTION] Token Verification
module.exports.verify = (req, res, next) => {
  console.log(req.headers.authorization);
  let token = req.headers.authorization;

  if (typeof token == "undefined") {
    return res.send({ auth: "Failed. No Token!" });
  } else {
    token = token.slice(7, token.length);
    console.log(token);

    jwt.verify(token, secret, function (err, decodedToken) {
      if (err) {
        return res.send({
          auth: "Failed",
          message: err.message,
        });
      } else {
        console.log(decodedToken);
        req.user = decodedToken;
        next();
      }
    });
  }
};
// [SECTION] Token Verification if Admin
module.exports.verifyAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    return res.send({
      auth: "Failed",
      message: "Action Forbidden!",
    });
  }
};
