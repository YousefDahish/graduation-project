const express = require("express")
const router = express.Router({ mergeParams: true })
const solidController = require("../controllers/solidController")
const authController = require("./../controllers/authController")
const multer = require("multer")

const { storage } = require("./../utils/cloudinary")
const petController = require("../controllers/petController");

const upload = multer({ storage: storage("photos/pets") })

router.post("/like", authController.protect, solidController.addLike)
router.route("/delete_like").post(authController.protect, solidController.deleteLike)
router.get("/favorit_solid",solidController.getMyFavoriteSolid)

router
  .route("/mine")
  .all(authController.protect)
  .get(solidController.getUserSolid)
  .post(upload.single("image"), solidController.addSolid)
router
  .route("/all")
  .get(solidController.getSolidList)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    solidController.addSolid
  )
router.get("/", (req, res) => {
  res.redirect("/solid/all")
})
router
  .route("/:solidId")
  .get(solidController.getSolid)
  .patch(authController.protect, solidController.updateSolid)
  .delete(authController.protect, solidController.deleteSolid)

module.exports = router
