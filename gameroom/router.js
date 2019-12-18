const { Router } = require("express");
const Room = require("./model");
const User = require("../user/model");

function factory(stream) {
  const router = new Router();

  //nuevo, para unirse a un room
  router.put("/join", async (req, res, next) => {
    try {
      const user = await User.update(
        {
          roomId: req.body.roomId
        },
        { where: { id: req.body.userId } }
      );

      const gamerooms = await Room.findAll({
        include: [User]
      });

      const action = {
        type: "ALL_GAMEROOMS",
        payload: gamerooms
      };

      const string = JSON.stringify(action);

      stream.send(string);

      response.send(user);
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
}

module.exports = factory;
