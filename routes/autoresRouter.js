const express = require('express');
const router = express.Router();
//const pool = require('../db');

// Rota para buscar todos os autores
router.get('/', async (req, res) => {
    try {
        // Consulta para obter todos os autores ordenados por nome
        const [autores] = await pool.query('SELECT * FROM AUTOR ORDER BY nome;');
        res.json(autores);
    } catch (err) {
        console.error("Erro ao buscar autores:", err);
        res.status(500).json({ error: 'Ocorreu um erro ao buscar autores.' });
    }
});

// Exportar o router
module.exports = router;


