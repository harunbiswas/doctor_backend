const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();

const databaseConnectionConfig = {
  host: "localhost",
  user: `${process.env.DB_USER}`,
  passwrod: `${process.env.DB_PASS}`,
  database: `${process.env.DB_NAME}`,
};

const con = mysql.createConnection(databaseConnectionConfig);

module.exports = con;
