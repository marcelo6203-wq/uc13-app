const express = require('express');
const router = express.Router();
const db = require('../db'); // Corrigido: usar o nome correto da conexão

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
        const [result] = await db.query(sql, [nome]); // Corrigido: usar db.query

        // Retornar o ID do gênero inserido
        res.status(201).json({ genero_id: result.insertId, nome });
    } catch (err) {
        console.error('Erro ao adicionar gênero:', err);
        res.status(500).json({ error: 'Ocorreu um erro ao adicionar o gênero.' });
    }
});

module.exports = router;

