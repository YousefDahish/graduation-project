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
const cors = require("cors");

const connection = require("./db/connection");

const upload = multer({ storage: storage("photos/public") })
const app = express()

app.use(morgan("dev"))

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*")
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  if (req.method === "OPTIONS") {
    return res.sendStatus(200)
  }
  next()
})

app.use(cors)
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

app.listen(3222, async () => {
  await validator.isAdminExistAndCreateIt()
  console.log(`server working on port ${3222}....`)
})
