import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

import { Emprestimo } from './interface/Emprestimo';
import { EmprestimoService } from './services/EmprestimoService';
import { ExcelService } from './services/ExcelService';

const app = express();
const emprestimoService = new EmprestimoService();
const excelService = new ExcelService();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/emprestimos', (req, res) => {
    const { aluno, ra, ano, livro } = req.body;
    const novoEmprestimo: Emprestimo = {
        aluno,
        ra,
        ano,
        dataEmprestimo: new Date(),
        livro,
    };
    
    const sucesso = emprestimoService.adicionarEmprestimo(novoEmprestimo);
    
    if (sucesso) {
        res.status(201).json({ message: 'Empréstimo cadastrado com sucesso!' });
    } else {
        res.status(409).json({ message: 'Erro: O RA já está cadastrado no sistema.' });
    }
});

app.get('/api/relatorio', async (req, res) => {
    const emprestimos = emprestimoService.getEmprestimos();
    if (emprestimos.length > 0) {
        try {
            const excelBuffer = await excelService.gerarExcel(emprestimos);

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=' + 'relatorio_emprestimos.xlsx');
            
            res.send(excelBuffer);
            
        } catch (error) {
            console.error('Erro ao gerar o relatório:', error);
            res.status(500).json({ error: 'Erro ao gerar o relatório.' });
        }
    } else {
        res.status(404).json({ error: 'Nenhum empréstimo cadastrado para gerar o relatório.' });
    }
});

app.get('/api/emprestimos', (req, res) => {
    const ano = req.query.ano as undefined;
    const aluno = req.query.aluno as string;

    const emprestimos = emprestimoService.getEmprestimos(ano, aluno);
    res.json(emprestimos);
});

app.get('/api/anos-disponiveis', (req, res) => {
    const anos = emprestimoService.getAnosDisponiveis();
    res.json(anos);
});

app.delete('/api/emprestimos', (req, res) => {
    emprestimoService.limparEmprestimos();
    res.status(200).json({ message: 'Lista de empréstimos limpa com sucesso!' });
});

export default app;