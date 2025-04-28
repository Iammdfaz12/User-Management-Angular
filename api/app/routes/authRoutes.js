const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { pool, sql } = require("../../dataAccess/dbConfig");

// Authentication Routes

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .query("SELECT * FROM users WHERE email = @email");

    const user = result.recordset[0];
    console.log(user);
    

    if (!user || password.trim() !== user.password.trim()) {
      return res.status(400).send("Invalid credentials");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// CRUD Operation Routes
router.get("/users", async (req, res) => {
  try {
    const result = await pool.request().query("SELECT * FROM users");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
