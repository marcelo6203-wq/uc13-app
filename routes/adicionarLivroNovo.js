const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
    try {
        const { titulo, ano_publicacao, genero } = req.body;

        // Validação básica
        if (!titulo || typeof titulo !== 'string') {
            return res.status(400).json({ error: 'O campo título é obrigatório e deve ser uma string.' });
        }

        if (!genero || typeof genero !== 'string') {
            return res.status(400).json({ error: 'O campo gênero é obrigatório e deve ser uma string.' });
        }

        // Validar o gênero
        const sqlValidaGenero = 'SELECT * FROM GENERO WHERE nome = ?';
        const [generos] = await db.query(sqlValidaGenero, [genero]);

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
        const [result] = await db.query(sql, [titulo, ano_publicacao, genero]);

        res.status(201).json({ livro_id: result.insertId });
    } catch (err) {
        console.error('Erro no servidor: ', err);
        res.status(500).json({ error: 'Ocorreu um erro no servidor ao adicionar livro.' });
    }
});

module.exports = router;

