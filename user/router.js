//const express = require("express");
const { Router } = require("express");
const bcrypt = require("bcrypt");
const User = require("./model");

function factory(stream) {
  const router = new Router();

  router.get("/users", (request, response, next) => {
    User.findAll()
      .then(users => {
        response.status(200).send(users);
      })
      .catch(next);
  });

  router.post("/user", async (request, response, next) => {
    try {
      const found = await User.findOne({
        where: { email: request.body.email }
      });
      if (found) {
        response.status(400).send({ message: "email has already been used" });
      } else {
        const user = {
          email: request.body.email,
          password: bcrypt.hashSync(request.body.password, 10)
        };
        User.create(user).then(user => {
          const jwt = toJWT({ userId: user.id });
          response.json({ jwt, email: user.email });
        });
      }
    } catch (error) {
      next(error);
    }
  });
}

module.exports = factory;