const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { pool, sql } = require("../../../dataAccess/dbConfig");
const publicKeyPath = "config/certs/publicKey.pem";
const privateKeyPath = "config/certs/privateKey.pem";
const fs = require("fs");
const publicKey = fs.readFileSync(publicKeyPath, "utf8");
const privateKey = fs.readFileSync(privateKeyPath, "utf8");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Authentication Controllers

// Get Public Key
exports.getPublicKey = async (req, res) => {
  try {
    const publicKey = fs.readFileSync(publicKeyPath, "utf8");
    res.status(200).json({ publicKey });
  } catch (err) {
    console.error("Error sending public key: ", err);
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, encryptedPassword } = req.body;

    const result = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .query("SELECT * FROM users WHERE email = @email");

    console.log("Result from DB: ", result);

    const user = result.recordset[0];

    if (!user) {
      return res
        .status(400)
        .send("Invalid Credentials, Once check your credentials");
    }

    const decryptedPassword = crypto
      .privateDecrypt(
        { key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING },
        Buffer.from(encryptedPassword, "base64")
      )
      .toString("utf8");
    console.log("Decrypted Password: ", decryptedPassword);

    const passwordMatch = await bcrypt.compare(
      decryptedPassword,
      user.password
    );

    if (passwordMatch) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ token });
    } else {
      return res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.error("Error during login: ", err);
    res.status(500).send("Server error");
  }
};
