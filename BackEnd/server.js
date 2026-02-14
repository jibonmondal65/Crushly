require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const cookiePaser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const { connectMongoDB } = require("./connections");
const userRouter = require("./routers/user");
const profileRouter = require("./routers/profile");
const crushRouter = require("./routers/crush");
const notificationRouter = require("./routers/notification");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL, 
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiePaser());

connectMongoDB(process.env.MONGO_URI);


app.use('/user', userRouter);
app.use('/profile',checkForAuthenticationCookie("token"), profileRouter);
app.use('/crush',checkForAuthenticationCookie("token"), crushRouter);
app.use('/notifications',checkForAuthenticationCookie("token"), notificationRouter);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.get("/", (req, res) => {
  res.json({ message: "Crushly API is running 🚀" });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on PORT: ${PORT}`);
});
