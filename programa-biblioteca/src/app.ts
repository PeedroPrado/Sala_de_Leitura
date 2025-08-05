import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

import { Emprestimo } from './interfaces/Emprestimo';
import { EmprestimoService } from './services/EmprestimoService';
import { ExcelService } from './services/ExcelService';

// Cria a instância do aplicativo Express
const app = express();
const emprestimoService = new EmprestimoService();
const excelService = new ExcelService();

// Middlewares:
// - bodyParser.json(): Habilita o Express a ler o corpo das requisições POST/PUT como JSON.
// - express.static(): Serve os arquivos estáticos (HTML, CSS, JS) da pasta `public`.
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

/**
 * Rota POST para cadastrar um novo empréstimo.
 */
app.post('/api/emprestimos', (req, res) => {
    // Extrai os dados da requisição
    const { aluno, ra, ano, livro } = req.body;
    
    // Cria o objeto de empréstimo com os dados convertidos para o tipo correto (número)
    const novoEmprestimo: Emprestimo = {
        aluno,
        ra: parseInt(ra),
        ano: parseInt(ano),
        dataEmprestimo: new Date(),
        livro,
        devolvido: false, // Inicialmente, o livro não está devolvido
    };
    
    // Chama o serviço para adicionar o empréstimo e lida com a resposta
    const sucesso = emprestimoService.adicionarEmprestimo(novoEmprestimo);
    
    if (sucesso) {
        res.status(201).json({ message: 'Empréstimo cadastrado com sucesso!' });
    } else {
        // Retorna status 409 (Conflict) se o RA já existir
        res.status(409).json({ message: `Erro: O RA ${ra} já está cadastrado no sistema.` });
    }
});

/**
 * Rota GET para gerar e baixar o relatório Excel.
 */
app.get('/api/relatorio', async (req, res) => {
    const emprestimos = emprestimoService.getEmprestimos();
    if (emprestimos.length > 0) {
        try {
            const excelBuffer = await excelService.gerarExcel(emprestimos);

            // Define os cabeçalhos para que o navegador entenda que é um arquivo para download
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=' + 'relatorio_emprestimos.xlsx');
            
            // Envia o arquivo como um buffer de dados
            res.send(excelBuffer);
            
        } catch (error) {
            console.error('Erro ao gerar o relatório:', error);
            res.status(500).json({ error: 'Erro ao gerar o relatório.' });
        }
    } else {
        res.status(404).json({ error: 'Nenhum empréstimo cadastrado para gerar o relatório.' });
    }
});

/**
 * Rota GET para obter a lista de empréstimos, com suporte a filtros por ano e aluno.
 */
app.get('/api/emprestimos', (req, res) => {
    // Converte os parâmetros de filtro para o tipo correto
    const ano = req.query.ano ? parseInt(req.query.ano as string) : undefined;
    const aluno = req.query.aluno as string;

    const emprestimos = emprestimoService.getEmprestimos(ano, aluno);
    res.json(emprestimos);
});

/**
 * Rota GET para obter a lista de anos disponíveis para o filtro.
 */
app.get('/api/anos-disponiveis', (req, res) => {
    const anos = emprestimoService.getAnosDisponiveis();
    res.json(anos);
});

/**
 * Rota DELETE para limpar todos os empréstimos.
 */
app.delete('/api/emprestimos', (req, res) => {
    emprestimoService.limparEmprestimos();
    res.status(200).json({ message: 'Lista de empréstimos limpa com sucesso!' });
});

/**
 * Rota PUT para marcar um empréstimo como devolvido.
 */
app.put('/api/emprestimos/:ra/devolver', (req, res) => {
    const { ra } = req.params;
    // Converte o RA para número antes de passar para o serviço
    const sucesso = emprestimoService.marcarComoDevolvido(parseInt(ra));

    if (sucesso) {
        res.status(200).json({ message: `Empréstimo do RA ${ra} marcado como devolvido.` });
    } else {
        res.status(404).json({ message: `Erro: Empréstimo do RA ${ra} não encontrado ou já devolvido.` });
    }
});


export default app;