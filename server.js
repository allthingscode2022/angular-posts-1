// importing express for creating our server
const express = require("express");
const app = express();
// mongodb module for building models schemas and connecting mongodb
const mongoose = require("mongoose");
// create a port
const PORT = process.env.PORT || 5000;
const path = require("path");

mongoose.connect(`${process.env.MONGODB_URI}`, {
  useNewUrlParser: true
});

// middleware
app.use(express.static(path.join(__dirname, "/dist/posts")));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb", extended: true }));

// import User Controller
const UserController = require("./controllers/UserController");
// add User Controller to middleware
app.use("/user", UserController);
// import Post Controller
const PostController = require("./controllers/PostController");
// add Post Controller to middleware
app.use("/post", PostController);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/dist/posts/index.html"));
});

// start the server
app.listen(PORT);
