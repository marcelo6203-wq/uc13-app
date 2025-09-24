const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware global de logger
function meuLogger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
}

router.use(meuLogger);

// Middleware para validar o parâmetro "termo"
function validaTermo(req, res, next) {
    const termo = req.query.termo;
    if (!termo || typeof termo !== 'string' || termo.trim().length < 2) {
        return res.status(400).json({ success: false, error: 'O parâmetro "termo" deve conter ao menos 2 caracteres.' });
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
                L.ano_publicacao,
                L.genero,
                GROUP_CONCAT(DISTINCT A.nome SEPARATOR ', ') AS autores
            FROM LIVRO AS L
            JOIN LIVRO_AUTOR AS LA ON L.livro_id = LA.livro_id
            JOIN AUTOR AS A ON LA.autor_id = A.autor_id
            WHERE L.titulo LIKE ? OR A.nome LIKE ?
            GROUP BY L.livro_id
            ORDER BY L.titulo;
        `;

        const [results] = await db.query(sql, [termoDeBusca, termoDeBusca]);

        res.json({ success: true, data: Array.isArray(results) ? results : [] });
    } catch (err) {
        console.error('ERRO NO BACKEND:', err);
        res.status(500).json({ success: false, error: 'Ocorreu um erro no servidor ao processar sua busca.' });
    }
});

module.exports = router;

