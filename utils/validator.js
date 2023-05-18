const bcrypt = require("bcrypt")
const emailValidator = require("deep-email-validator")
const crypto = require("crypto")
const pool = require("./../db/pool")
const query = require("./../db/query")

exports.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword)
}
exports.isEmailValid = async function (email) {
  return emailValidator.validate(email)
}
exports.createPasswordResetCode = function () {
  const code = 100000 + Math.floor(Math.random() * 900000)
  const hashed_code = crypto
    .createHash("sha256")
    .update(code.toString())
    .digest("hex")
  this.passwordResetExpire = Date.now() + 20 * 60 * 1000 // 10 minutes
  console.log({ code })
  return { code, hashed_code }
}
exports.isAdminExistAndCreateIt = async () => {
  const result = await pool.query(
    query.selectAllWhereQuery(`user`, `email = 'admin@gmail.com'`)
  )
  if (result.rows.length == 0) {
    const encryptedUserPassword = await bcrypt.hash("password", 10)
    await pool.query(query.queryList.INSERT_ADMIN_QUERY, [
      "admin",
      "admin@gmail.com",
      encryptedUserPassword,
      encryptedUserPassword,
      "Egypt",
      "Fayum",
      "2010",
      "https",
      "admin",
    ])
    console.log("admin created successfully")
  } else {
    console.log("admin already exist")
  }
}
exports.checkConnection = async () => {
  pool.connect((err, client, release) => {
    if (err) {
      return console.error("Error acquiring client", err.stack)
    } else {
      console.log("db Connected successfully!")
    }
  })
}
exports.getRandomArray = (arr) => {
  const copy = arr.slice()
  return (shuffled = copy.sort(() => Math.random() - 0.5))
}
exports.isOwner = async (table, id, user_id) => {
  const record = await pool.query(
    `select * from "${table}" where id = ${id} and user_id = ${user_id}`
  )
  if (record.rows.length == 0) {
    return false
  }
  return true
}
