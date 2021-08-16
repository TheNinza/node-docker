const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
} = require("./config/config");

const redis = require("redis");
const session = require("express-session");
let RedisStore = require("connect-redis")(session);

let redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT,
});

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
app.use(express.json());

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose
    .connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("successfully connected");
    })
    .catch((e) => {
      console.error(e);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

app.enable("trust proxy");
app.use(cors());

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      httpOnly: true,
      resave: false,
      saveUninitialized: false,
      maxAge: 60000,
    },
  })
);

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/auth", userRouter);

const port = process.env.PORT || 3000;

app.get("/api/v1", (req, res) => {
  console.log("yeahhh m running");
  res.send("<h2>Hi there</h2>");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
