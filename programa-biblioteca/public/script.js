document.getElementById('emprestimoForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitButton = e.submitter;
    const mensagem = document.getElementById('mensagem');

    submitButton.disabled = true;
    mensagem.textContent = 'Enviando...';

    const aluno = document.getElementById('aluno').value;
    const ra = document.getElementById('ra').value;
    const ano = document.getElementById('ano').value;
    const livro = document.getElementById('livro').value;

    try {
        const response = await fetch('/api/emprestimos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ aluno, ra, ano, livro }),
        });

        if (response.status === 409) {
            const errorData = await response.json();
            mensagem.textContent = errorData.message;
            mensagem.style.color = 'red';
        } else {
            const data = await response.json();
            mensagem.textContent = data.message;
            mensagem.style.color = '#4CAF50';
            
            document.getElementById('emprestimoForm').reset();
            carregarAnosDisponiveis(); // Atualiza a lista de anos disponíveis
            buscarEmprestimos(); // Atualiza a lista de empréstimos
        }
    } catch (error) {
        console.error('Erro ao cadastrar empréstimo:', error);
        mensagem.textContent = 'Ocorreu um erro ao cadastrar o empréstimo.';
        mensagem.style.color = 'red';
    } finally {
        submitButton.disabled = false;
    }
});

document.getElementById('gerarExcel').addEventListener('click', async () => {
    const mensagem = document.getElementById('mensagem');
    mensagem.textContent = 'Gerando relatório...';

    try {
        const response = await fetch('/api/relatorio', {
            method: 'GET',
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'relatorio_emprestimos.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            
            mensagem.textContent = 'Relatório Excel gerado e baixado!';
            mensagem.style.color = '#4CAF50';
        } else {
            const errorData = await response.json();
            mensagem.textContent = errorData.error;
            mensagem.style.color = 'red';
        }
    } catch (error) {
        console.error('Erro ao gerar o relatório:', error);
        mensagem.textContent = 'Ocorreu um erro ao gerar o relatório.';
        mensagem.style.color = 'red';
    }
});

document.getElementById('limparListaBtn').addEventListener('click', async () => {
    if (confirm('Tem certeza que deseja limpar todos os empréstimos? Esta ação não pode ser desfeita.')) {
        try {
            const mensagem = document.getElementById('mensagem');
            mensagem.textContent = 'Limpando a lista...';
            mensagem.style.color = '#333';

            const response = await fetch('/api/emprestimos', {
                method: 'DELETE',
            });
            const data = await response.json();
            
            mensagem.textContent = data.message;
            mensagem.style.color = '#4CAF50';
            
            buscarEmprestimos();
            carregarAnosDisponiveis();
        } catch (error) {
            console.error('Erro ao limpar a lista:', error);
            const mensagem = document.getElementById('mensagem');
            mensagem.textContent = 'Erro ao limpar a lista de empréstimos.';
            mensagem.style.color = 'red';
        }
    }
});

async function carregarAnosDisponiveis() {
    try {
        const response = await fetch('/api/anos-disponiveis');
        const anos = await response.json();
        const filtroAnoSelect = document.getElementById('filtroAno');

        // Limpa as opções existentes, exceto a primeira
        filtroAnoSelect.innerHTML = '<option value="">Todos os Anos</option>';

        anos.forEach(ano => {
            const option = document.createElement('option');
            option.value = ano;
            option.textContent = ano;
            filtroAnoSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar anos disponíveis:', error);
    }
}

async function buscarEmprestimos() {
    try {
        const filtroAno = document.getElementById('filtroAno').value;
        const filtroAluno = document.getElementById('filtroAluno').value;

        let url = '/api/emprestimos';
        const params = new URLSearchParams();
        if (filtroAno) params.append('ano', filtroAno);
        if (filtroAluno) params.append('aluno', filtroAluno);
        if (params.toString()) {
            url += '?' + params.toString();
        }

        const response = await fetch(url);
        const emprestimos = await response.json();

        const listaEmprestimosDiv = document.getElementById('listaEmprestimos');
        listaEmprestimosDiv.innerHTML = '';

        if (emprestimos.length > 0) {
            const emprestimosAgrupados = emprestimos.reduce((acc, emprestimo) => {
                const ano = emprestimo.ano;
                if (!acc[ano]) {
                    acc[ano] = [];
                }
                acc[ano].push(emprestimo);
                return acc;
            }, {});

            for (const ano in emprestimosAgrupados) {
                const anoTitle = document.createElement('h3');
                anoTitle.textContent = `Ano: ${ano}`;
                listaEmprestimosDiv.appendChild(anoTitle);

                const table = document.createElement('table');
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>Aluno</th>
                            <th>Ano</th>
                            <th>RA</th>
                            <th>Livro</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                `;
                listaEmprestimosDiv.appendChild(table);
                const tbody = table.querySelector('tbody');

                emprestimosAgrupados[ano].forEach(emprestimo => {
                    const row = tbody.insertRow();
                    
                    const alunoCell = row.insertCell(0);
                    alunoCell.innerText = emprestimo.aluno;
                    alunoCell.setAttribute('data-label', 'Aluno');

                    const anoCell = row.insertCell(1);
                    anoCell.innerText = emprestimo.ano;
                    anoCell.setAttribute('data-label', 'Ano');

                    const raCell = row.insertCell(2);
                    raCell.innerText = emprestimo.ra;
                    raCell.setAttribute('data-label', 'RA');

                    const livroCell = row.insertCell(3);
                    livroCell.innerText = emprestimo.livro;
                    livroCell.setAttribute('data-label', 'Livro');

                    const dataCell = row.insertCell(4);
                    dataCell.innerText = new Date(emprestimo.dataEmprestimo).toLocaleDateString('pt-BR');
                    dataCell.setAttribute('data-label', 'Data');
                });
            }

            listaEmprestimosDiv.style.display = 'block';
        } else {
            listaEmprestimosDiv.style.display = 'block';
            listaEmprestimosDiv.innerHTML = '<p>Nenhum empréstimo encontrado.</p>';
        }
    } catch (error) {
        console.error('Erro ao buscar a lista de empréstimos:', error);
        alert('Erro ao buscar a lista de empréstimos.');
    }
}

document.getElementById('buscarEmprestimosBtn').addEventListener('click', buscarEmprestimos);

document.addEventListener('DOMContentLoaded', () => {
    carregarAnosDisponiveis();
    buscarEmprestimos();
});