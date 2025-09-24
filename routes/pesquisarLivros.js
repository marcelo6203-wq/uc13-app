const express = require('express');
const router = express.Router();
//const pool = require('../db'); // Certifique-se de que este arquivo está configurado corretamente

// Middleware global de logger para todas as requisições
function meuLogger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
}

// Aplicar o middleware ao router
router.use(meuLogger);

// Middleware para validar se o parâmetro "termo" existe na query
function validaTermo(req, res, next) {
    const termo = req.query.termo;
    if (!termo || typeof termo !== 'string') {
        return res.status(400).json({ error: 'O parâmetro "termo" é obrigatório e deve ser uma string.' });
    }
    next();
}

// Rota para pesquisar livros
router.get('/', validaTermo, async (req, res) => {
    try {
        const termo = req.query.termo;
        const termoDeBusca = `%${termo}%`;

        const sql = `
            SELECT
                L.livro_id,
                L.titulo,
                L.ano_publicacao, -- Verifique se o nome da coluna está correto no banco
                L.genero,
                GROUP_CONCAT(A.nome SEPARATOR ', ') AS autores
            FROM LIVRO AS L
            JOIN LIVRO_AUTOR AS LA ON L.livro_id = LA.livro_id
            JOIN AUTOR AS A ON LA.autor_id = A.autor_id
            WHERE L.titulo LIKE ? OR A.nome LIKE ?
            GROUP BY L.livro_id
            ORDER BY L.titulo;
        `;

        const [results] = await pool.query(sql, [termoDeBusca, termoDeBusca]);
        res.json(results);
    } catch (err) {
        console.error('ERRO NO BACKEND:', err);
        res.status(500).json({ error: 'Ocorreu um erro no servidor ao processar sua busca.' });
    }
});

// Exportar o router
module.exports = router;

