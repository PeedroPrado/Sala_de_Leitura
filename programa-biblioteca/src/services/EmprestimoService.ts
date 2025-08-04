import { Emprestimo } from '../interface/Emprestimo';
import fs from 'fs';
import path from 'path';

export class EmprestimoService {
    private emprestimos: Emprestimo[] = [];
    private filePath: string;

    constructor() {
        this.filePath = path.join(__dirname, '../../data/emprestimos.json');
        this.carregarEmprestimos();
    }

    private carregarEmprestimos(): void {
        if (fs.existsSync(this.filePath)) {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            try {
                this.emprestimos = JSON.parse(data);
            } catch (error) {
                console.error('Erro ao ler o arquivo de dados, iniciando com lista vazia.');
                this.emprestimos = [];
            }
        }
    }

    private salvarEmprestimos(): void {
        fs.writeFileSync(this.filePath, JSON.stringify(this.emprestimos, null, 2), 'utf-8');
    }

    adicionarEmprestimo(emprestimo: Emprestimo): boolean {
        const raExistente = this.emprestimos.some(e => e.ra === emprestimo.ra);
        
        if (raExistente) {
            console.warn(`Tentativa de adicionar RA duplicado: ${emprestimo.ra}`);
            return false;
        }
        
        this.emprestimos.push(emprestimo);
        this.salvarEmprestimos();
        return true;
    }

    getEmprestimos(ano?: number, aluno?: string): Emprestimo[] {
        let resultados = this.emprestimos;

        if (ano) {
            resultados = resultados.filter(e => e.ano === ano);
        }

        if (aluno) {
            const alunoLower = aluno.toLowerCase();
            resultados = resultados.filter(e => e.aluno.toLowerCase().includes(alunoLower));
        }

        return resultados;
    }

    getAnosDisponiveis(): number[] {
        const anos = this.emprestimos.map(e => e.ano);
        return [...new Set(anos)].sort();
    }

    limparEmprestimos(): void {
        this.emprestimos = [];
        this.salvarEmprestimos();
    }
}