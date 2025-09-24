const express = require('express');
const mysql = require('mysql2');
const adicionarLivroNovo = require('./routes/adicionarLivroNovo');
const autoresRouter = require('./routes/autoresRouter');
const pesquisarLivros = require('./routes/pesquisarLivros');
const adicionarGenero = require('./routes/adicionarGênero');

const app = express();
const port = 3000;

// Configuração do pool de conexões com o banco de dados
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'senacrs',
    database: 'biblioteca',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

// Middleware global de logger para todas as requisições
function meuLogger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
}

app.use(meuLogger);

// Middleware para servir arquivos estáticos
app.use(express.static('public'));

// Usar os roteadores importados
app.use('/api/livros', adicionarLivroNovo); // Rotas relacionadas a livros
app.use('/api/autores', autoresRouter); // Rotas relacionadas a autores
app.use('/api/livros/pesquisar', pesquisarLivros); // Rota para pesquisar livros
app.use('/api/generos', adicionarGenero); // Rotas relacionadas a gêneros

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});