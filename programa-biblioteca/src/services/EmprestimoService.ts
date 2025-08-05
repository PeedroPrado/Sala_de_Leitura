import { Emprestimo } from '../interfaces/Emprestimo';
import fs from 'fs';
import path from 'path';

/**
 * Serviço responsável por gerenciar a lógica de negócios dos empréstimos.
 * Inclui métodos para carregar, salvar, adicionar, buscar e limpar empréstimos.
 */
export class EmprestimoService {
    private emprestimos: Emprestimo[] = [];
    private filePath: string;

    constructor() {
        // Define o caminho para o arquivo de dados JSON
        this.filePath = path.join(__dirname, '../../data/emprestimos.json');
        this.carregarEmprestimos();
    }

    /**
     * Carrega os dados dos empréstimos do arquivo JSON para a memória.
     * Caso o arquivo não exista ou esteja corrompido, a lista é inicializada como vazia.
     */
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

    /**
     * Salva a lista de empréstimos atual na memória para o arquivo JSON.
     * A formatação em 2 espaços (`null, 2`) facilita a leitura do arquivo.
     */
    private salvarEmprestimos(): void {
        fs.writeFileSync(this.filePath, JSON.stringify(this.emprestimos, null, 2), 'utf-8');
    }

    /**
     * Adiciona um novo empréstimo à lista, com uma verificação de duplicidade por RA.
     * @param emprestimo O objeto de empréstimo a ser adicionado.
     * @returns `true` se o empréstimo foi adicionado com sucesso, `false` se o RA já existe.
     */
    adicionarEmprestimo(emprestimo: Emprestimo): boolean {
        // Usa o método `some` para verificar se já existe um RA igual na lista
        const raExistente = this.emprestimos.some(e => e.ra === emprestimo.ra);
        
        if (raExistente) {
            console.warn(`Tentativa de adicionar RA duplicado: ${emprestimo.ra}`);
            return false;
        }
        
        this.emprestimos.push(emprestimo);
        this.salvarEmprestimos();
        return true;
    }

    /**
     * Retorna a lista de empréstimos, com a opção de filtrar por ano e/ou nome do aluno.
     * @param ano O ano escolar para filtrar.
     * @param aluno O nome do aluno para buscar.
     * @returns Uma lista de empréstimos filtrada.
     */
    getEmprestimos(ano?: number, aluno?: string): Emprestimo[] {
        let resultados = this.emprestimos;

        if (ano) {
            resultados = resultados.filter(e => e.ano === ano);
        }

        if (aluno) {
            // Converte o nome para minúsculas para uma busca que não diferencia maiúsculas de minúsculas
            const alunoLower = aluno.toLowerCase();
            resultados = resultados.filter(e => e.aluno.toLowerCase().includes(alunoLower));
        }

        return resultados;
    }

    /**
     * Retorna uma lista de todos os anos únicos presentes nos empréstimos.
     * Útil para popular o dropdown de filtro no frontend.
     * @returns Um array de números com os anos disponíveis.
     */
    getAnosDisponiveis(): number[] {
        const anos = this.emprestimos.map(e => e.ano);
        // Usa `Set` para remover duplicatas e `sort` para ordenar
        return [...new Set(anos)].sort((a, b) => a - b);
    }

    /**
     * Marca um empréstimo como devolvido, buscando-o pelo RA.
     * @param ra O RA do aluno cujo livro será devolvido.
     * @returns `true` se o empréstimo foi encontrado e atualizado, `false` caso contrário.
     */
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

    /**
     * Limpa toda a lista de empréstimos e salva a alteração no arquivo.
     */
    limparEmprestimos(): void {
        this.emprestimos = [];
        this.salvarEmprestimos();
    }
}