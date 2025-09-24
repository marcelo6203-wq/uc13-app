const express = require('express');
const router = express.Router();
//const pool = require('../db'); // Certifique-se de que este arquivo está configurado corretamente

// Rota para adicionar gênero
router.post('/', express.json(), async (req, res) => {
    try {
        const { nome } = req.body;

        // Verificar se o campo "nome" foi fornecido
        if (!nome) {
            return res.status(400).json({ error: 'O campo nome é obrigatório.' });
        }

        // Inserir o gênero no banco de dados
        const sql = 'INSERT INTO GENERO (nome) VALUES (?);';
        const [result] = await pool.query(sql, [nome]);

        // Retornar o ID do gênero inserido
        res.status(201).json({ genero_id: result.insertId, nome });
    } catch (err) {
        console.error('Erro ao adicionar gênero:', err);
        res.status(500).json({ error: 'Ocorreu um erro ao adicionar o gênero.' });
    }
});

// Exportar o router
module.exports = router;