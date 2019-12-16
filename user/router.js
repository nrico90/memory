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

router.post("/user", async (request, response, next) => {
  try {
    const found = await User.findOne({ where: { email: request.body.email } })
    if(found){
      response.status(400).send({message: 'email has already been used'})
    } else {
      const user = {
        email: request.body.email,
        password: bcrypt.hashSync(request.body.password, 10)
      };
      const created = await User.create(user)
      response.send(created)
    }
  } catch (error) {
    next(error)
  }
});

module.exports = router;
