var express = require('express');
var router = express.Router();
const db = require("../models");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
const homeEmail = db.homeEmail;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { authJwt } = require("../middlewares");
const role = require('../models/role');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.writeHead(301, { Location: '/auth' }).end();
});

router.get('/auth', function(req, res, next) {
  res.clearCookie('jwt');
  res.render('login');
});

router.post("/auth", function(req, res, next) {
  
  const {username, password} = req.body

  console.log("password", username, password)
  
  User.findOne({
    where: { username }
  })
    .then(user => {
      
      if (!user || !user.isActive) {
        return res.writeHead(301, {Location: "/auth"}).end();
      }

      var passwordIsValid = bcrypt.compareSync(
        password,
        user.password
      );

      if (!passwordIsValid) {
        return res.writeHead(301, {Location: "/auth"}).end();
      }

      var token = jwt.sign({ id: user.id }, "super-secret", {
        expiresIn: 86400 // 24 hours
      });

      user.getRoles().then(roles => {
        console.log("roles", JSON.stringify(roles))
        const isAdmin = Boolean((roles || []).find(r => r.name === "admin"));
        if (isAdmin) {
          res.cookie('jwt', token, { maxAge: 60*60*24*7, httpOnly: true }); // one week
          res.writeHead(301, { Location: '/admin-users' }).end();  
          return;
        }
        const isUser = Boolean((roles || []).find(r => r.name === "user"));
        if (isUser) {
          res.cookie('jwt', token, { maxAge: 60*60*24*7, httpOnly: true }); // one week
          res.writeHead(301, { Location: '/main' }).end();
          return  
        } else {
          res.writeHead(301, { Location: '/auth' }).end();
        }
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
});

router.put("/block-user", [authJwt.verifyToken, authJwt.isAdmin], function(req, res, next){
  const userId = req.body.userId;
  console.log("userId", userId)
  if (!userId) {
    res.status(400).send("Please provider user Id");
  }
  // res.status(200).send("test")
  User.findByPk(Number(userId)).then(user => {
    // console.log("user", user)
    user.update({ isActive: false }).then(user => {
      console.log("loglog", user)
      res.status(200).send(user)
    }).catch(error => {
      res.render("error", error)
      console.log(error)
    })    
  }).catch(error => {
    console.log("error", error)
    res.render("error", error)
  })  
});

router.put("/unblock-user", [authJwt.verifyToken, authJwt.isAdmin], function(req, res, next){
  const userId = req.body.userId;
  console.log("userId", userId)
  if (!userId) {
    res.status(400).send("Please provider user Id");
  }
  // res.status(200).send("test")
  User.findByPk(Number(userId)).then(user => {
    // console.log("user", user)
    user.update({ isActive: true }).then(user => {
      console.log("loglog", user)
      res.status(200).send(user)
    }).catch(error => {
      res.render("error", error)
      console.log(error)
    })    
  }).catch(error => {
    console.log("error", error)
    res.render("error", error)
  })  
});

router.post("/signup", function(req, res, next) {
  User.create({
    username: req.body.username,    
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          console.log("rrr", roles)
          // if ((roles || []).find(r => r.name === "admin")) {
          //   user.update({ isActive: true })            
          // }
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
});

router.post("/home-email", function(req, res, next) {
  homeEmail.create({
    email: req.body.email,
    value: '',
  })
    .then(() => {
      res.send({ message: "Subscribed Successfully"});
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    })
})

router.get("/home-email", function(req, res, next) {
  let page = req.query ? req.query.page || 0 : 0;
  let size = req.query ? req.query.size || 2000 : 2000;

  db.homeEmail.findAndCountAll({
    offset: page,
    limit: size
  }).then(data => {
    res.send(data);
  })
})

router.get("/main", [authJwt.verifyToken], function(req, res, next) {
  res.render('main');
});

// router.get("/main", function(req, res, next) {
//   res.render('main');
// });


router.get("/submit-form", [authJwt.verifyToken], function(req, res, next) {
  console.log("submit ofrm")
  Promise.all([db.nationality.findAll(), db.currency.findAll()])
    .then(([natList, currList]) => {
      console.log("submit nim", natList.length, currList.length)
      res.render('submit-form', {
        nationalities: natList.map(n => ({id: n.id, name: n.name})) || [],
        currencies: currList.map(n => ({id: n.id, name: n.name})) || [],
      });
    })
});


router.post("/submit-form", [authJwt.verifyToken], function(req, res, next) {    
  console.log("email", req.body.email)
  db.message.create({    
    userId: req.userId,
    fullname: req.body.fullname,
    company_name: req.body.company_name,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    nationalityId: req.body.nationality,
    currencyId: req.body.currency,
    amount: req.body.value,
  }).then(() => {
    res.render('submit-success')
  }).catch((err) => {
    console.log("err", err)
    res.writeHead(301, { Location: '/submit-form' }).end();    
  });
});


router.get("/admin-users", [authJwt.verifyToken, authJwt.isAdmin], function(req, res, next) {
  let page = req.query ? req.query.page || 0 : 0;
  let size = req.query ? req.query.size || 2000 : 2000;

  User.findAndCountAll({
    offset: page,
    limit: size,
    include: [db.message],
  }).then(dto => {
    console.log("dto", dto.rows)
    dto.rows.forEach(r => console.log(r.messages.length))
    res.render("admin-users", {userDto: dto});
  })
  .catch(error => {
    console.log("error", error)
    res.render("error", error)
  });
});

router.get("/messages/:userId", [authJwt.verifyToken, authJwt.isAdmin], function(req, res, next) {
  let userId = req.params.userId
  db.message.findAll({
    where: { userId },
    include: [db.nationality, db.currency],
  }).then(messages => {
    res.render("messages", { messages }).end()
  })
});

router.post("/create-user", [authJwt.verifyToken, authJwt.isAdmin], function(req, res, next) {
  User.create({
    username: req.body.username,    
    password: bcrypt.hashSync(req.body.password, 8),    
  })
    .then(user => {
      Role.findAll({
        where: {
          name: {
            [Op.or]: ["user"],
          }
        }
      }).then(roles => {
        console.log("rrr", roles)
        user.setRoles(roles).then(() => {
          res.writeHead(301, { Location: '/admin-users' }).end();            
        })  
      });          
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
});
router.post("/delete-user", [authJwt.verifyToken, authJwt.isAdmin], function(req, res, next) {
  User.create({
    username: req.body.username,    
    password: bcrypt.hashSync(req.body.password, 8),    
  })
    .then(user => {
      Role.findAll({
        where: {
          name: {
            [Op.or]: ["user"],
          }
        }
      }).then(roles => {
        console.log("rrr", roles)
        user.setRoles(roles).then(() => {
          res.writeHead(301, { Location: '/admin-users' }).end();            
        })  
      });          
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
});

router.get("/logout", [authJwt.verifyToken], function(req, res, next) {
  res.clearCookie('jwt');
  res.writeHead(301, { Location: '/auth' }).end();  
});



module.exports = router;