const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { pool, sql } = require("../../dataAccess/dbConfig");
const publicKeyPath = "config/certs/publicKey.pem";
const fs = require("fs");
const publicKey = fs.readFileSync(publicKeyPath, "utf8");
const authManagement = require("../controllers/auth/authManagement");

// Authentication Routes

router.post("/getPublicKey", authManagement.getPublicKey);

router.post("/login", authManagement.login);

module.exports = router;
