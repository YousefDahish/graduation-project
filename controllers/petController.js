var query = require("../db/query")
var connection = require("../db/connection")
const validator = require("./../utils/validator")
exports.getPetList = async (req, res) => {
  try {
    const petData = await connection.dbQuery(query.queryList.getPetJoinUser)
    res.status(200).json({ status: "successful", data: petData })
  } catch (err) {
    res.status(400).send({ error: `Failed to list pets; ${err.message}` })
  }
}
exports.getUserPets = async (req, res) => {
  try {
    if (!req.user.id) {
      return res
        .status(400)
        .json({ status: "fail", message: "please provide user id" })
    }
    const result = await connection.dbQuery(
      query.selectAllWhereQuery("pet", `user_id=${req.user.id}`)
    )
    res.status(200).json({ status: "successful", data: result.rows })
  } catch (err) {
    res
      .status(400)
      .json({ status: "fail", message: `can not get Pets: ${err.message}` })
  }
}
exports.getPet = async (req, res) => {
  try {
    if (!(await connection.isExist(`pet`, req.params.petId))) {
      return res
        .status(404)
        .json({ status: "fail", message: "please provide valid id" })
    }
    const result = await connection.dbQuery(
      query.selectOneQuery(`pet`, req.params.petId)
    )
    res.status(200).json({ status: "successful", data: result.rows })
  } catch (err) {
    res
      .status(400)
      .json({ status: "fail", message: `Failed to get pet:${err.message}` })
  }
}

exports.addPet = async (req, res) => {
  try {
    if (req.file) {
      req.body.image_url = req.file.path
    }
    if (req.user) {
      req.body.user_id = req.user.id
    }
    console.log(req.body)
    const columns = Object.keys(req.body).join(", ")
    const values = Object.values(req.body)
      .map((value) => `'${value}'`)
      .join(", ")
    const result = await connection.dbQuery(
      query.insertQuery("pet", columns, values)
    )
    res.status(200).json({ status: "successful", data: result.rows })
  } catch (err) {
    res.status(500).send({ error: `Failed to save pet ${err.message}` })
  }
}

exports.updatePet = async (req, res) => {
  try {
    if (req.file) {
      req.body.image_url = req.file.path
    }
    const petId = req.params.petId
    const body = req.body
    console.log(req.body)
    // check if pet exist
    if (!(await connection.isExist(`pet`, petId))) {
      return res
        .status(404)
        .json({ status: "fail", message: "please provide valid id" })
    }
    if (
      !(await validator.isOwner("pet", petId, req.user.id)) &&
      req.user.role == "user"
    ) {
      return res.status(403).json({
        status: "fail",
        message: "you don't own permissions to do this!",
      })
    }
    const updateQuery = query.updateOneWhereId("pet", body, petId)
    const result = await connection.dbQuery(updateQuery)

    res.status(200).json({ status: "successful", data: result.rows })
  } catch (err) {
    res.status(500).send({ error: `Failed to update pet ${err.message}` })
  }
}
exports.deletePet = async (req, res) => {
  try {
    if (!(await connection.isExist(`pet`, req.params.petId))) {
      return res
        .status(404)
        .json({ status: "fail", message: "please provide valid id" })
    }
    if (
      !(await validator.isOwner("pet", req.params.petId, req.user.id)) &&
      req.user.role == "user"
    ) {
      return res.status(403).json({
        status: "fail",
        message: "you don't own permissions to do this!",
      })
    }
    await connection.dbQuery(query.deleteOneQuery("pet", req.params.petId))
    res.status(201).send("Successfully pet deleted ")
  } catch (err) {
    res.status(500).send({ error: `Failed to delete pet ${err.message}` })
  }
}

exports.addLike = async (req, res) => {
  req.body.user_id = req.user.id
  try {
    const pet = await connection.dbQuery(
      `update pet set "like" = "like" + 1 where id = '${req.body.pet_id}' returning *`
    )
    const like = pet.rows[0]
    const q = query.insertQuery(
      "user_pet_favorite",
      "user_id , pet_id",
      `${req.user.id}, ${req.body.pet_id}`
    )
    await connection.dbQuery(q)
    res.status(200).json({ status: "success", data: like })
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: `can't like the same post twice: ${error.message}`,
    })
  }
}
exports.deleteLike = async (req, res) => {
  req.body.user_id = req.user.id
  try {
    // Check if the user has already liked the pet
    const checkLike = await connection.dbQuery(
        `SELECT * FROM user_pet_favorite WHERE user_id = '${req.user.id}' AND pet_id = '${req.body.pet_id}'`
    );
    if (checkLike.rows.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "User has not liked this pet before",
      });
    }

    // If the user has liked the pet before, delete the like
    const pet = await connection.dbQuery(
        `UPDATE pet SET "like" = "like" - 1 WHERE id = '${req.body.pet_id}' RETURNING *`
    );
    const like = pet.rows[0]
    const q = query.deleteWhere2(
        "user_pet_favorite",
        "user_id",
        "pet_id",
        [req.user.id, req.body.pet_id]
    );
    await connection.dbQuery(q)
    res.status(200).json({ status: "success like removed", data: like })
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: `can't delete like : ${error.message}`,
    })
  }
}
exports.getMyFavoritePet= async (req, res) => {
  try {
    const petData = await connection.dbQuery(query.queryList.getFavoriteJoinPet)
    res.status(200).json({ status: "success", data: petData })
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: `something wrong: ${error.message}`,
    })
  }
}
