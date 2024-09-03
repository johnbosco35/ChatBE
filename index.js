const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const userRouter = require("./routes/userRoute");
const messageRouter = require("./routes/messagesRoute");
const socket = require("socket.io");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("dataBase is active");
  })
  .catch((error) => {
    console.log(error.message);
  });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

const port = process.env.PORT || 4444;
const server = app.listen(port, () => {
  console.log(`Active port on.. ${port}`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:4444",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
