const { Router } = require("express");
const { toJWT, toData } = require("./jwt");
const User = require("../user/model");
const bcrypt = require("bcrypt");
const router = new Router();
const auth = require("./middleware");

// define endpoints here
router.post("/login", (request, response, next) => {
  const email = request.body.email;
  const password = request.body.password;

  if (!email || !password) {
    response.status(400).send({
      message: "Please supply a valid email and password"
    });
  } else {
    // 1. find user based on email address
    User.findOne({
      where: {
        email: request.body.email
      }
    })
      .then(entity => {
        if (!entity) {
          response.status(400).send({
            message: "User with that email does not exist"
          });
        }

        // 2. use bcrypt.compareSync to check the password against the stored hash
        else if (bcrypt.compareSync(request.body.password, entity.password)) {
          // 3. if the password is correct, return a JWT with the userId of the user (user.id)
          response.send({
            jwt: toJWT({ userId: entity.id })
          });
        } else {
          response.status(400).send({
            message: "Password was incorrect"
          });
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send({
          message: "Something went wrong"
        });
      });
  }
});

router.get("/secret-endpoint", (req, res) => {
  const auth =
    request.headers.authorization && request.headers.authorization.split(" ");
  if (auth && auth[0] === "Bearer" && auth[1]) {
    try {
      const data = toData(auth[1]);
      response.send({
        message: "Thanks for visiting the secret endpoint.",
        data
      });
    } catch (error) {
      response.status(400).send({
        message: `Error ${error.name}: ${error.message}`
      });
    }
  } else {
    response.status(401).send({
      message: "Please supply some valid credentials"
    });
  }
});

router.get("/secret-endpoint", auth, (req, res) => {
  res.send({
    message: `Thanks for visiting the secret endpoint ${req.user.email}.`
  });
});

module.exports = router;
