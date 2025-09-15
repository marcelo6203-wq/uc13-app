const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

const pool = mysql.createPool({ 
    host: 'localhost',
    user: 'root',
    password: 'senacrs', 
    database: 'biblioteca',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

app.get('/api/livros/pesquisar', async (req, res) => { 
    try {
        const termo = req.query.termo;

        if (!termo) {
            return res.json([]); 
        }

        const termoDeBusca = `%${termo}%`;
        const sql = `
            SELECT 
            L.livro_id,
                L.titulo, 
                L.ano_publicacao, 
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
        // Se qualquer erro acontecer no bloco 'try', ele será capturado aqui
        console.error("ERRO NO BACKEND:", err); // Mostra o erro detalhado no terminal do servidor
        res.status(500).json({ error: 'Ocorreu um erro no servidor ao processar sua busca.' });
    }
});




app.post('/api/livros/novo', express.json(), async (req, res) => {
    try {
        const { titulo, ano_publicacao, genero } = req.body;

        if (!titulo || !ano_publicacao || !genero) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        const sql = `
            INSERT INTO LIVRO (titulo, ano_publicacao, genero)
            VALUES (?, ?, ?);
        `;

        const [result] = await pool.query(sql, [titulo, ano_publicacao, genero]);
        res.status(201).json({ livro_id: result.insertId });

    } catch (err) {
        console.error("Erro no servidor:", err);
        res.status(500).json({ error: 'Ocorreu um erro no servidor ao adicionar o livro.' });
    }
});
app.get('/api/autores', async (req, res) => {
    try {
        const [autores] = await pool.query('SELECT * FROM AUTOR order by nome;');
        res.json(autores);
    } catch (err) {
        console.error("Erro ao buscar autores:", err);
        res.status(500).json({ error: 'Ocorreu um erro ao buscar autores.' });
    }
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

// Delete um livro
app.delete('/api/livros/:id', async (req, res) => {
    try {
        const livroId = req.params.id;

        // Primeiro, deletar as associações na tabela LIVRO_AUTOR
        await pool.query('DELETE FROM LIVRO_AUTOR WHERE livro_id = ?', [livroId]);

        // Depois, deletar o livro da tabela LIVRO
        const [result] = await pool.query('DELETE FROM LIVRO WHERE livro_id = ?', [livroId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Livro não encontrado.' });
        }

        res.json({ message: 'Livro deletado com sucesso.' });
    } catch (err) {
        console.error("Erro ao deletar livro:", err);
        res.status(500).json({ error: 'Ocorreu um erro ao deletar o livro.' });
    }
});

