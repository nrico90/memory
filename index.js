const express = require("express");

const app = express();
const port = process.env.PORT || 4000;
const db = require("./dbUser");

const cors = require("cors");
const bodyParser = require("body-parser");
const auth = require("./auth/router");
const userRouter = require("./user/router");

const corsMiddleware = cors();
app.use(corsMiddleware);

const parserMiddleware = bodyParser.json();
app.use(parserMiddleware);

app.use(auth);
app.use(userRouter);

app.listen(port, () => console.log(`listening on ${port}`));
