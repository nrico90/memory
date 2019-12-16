const express = require("express");
const { Router } = require("express");
const router = new Router();
const User = require("./model");
const bcrypt = require("bcrypt");

router.get("/users", (request, response, next) => {
  User.findAll()
    .then(users => {
      response.status(200).send(users);
    })
    .catch(next);
});

router.post("/user", (request, response, next) => {
  const user = {
    email: request.body.email,
    password: bcrypt.hashSync(request.body.password, 10)
  };
  User.create(user)
    .then(user => response.send(user))
    .catch(errors => next(errors));
});

module.exports = router;
