const express = require('express');
const router = express.Router();
const db = require('../db');

// Rota para buscar todos os autores
router.get('/', async (req, res) => {
    try {
        const [autores] = await db.query('SELECT * FROM AUTOR ORDER BY nome;');

        if (autores.length === 0) {
            return res.status(404).json({ success: false, error: 'Nenhum autor encontrado.' });
        }

        res.json({ success: true, data: autores });
    } catch (err) {
        console.error("Erro ao buscar autores:", err);
        res.status(500).json({ success: false, error: 'Ocorreu um erro ao buscar autores.' });
    }
});

module.exports = router;



