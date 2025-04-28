const express = require("express");
const router = express.Router();
const { pool, sql } = require("../../dataAccess/dbConfig");

// Get all users
router.get("/getAllUsers", async (req, res) => {
  try {
    const result = await pool.request().query("SELECT * FROM users");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Create new user
router.post("/addNewUser", async (req, res) => {
  try {
    const request = pool.request();
    console.log("Request body: ", req.body);
    const { first_name, last_name, email, password, mobile_number } = req.body;
    request.input("first_name", sql.NVarChar, first_name);
    request.input("last_name", sql.NVarChar, last_name);
    request.input("email", sql.NVarChar, email);
    request.input("password", sql.NVarChar, password);
    request.input("mobile_number", sql.NVarChar, mobile_number);
    request.query(
      "INSERT INTO users (first_name, last_name, email, password, mobile_number) VALUES (@first_name, @last_name, @email, @password, @mobile_number)"
    );
    res.status(200).json("user added successfully");
  } catch (err) {
    console.error("Error adding user: ", err);
    res.status(500).json("Error creating user");
  }
});

// Delete user by ID
router.delete("/deleteUser/:id", async (req, res) => {
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
});

// Updare user by ID

router.put("/updateUserdetails/:id", async (req, res) => {
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
});

module.exports = router;
