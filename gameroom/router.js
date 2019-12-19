const { Router } = require("express");
const Room = require("./model");
const User = require("../user/model");
const authMiddleware = require("../auth/middleware");

function factory(stream) {
  const router = new Router();

  //nuevo, para unirse a un room
  router.put("/join", authMiddleware, async (req, res, next) => {
    try {
      const { user } = req;
      const updatedUser = await user.update({
        roomId: req.body.room
      });

      const gamerooms = await Room.findAll({
        include: [User]
      });

      const action = {
        type: "ALL_GAMEROOMS",
        payload: gamerooms
      };

      const string = JSON.stringify(action);

      stream.send(string);

      res.send(user);
    } catch (error) {
      next(error);
    }
  });

  router.post("/gameroom", async (request, response, next) => {
    try {
      const room = await Room.create(request.body);
      const action = {
        type: "NEW_GAMEROOM",
        payload: room
      };
      const string = JSON.stringify(action);

      stream.send(string);
      response.send(room);
    } catch (error) {
      next(error);
    }
  });
  return router;
}

module.exports = factory;
