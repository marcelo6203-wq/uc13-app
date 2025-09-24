const mysql = require('mysql2');

// Criação da conexão com o banco de dados usando Promises
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'senacrs',
  database: 'biblioteca'
}).promise(); // 👈 aqui está o ponto certo para usar .promise()

// Conecta ao banco
db.connect()
  .then(() => {
    console.log('Conectado ao banco de dados MySQL.');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MySQL:', err.message);
  });

module.exports = db;


