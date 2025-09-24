const caixaDeBusca = document.getElementById('caixaDeBusca');
const botaoDeBusca = document.getElementById('botaoDeBusca');
const resultadosDiv = document.getElementById('resultados');
const formAdicionarLivro = document.getElementById('formAdicionarLivro');
const botaoListarAutores = document.getElementById('botaoListarAutores');
const listaAutores = document.getElementById('listaAutores');
const mensagemFeedback = document.getElementById('mensagemFeedback');

// 🔍 Buscar livros
const realizarBusca = () => {
    const termo = caixaDeBusca.value.trim();

    if (termo.length < 2) {
        resultadosDiv.innerHTML = '<p>Digite pelo menos 2 caracteres para buscar.</p>';
        return;
    }

    fetch(`/api/livros/pesquisar?termo=${encodeURIComponent(termo)}`)
        .then(response => response.json())
        .then(json => {
            if (json.success && Array.isArray(json.data)) {
                exibirResultados(json.data);
            } else {
                resultadosDiv.innerHTML = '<p>Erro ao buscar livros.</p>';
            }
        })
        .catch(error => {
            console.error('Erro ao buscar livros:', error);
            resultadosDiv.innerHTML = '<p>Ocorreu um erro ao realizar a busca. Tente novamente.</p>';
        });
};

// 📚 Exibir resultados da busca
const exibirResultados = (livros) => {
    resultadosDiv.innerHTML = '';

    if (!Array.isArray(livros) || livros.length === 0) {
        resultadosDiv.innerHTML = '<p>Nenhum livro encontrado para o termo buscado.</p>';
        return;
    }

    livros.forEach(livro => {
        const livroCard = document.createElement('div');
        livroCard.className = 'livro-card';
        livroCard.innerHTML = `
            <h3>${livro.titulo}</h3>
            <p><strong>Autor(es):</strong> ${livro.autores}</p>
            <p><strong>Gênero:</strong> ${livro.genero}</p>
            <p><strong>Ano:</strong> ${livro.ano_publicacao}</p>
            <button class="botao-excluir" data-id="${livro.livro_id}">Excluir</button>
        `;
        resultadosDiv.appendChild(livroCard);
    });

    adicionarEventosExcluir();
};

// 🗑️ Excluir livro
const adicionarEventosExcluir = () => {
    const botoesExcluir = document.querySelectorAll('.botao-excluir');
    botoesExcluir.forEach(botao => {
        botao.addEventListener('click', async () => {
            const livroId = botao.getAttribute('data-id');

            try {
                const resposta = await fetch(`/api/livros/${livroId}`, {
                    method: 'DELETE'
                });

                if (resposta.ok) {
                    botao.parentElement.remove();
                    mostrarMensagem('Livro excluído com sucesso!', true);
                } else {
                    mostrarMensagem('Erro ao excluir o livro.', false);
                }
            } catch (erro) {
                console.error('Erro na requisição DELETE:', erro);
                mostrarMensagem('Erro de conexão ao excluir o livro.', false);
            }
        });
    });
};

// 💬 Mostrar mensagens de feedback
const mostrarMensagem = (texto, sucesso) => {
    mensagemFeedback.textContent = texto;
    mensagemFeedback.style.color = sucesso ? 'green' : 'red';
    setTimeout(() => {
        mensagemFeedback.textContent = '';
    }, 3000);
};

// 🔎 Eventos de busca
botaoDeBusca.addEventListener('click', realizarBusca);
caixaDeBusca.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        realizarBusca();
    }
});

// ➕ Adicionar novo livro
formAdicionarLivro.addEventListener('submit', async (event) => {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value.trim();
    const ano_publicacao = document.getElementById('ano_publicacao').value.trim();
    const genero = document.getElementById('genero').value.trim();

    if (!titulo || !ano_publicacao || !genero) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    mensagemFeedback.textContent = 'Adicionando livro...';
    mensagemFeedback.style.color = 'black';

    try {
        const response = await fetch('/api/livros/novo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ titulo, ano_publicacao, genero })
        });

        if (!response.ok) {
            throw new Error('Erro ao adicionar livro');
        }

        const resultado = await response.json();
        mensagemFeedback.textContent = 'Livro adicionado com sucesso!';
        mensagemFeedback.className = 'mensagem-sucesso';
        formAdicionarLivro.reset();
    } catch (error) {
        console.error('Erro ao adicionar livro:', error);
        mensagemFeedback.textContent = 'Ocorreu um erro ao adicionar o livro. Tente novamente.';
        mensagemFeedback.className = 'mensagem-erro';
        setTimeout(() => {
            mensagemFeedback.textContent = '';
            mensagemFeedback.className = 'mensagem-feedback';
        }, 3000);
    }
});

// 👥 Listar autores
botaoListarAutores.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/autores');
        if (!response.ok) {
            throw new Error('Erro ao buscar autores');
        }

        const json = await response.json();

        if (json.success && Array.isArray(json.data)) {
            listaAutores.innerHTML = '';
            json.data.forEach(autor => {
                const li = document.createElement('li');
                li.textContent = autor.nome;
                listaAutores.appendChild(li);
            });
        } else {
            listaAutores.innerHTML = '<li>Erro ao listar autores.</li>';
        }
    } catch (error) {
        console.error('Erro ao listar autores:', error);
        alert('Ocorreu um erro ao listar os autores. Tente novamente.');
    }
});