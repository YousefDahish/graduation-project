const query = require("../db/query")
const connection = require("../db/connection")
const validator = require("./../utils/validator")

exports.getSolidList = async (req, res) => {
  try {
    const solidData = await connection.dbQuery(query.queryList.getSolidJoinUser)
    res.status(200).json({ status: "successful", data: solidData.rows })
  } catch (err) {
    res.status(500).send({ error: "Failed to list solid" })
  }
}
exports.getUserSolid = async (req, res) => {
  try {
    if (!req.user.id) {
      return res
        .status(400)
        .json({ status: "fail", message: "please provide user id" })
    }
    const result = await connection.dbQuery(
      query.selectAllWhereQuery("solid", `user_id=${req.user.id}`)
    )
    res.status(200).json({ status: "successful", data: result.rows })
  } catch (err) {
    res
      .status(400)
      .json({ status: "fail", message: `can not get comments: ${err.message}` })
  }
}
exports.getSolid = async (req, res) => {
  try {
    if (!(await connection.isExist("solid", req.params.solidId))) {
      return res
        .status(404)
        .json({ status: "fail", message: "please provide valid id" })
    }
    const result = await connection.dbQuery(
      query.selectOneQuery("solid", req.params.solidId)
    )
    res.status(200).json({ status: "successful", data: result.rows })
  } catch (err) {
    res.status(500).send({ error: "Failed to list solid" })
  }
}

exports.addSolid = async (req, res) => {
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
      query.insertQuery("solid", columns, values)
    )

    res.status(200).json({ status: "successful", data: result.rows })
  } catch (err) {
    res.status(500).send({ error: `Failed to add solid ${err.message}` })
  }
}

exports.updateSolid = async (req, res) => {
  try {
    const solidId = req.params.solidId
    if (!(await connection.isExist("solid", req.params.solidId))) {
      return res
        .status(404)
        .json({ status: "fail", message: "please provide valid id" })
    }
    if (
      !(await validator.isOwner("solid", solidId, req.user.id)) &&
      req.user.role == "user"
    ) {
      return res.status(403).json({
        status: "fail",
        message: "you don't own permissions to do this!",
      })
    }
    const updateQuery = query.updateOneWhereId("solid", req.body, solidId)
    const result = await connection.dbQuery(updateQuery)
    res.status(200).json({ status: "successful", data: result.rows })
  } catch (err) {
    res.status(400).send({ error: `Failed to update solid ${err.message}` })
  }
}
exports.deleteSolid = async (req, res) => {
  try {
    if (!(await connection.isExist("solid", req.params.solidId))) {
      return res
        .status(404)
        .json({ status: "fail", message: "please provide valid id" })
    }
    if (
      !(await validator.isOwner("solid", req.params.solidId, req.user.id)) &&
      req.user.role == "user"
    ) {
      return res.status(403).json({
        status: "fail",
        message: "you don't own permissions to do this!",
      })
    }
    await connection.dbQuery(query.deleteOneQuery("solid", req.params.solidId))
    res.status(201).send("Successfully solid deleted ")
  } catch (err) {
    res.status(400).send({ error: `Failed to delete solid ${err.message}` })
  }
}

exports.addLike = async (req, res) => {
  req.body.user_id = req.user.id
  try {
    const pet = await connection.dbQuery(
      `update solid set "like" = "like" + 1 where id = '${req.body.solid_id}' returning *`
    )
    const like = pet.rows[0]
    const q = query.insertQuery(
      "user_solid_favorite",
      "user_id , solid_id",
      `${req.user.id}, ${req.body.solid_id}`
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
exports.getMyFavoriteSolid= async (req, res) => {
  try {
    const solidData = await connection.dbQuery(query.queryList.getFavoriteJoinSolid)
    res.status(200).json({ status: "success", data: solidData })
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: `something wrong: ${error.message}`,
    })
  }
}