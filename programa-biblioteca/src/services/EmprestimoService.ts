import { Emprestimo } from '../interfaces/Emprestimo';
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
        // --- LINHA CORRIGIDA ABAIXO ---
        // Agora, a verificação só retorna true se o RA existir E o empréstimo não tiver sido devolvido.
        const raExistente = this.emprestimos.some(e => e.ra === emprestimo.ra && !e.devolvido);
        
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
        return [...new Set(anos)].sort((a, b) => a - b);
    }

    limparEmprestimos(): void {
        this.emprestimos = [];
        this.salvarEmprestimos();
    }
    
    marcarComoDevolvido(ra: number): boolean {
        const emprestimo = this.emprestimos.find(e => e.ra === ra);
        if (emprestimo && !emprestimo.devolvido) {
            emprestimo.devolvido = true;
            emprestimo.dataDevolucao = new Date();
            this.salvarEmprestimos();
            return true;
        }
        return false;
    }
}