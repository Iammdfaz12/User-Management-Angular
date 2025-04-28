const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 5000,
    min: 500,
    idleTimeoutMillis: 30000,
  },
};

const pool = new sql.ConnectionPool(config, (err) => {
  if (err) {
    console.error("Database connection failed: ", err);
  }
});

const connect = pool.connect();

module.exports = { sql, pool, connect };
