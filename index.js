const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Sse = require("json-sse");

const room = require("./gameroom/model");
const User = require("./user/model");

const roomFactory = require("./gameroom/router");
const userFactory = require("./user/router");

const app = express();

const port = process.env.PORT || 4000;

//const db = require("./db_user");

const auth = require("./auth/router");

const jsonParser = bodyParser.json();
app.use(jsonParser);

const corsMiddleware = cors();
app.use(corsMiddleware);

const stream = new Sse();

const roomRouter = roomFactory(stream);
app.use(roomRouter);

const userRouter = userFactory(stream);
app.use(userRouter);

app.get("/", (req, res) => {
  stream.send("test");
  res.send("hello");
});

app.get("/stream", async (req, res, next) => {
  try {
    const gamerooms = await room.findAll({ include: [User] });

    const action = {
      type: "ALL_GAMEROOMS",
      payload: gamerooms
    };
    const string = JSON.stringify(action);

    stream.updateInit(string);
    stream.init(req, res);
  } catch (error) {
    next(error);
  }
});

//app.use(auth);

app.listen(port, () => console.log(`listening on ${port}`));
