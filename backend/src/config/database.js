const mysql = require("mysql2");
require("dotenv").config();

// Configuração fila de conexões com o banco de dados MySQL
const poolConexoes = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Exporta como "promessa" para usar "await" nas consultas
const banco = poolConexoes.promise();

module.exports = banco;
