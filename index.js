const express = require("express");

const app = express();
const port = process.env.PORT || 4000;
const db = require("./db_user");

const cors = require("cors");
const bodyParser = require("body-parser");
const Sse = require("json-sse");
const auth = require("./auth/router");
const userRouter = require("./user/router");
const roomFactory = require("./gameroom/router");

const stream = new Sse();
const roomRouter = roomFactory(stream);

const corsMiddleware = cors();
app.use(corsMiddleware);

const parserMiddleware = bodyParser.json();
app.use(parserMiddleware);

app.use(roomRouter);

app.get("/", (req, res) => {
  stream.send("test");
  res.send("hello");
});

app.get("/stream", (req, res) => {
  stream.init(req, res);
});

app.use(auth);
app.use(userRouter);

app.listen(port, () => console.log(`listening on ${port}`));
