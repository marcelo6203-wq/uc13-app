const caixaDeBusca = document.getElementById('caixaDeBusca');
const botaoDeBusca = document.getElementById('botaoDeBusca');
const resultadosDiv = document.getElementById('resultados');

// Função para busar livros
const realizarBusca = () => {
    const termo = caixaDeBusca.value;

    if (termo.length < 2) {
        resultadosDiv.innerHTML = '<p>Digite pelo menos 2 caracteres para buscar.</p>';
        return;
    }

    fetch(`/api/livros/pesquisar?termo=${encodeURIComponent(termo)}`)
        .then(response => response.json())
        .then(livros => {
            exibirResultados(livros);
        })
        .catch(error => {
            console.error('Erro ao buscar livros:', error);
            resultadosDiv.innerHTML = '<p>Ocorreu um erro ao realizar a busca. Tente novamente.</p>';
        });
        

};
// Exibe o resultado de busca de livros
const exibirResultados = (livros) => {
    resultadosDiv.innerHTML = '';

    if (livros.length === 0) {
        resultadosDiv.innerHTML = '<p>Nenhum livro encontrado para o termo buscado.</p>';
        return;
    }
// Loop for para pesquisar por um livro
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
// excluir um livro que foi buscado
    adicionarEventosExcluir();
};

const adicionarEventosExcluir = () => {
    const botoesExcluir = document.querySelectorAll('.botao-excluir');
// Botão excluir condicionado ao botaõ de busca ou seja espera por um click no botão buscar.
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

const mostrarMensagem = (texto, sucesso) => {
    const divMensagem = document.getElementById('mensagemFeedback');
    divMensagem.textContent = texto;
    divMensagem.style.color = sucesso ? 'green' : 'red';
    setTimeout(() => divMensagem.textContent = '', 3000);
};

botaoDeBusca.addEventListener('click', realizarBusca);
caixaDeBusca.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        realizarBusca();
    }
});
// Função para adicionar um novo livro
const formAdicionarLivro = document.getElementById('formAdicionarLivro');
formAdicionarLivro.addEventListener('submit', async (event) => {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const ano_publicacao = document.getElementById('ano_publicacao').value;
    const genero = document.getElementById('genero').value;
// Se diferente de titulo, ano_plublicação e genero lança um erro solicitando ao usuário para preencher o campo.
    if (!titulo || !ano_publicacao || !genero) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const mensagemFeedback = document.getElementById('mensagemFeedback');
    mensagemFeedback.textContent = 'Adicionando livro...';

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
        setTimeout(() => { mensagemFeedback.textContent = ''; }, 3000);
        mensagemFeedback.className = 'mensagem-feedback';
    }
});
// Botão listar autores condicionado a um evento de click.
const botaoListarAutores = document.getElementById('botaoListarAutores');
const listaAutores = document.getElementById('listaAutores');

botaoListarAutores.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/autores');
        if (!response.ok) {
            throw new Error('Erro ao buscar autores');
        }
        const autores = await response.json();
        listaAutores.innerHTML = '';
        autores.forEach(autor => {
            const li = document.createElement('li');
            li.textContent = autor.nome;
            listaAutores.appendChild(li);
        });
    } catch (error) {
        console.error('Erro ao listar autores:', error);
        alert('Ocorreu um erro ao listar os autores. Tente novamente.');
    }
});

