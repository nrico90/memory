const { Router } = require("express");
const Room = require("./model");

function factory(stream) {
  const router = new Router();

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
