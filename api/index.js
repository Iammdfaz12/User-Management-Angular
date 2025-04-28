const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const authRoutes = require("./app/routes/authRoutes");
const userRoutes = require("./app/routes/userRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// app.get("/", (req, res) => {
//   var sql = require("mssql");
//   var config = {
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     server: process.env.DB_SERVER,
//     database: process.env.DB_NAME,
//     port: 1433,
//     options: {
//       encrypt: true,
//       trustServerCertificate: true,
//     },
//     pool: {
//       max: 5000,
//       min: 500,
//       idleTimeoutMillis: 30000,
//     },
//   };

//   sql.connect(config, function (error) {
//     if (error) console.log(error);

//     var request = new sql.Request();

//     request.query("select * from users", function (error, recordset) {
//       if (error) console.log(error);

//       res.send(recordset.recordset);
//     });
//   });
// });

app.listen(5000, () => {
  console.log("Server Started...");
});
