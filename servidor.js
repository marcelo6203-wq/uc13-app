const express = require('express');
const db = require('./db'); // Conexão centralizada com MySQL
const adicionarLivroNovo = require('./routes/adicionarLivroNovo');
const autoresRouter = require('./routes/autoresRouter');
const pesquisarLivros = require('./routes/pesquisarLivros');
const adicionarGenero = require('./routes/adicionarGênero');

const app = express();
const port = 3000;

// Middleware para interpretar JSON
app.use(express.json());

// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Middleware global de logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rotas da aplicação
app.use('/api/livros', adicionarLivroNovo);         // Adicionar e excluir livros
app.use('/api/autores', autoresRouter);             // Listar autores
app.use('/api/livros/pesquisar', pesquisarLivros);  // Buscar livros por termo
app.use('/api/generos', adicionarGenero);           // Adicionar gêneros

// Middleware para rota não encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

// Middleware global de tratamento de erros (opcional)
app.use((err, req, res, next) => {
  console.error('Erro inesperado:', err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

