const express = require("express");
const router = express.Router();
const { pool, sql } = require("../../dataAccess/dbConfig");
const userManagementController = require("../controllers/userManagement/userManagementController");

// Get all users
router.get("/getAllUsers", userManagementController.getAllUsers);

// Create new user
router.post("/addNewUser", userManagementController.addUser);

// Delete user by ID
router.delete("/deleteUser/:id", userManagementController.deleteUser);

// Updare user by ID

router.put("/updateUserdetails/:id", userManagementController.updateUser);

module.exports = router;
