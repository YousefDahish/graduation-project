var query = require("../db/query")
var connection = require("../db/connection")
const validator = require("./../utils/validator")
const bcrypt = require("bcrypt")

exports.getUsers = async (req, res) => {
  try {
    const result = await connection.dbQuery(query.queryList.GET_USER_QUERY)
    res.status(200).json({ status: "successful", data: result.rows })
  } catch (err) {
    res.status(500).send({ error: "Failed to get users" })
  }
}
exports.getUser = async (req, res) => {
  try {
    if (!(await connection.isExist("user", req.params.userId))) {
      return res
        .status(404)
        .json({ status: "fail", message: "please provide valid id" })
    }
    const result = await connection.dbQuery(
      query.selectOneQuery(`user`, req.params.userId)
    )
    res.status(200).json({ status: "successful", data: result.rows })
  } catch (err) {
    res.status(500).send({ error: "Failed to get users" })
  }
}

exports.addUser = async (req, res) => {
  try {
    const adjustBody = req.body
    // Validate user input
    if (!(adjustBody.email && adjustBody.password && adjustBody.name)) {
      return res.status(400).send("All input is required")
    }
    if (adjustBody.password !== adjustBody.password_confirm) {
      return res.status(500).json({
        status: "fail",
        message: "password and password confirm not matched",
      })
    }
    // check if user already exist
    // Validate if user exist in our database
    if (
      await connection.isExistWhere("user", `email = '${adjustBody.email}'`)
    ) {
      return res.status(409).send("email Already Exist. Please Login")
    }
    //Encrypt user password
    const encryptedUserPassword = await bcrypt.hash(adjustBody.password, 10)

    adjustBody.password = encryptedUserPassword
    delete adjustBody.password_confirm

    const adjustColumns = Object.keys(adjustBody).join(", ")
    const adjustValues = Object.values(adjustBody)
      .map((value) => `'${value}'`)
      .join(", ")

    // Create user in our database
    const q = query.insertQuery("user", adjustColumns, adjustValues)
    connection.dbQuery(q).then((result) => {
      res.status(201).json({ status: "successful", data: result.rows[0] })
    })
  } catch (err) {
    console.log("Error : " + err)
    res.status(500).send({ error: "Failed to add user" })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.userId
    if (!(await connection.isExist("user", req.params.userId))) {
      return res
        .status(404)
        .json({ status: "fail", message: "please provide valid id" })
    }
    const adjustBody = req.body
    delete adjustBody.password
    delete adjustBody.password_confirm
    const updateQuery = query.updateOneWhereId("user", adjustBody, userId)
    const result = await connection.dbQuery(updateQuery)
    res.status(200).json({ status: "successful", data: result.rows })
  } catch (err) {
    res.status(500).send({ error: `Failed to update user ${err.message}` })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    if (!(await connection.isExist("user", req.params.userId))) {
      return res
        .status(404)
        .json({ status: "fail", message: "please provide valid id" })
    }
    await connection.dbQuery(query.deleteOneQuery("user", req.params.userId))
    res.status(201).send("Successfully user deleted ")
  } catch (err) {
    res.status(400).send({ error: `Failed to delete user ${err.message}` })
  }
}

exports.deleteAll = async (req, res) => {
  try {
    await connection.dbQuery('DELETE FROM "user" where id != 1')
    res.status(201).send("Successfully user deleted ")
  } catch (err) {
    res.status(400).send({ error: `Failed to delete user ${err.message}` })
  }
}
exports.getHome = async (req, res, next) => {
  try {
    const petData = await connection.dbQuery(query.queryList.getPetJoinUser)
    const solidData = await connection.dbQuery(query.queryList.getSolidJoinUser)
    const data = petData.rows.concat(solidData.rows)

    res.status(200).json({ status: "success", length: data.length, data: data })
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: `something wrong: ${error.message}`,
    })
  }
}

exports.getUserPets = async (req, res, next) => {
  try {
    const id = req.user.id
    const q = query.selectAllWhereQuery(`pet`, `user_id = ${id}`)
    const pets = await connection.dbQuery(q)
    res.status(200).json({ status: "success", data: pets.rows })
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: `some thing wend wrong: ${error.message}`,
    })
  }
}
