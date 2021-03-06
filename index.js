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

const corsMiddleware = cors();
app.use(corsMiddleware);

const jsonParser = bodyParser.json();
app.use(jsonParser);

const stream = new Sse();

const roomRouter = roomFactory(stream);
app.use(roomRouter);

const userRouter = userFactory(stream);
app.use(userRouter);
app.use(auth);

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

//GameMemory
app.get("/number", (req, res) => {
  let mode = req.query.mode;
  let numbers = [];
  while (numbers.length < Number(mode)) {
    var number = Math.floor(Math.random() * 100) + 1;
    if (numbers.indexOf(number) === -1) numbers.push(number);
  }
  res.send({ randomArray: numbers });
});

app.listen(port, () => console.log(`listening on ${port}`));
