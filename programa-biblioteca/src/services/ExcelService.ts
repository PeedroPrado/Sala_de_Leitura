import Excel from 'exceljs';
import { Emprestimo } from '../interfaces/Emprestimo';

export class ExcelService {
    async gerarExcel(emprestimos: Emprestimo[]): Promise<any> {
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Empréstimos');

        // Define as colunas do relatório, incluindo as novas colunas
        worksheet.columns = [
            { header: 'Aluno', key: 'aluno', width: 30 },
            { header: 'Ano', key: 'ano', width: 15 },
            { header: 'RA', key: 'ra', width: 15 },
            { header: 'Livro', key: 'livro', width: 50 },
            { header: 'Data do Empréstimo', key: 'dataEmprestimo', width: 25, style: { numFmt: 'DD/MM/YYYY' } },
            { header: 'Status', key: 'status', width: 15 }, // Nova coluna
            { header: 'Data da Devolução', key: 'dataDevolucao', width: 25, style: { numFmt: 'DD/MM/YYYY' } }, // Nova coluna
        ];

        // Adiciona cada empréstimo como uma nova linha, incluindo os novos dados
        emprestimos.forEach(emprestimo => {
            const status = emprestimo.devolvido ? 'Devolvido' : 'Emprestado';
            const dataDevolucao = emprestimo.dataDevolucao ? new Date(emprestimo.dataDevolucao) : '-';

            worksheet.addRow({
                aluno: emprestimo.aluno,
                ano: emprestimo.ano,
                ra: emprestimo.ra,
                livro: emprestimo.livro,
                dataEmprestimo: emprestimo.dataEmprestimo,
                status: status,
                dataDevolucao: dataDevolucao,
            });
        });

        return workbook.xlsx.writeBuffer() as any;
    }
}