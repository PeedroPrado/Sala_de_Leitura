export interface Emprestimo {
    aluno: string;
    ra: number;
    ano: number;
    dataEmprestimo: Date;
    livro: string;
    devolvido: boolean;
    dataDevolucao?: Date;
}