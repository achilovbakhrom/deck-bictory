const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;

const verifyToken = (req, res, next) => {
  console.log("cookes", req.cookies)

  let token = req.cookies.jwt;
  
  console.log("token jwt", token)
  if (!token) {
    console.log("in check token")
    res.writeHead(301, {Location: "/auth"}).end();    
  }

  jwt.verify(token, "super-secret", (err, decoded) => {
    console.log("error jwt", err)
    if (err) {
      console.log("in check error")
      res.writeHead(301, {Location: "/auth"}).end();      
    }
    console.log("in check bef")
    req.userId = decoded.id;
    console.log("in check after")
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }
      res.writeHead(301, {Location: "/auth"}).end();      
      return;
    });
  });
};



const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,  
};
module.exports = authJwt;