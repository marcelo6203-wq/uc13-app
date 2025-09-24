const { route } = require("./autoresRouter");

// Deletar um livro
route.delete('/api/livros/:id', async (req, res) => {
    try {
        const livroId = req.params.id;

        await pool.query('DELETE FROM LIVRO_AUTOR WHERE livro_id = ?', [livroId]);

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

module.exports = router;
