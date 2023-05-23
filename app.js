const express = require("express")
const body_parser = require("body-parser")
const validator = require("./utils/validator")
const pool = require("./db/pool")
const morgan = require("morgan")
const multer = require("multer")
const socketIO = require("socket.io")
const petRoute = require("./routes/petRouter")
const solidRoute = require("./routes/solidRouter")
const clinicRoute = require("./routes/clinicRouter")
const userRouter = require("./routes/userRouter")
const chatRouter = require("./routes/chatRouter")
const ratingRouter = require("./routes/ratingRouter")
const commentRouter = require("./routes/commentRouter")

const { storage } = require("./utils/cloudinary")

const connection = require("./db/connection");

const upload = multer({ storage: storage("photos/public") })
const app = express()

app.use(morgan("dev"))

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*")
  res.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE,PATCH, OPTIONS"
  )
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  if (req.method === "OPTIONS") {
    return res.sendStatus(200)
  }
  next()
})

app.use(body_parser.urlencoded({ extended: false }))
app.use(body_parser.json())

app.use("/pet", petRoute)
app.use("/solid", solidRoute)
app.use("/clinic", clinicRoute)
app.use("/user", userRouter)
app.use("/comment", commentRouter)
app.use("/rating", ratingRouter)

app.use("/upload-image", upload.single("image"), (req, res, next) => {
  if (req.file) {
    return res.status(200).json({ status: "success", image_url: req.file.path })
  }
  res
    .status(400)
    .json({ status: "fail", message: "something went wrong while uploading!" })
})

app.use("/home", (req, res) => {
  res.redirect("/user/home")
})
///////
const WebSocket = require('ws');

const socket = new WebSocket('ws://localhost:3222');

socket.on('open', () => {
  console.log('WebSocket connection opened');
});

socket.on('message', (data) => {
  console.log(`Received message: ${data}`);
});

socket.on('close', (code, reason) => {
  console.log(`WebSocket connection closed with code ${code} and reason ${reason}`);
});

socket.on('error', (error) => {
  console.error('WebSocket error', error);

  if (error.code === 'ECONNRESET') {
    // Handle the socket hang up error
    console.log('WebSocket connection terminated unexpectedly');
  }
});

const server = app.listen(3222, async () => {
  await validator.isAdminExistAndCreateIt()
  console.log(`server working on port ${3222}....`)
})

const io = socketIO(server);
io.on('connection', (socket) => {
  console.log('Client connected');

  // Handle incoming messages
  socket.on('message', (data) => {
    console.log(`Received message: ${data}`);
    // Broadcast the message to all connected clients
    socket.broadcast.emit('message', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.post('/messages', (req, res) => {

  const { senderId, receiverId, messageText } = req.body;
  const createdAt = new Date();
  const query = 'INSERT INTO messages (sender_id, receiver_id, message_text, created_at) VALUES ($1, $2, $3, $4)';
  let values;
  if (senderId) {
    values = [senderId, receiverId, messageText, createdAt];
  } else {
    values = [null, receiverId, messageText, createdAt];
  }

  connection.dbQuery(query, values, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error sending message');
    } else {
      res.status(200).send('Message sent successfully');
    }
  });
});
//
// app.listen(3222, async () => {
//   await validator.isAdminExistAndCreateIt()
//   console.log(`server working on port ${3222}....`)
// })
