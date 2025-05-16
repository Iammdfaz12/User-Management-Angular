const bcrypt = require("bcrypt");
const crypto = require("crypto");
const fs = require("fs");
const { pool, sql } = require("../../../dataAccess/dbConfig");
const privateKeyPath = "config/certs/privateKey.pem";
const privateKey = fs.readFileSync(privateKeyPath, "utf8");

function decryptedPassword(password) {
  try {
    const decryptedPassword = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(password, "base64")
    );
    return decryptedPassword.toString("utf8");
  } catch (err) {
    console.error("Error decrypting password: ", err);
  }
}

async function hashPassword(password) {
  try {
    password = decryptedPassword(password);
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err) {
    console.error("Error hashing password: ", err);
  }
}

// user Management Controllers

//Get all users

exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.request().query("SELECT * FROM users");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// Add User Details

exports.addUser = async (req, res) => {
  try {
    const request = pool.request();
    const { first_name, last_name, email, password, mobile_number } = req.body;

    const hashedPassword = await hashPassword(password);

    request.input("first_name", sql.NVarChar, first_name);
    request.input("last_name", sql.NVarChar, last_name);
    request.input("email", sql.NVarChar, email);
    request.input("password", sql.NVarChar, hashedPassword);
    request.input("mobile_number", sql.NVarChar, mobile_number);

    await request.query(
      "INSERT INTO users (first_name, last_name, email, password, mobile_number) VALUES (@first_name, @last_name, @email, @password, @mobile_number)"
    );

    res.status(200).json("User added successfully");
  } catch (err) {
    console.error("Error adding user: ", err);
    res.status(500).json("Error creating user");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const request = pool.request();
    const id = req.params.id;
    request.input("id", sql.Int, id);
    request.query("DELETE FROM users WHERE id = @id");
    res.status(200).json("User details deleted successfully");
  } catch (err) {
    error("Error deleting user: ", err);
    res.status(500).json("Error deleting user");
  }
};

exports.updateUser = async (req, res) => {
  try {
    const request = pool.request();
    const id = req.params.id;
    const { first_name, last_name, email, password, mobile_number } = req.body;
    request.input("first_name", sql.NVarChar, first_name);
    request.input("last_name", sql.NVarChar, last_name);
    request.input("email", sql.NVarChar, email);
    request.input("password", sql.NVarChar, password);
    request.input("mobile_number", sql.NVarChar, mobile_number);
    request.input("id", sql.Int, id);

    request.query(
      "UPDATE users SET first_name = @first_name, last_name = @last_name, email = @email, password = @password, mobile_number = @mobile_number WHERE id = @id"
    );
    res.status(200).json("User details updated successfully");
  } catch (err) {
    console.error("Error updating user: ", err);
    res.status(500).json("Error updating user");
  }
};
