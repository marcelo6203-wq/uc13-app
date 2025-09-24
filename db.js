const mysql = require('mysql2');

// Criação da conexão com o banco de dados
const db = mysql.createConnection({
  host: 'localhost',       // ou o IP do servidor MySQL
  user: 'root',     // substitua pelo seu usuário MySQL
  password: 'senacrs',   // substitua pela sua senha MySQL
  database: 'biblioteca'// substitua pelo nome do seu banco
});

// Conecta ao banco
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err.message);
  } else {
    console.log('Conectado ao banco de dados MySQL.');
  }
});

module.exports = db;

