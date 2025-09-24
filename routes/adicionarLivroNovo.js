const express = require('express');
const router = express.Router();
//const pool = require('../db');

router.post('/', async (req, res) => {
    try {
        const { titulo, ano_publicacao, genero } = req.body;

        // Validar o gênero
        const sqlValidaGenero = 'SELECT * FROM GENERO WHERE nome = ?';
        const [generos] = await pool.query(sqlValidaGenero, [genero]);

        if (generos.length === 0) {
            return res.status(400).json({ error: 'Gênero inválido.' });
        }

        // Validar ano_publicacao
        const ano = parseInt(ano_publicacao);
        const anoAtual = new Date().getFullYear();
        if (isNaN(ano) || ano <= 0 || ano > anoAtual) {
            return res.status(400).json({ error: 'Ano de publicação inválido.' });
        }

        // Inserir livro no banco de dados
        const sql = `
            INSERT INTO LIVRO (titulo, ano_publicacao, genero)
            VALUES (?, ?, ?);
        `;
        const [result] = await pool.query(sql, [titulo, ano_publicacao, genero]);

        res.status(201).json({ livro_id: result.insertId });
    } catch (err) {
        console.error('Erro no servidor: ', err);
        res.status(500).json({ error: 'Ocorreu um erro no servidor ao adicionar livro.' });
    }
});

// Exportar o router
module.exports = router;