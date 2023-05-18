const express = require("express")
const userController = require("../controllers/userController")
const authController = require("./../controllers/authController")
const connection = require("../db/connection")
const petRouter = require("./petRouter")
const router = express.Router({ mergeParams: true })

router.post("/signup", authController.signUp)
router.post("/login", authController.login)
router.post("/forgetPassword", authController.forgetPassword)
router.post("/resetPassword", authController.resetPassword)
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updateUserPassword
)
router.get("/home", userController.getHome)
router
  .route("/")
  .all(authController.protect, authController.restrictTo("admin"))
  .get(userController.getUsers)
  .post(userController.addUser)
// .delete(userController.deleteAll)
router
  .route("/:userId")
  .all(authController.protect)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)
  .get(userController.getUser)

module.exports = router
