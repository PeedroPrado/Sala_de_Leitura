import Excel from 'exceljs';
import { Emprestimo } from '../interface/Emprestimo';

export class ExcelService {
    async gerarExcel(emprestimos: Emprestimo[]): Promise<any> {
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Empréstimos');

        worksheet.columns = [
            { header: 'Aluno', key: 'aluno', width: 30 },
            { header: 'Ano', key: 'ano', width: 15 },
            { header: 'RA', key: 'ra', width: 15 },
            { header: 'Data do Empréstimo', key: 'dataEmprestimo', width: 25, style: { numFmt: 'DD/MM/YYYY' } },
            { header: 'Livro', key: 'livro', width: 50 },
        ];

        emprestimos.forEach(emprestimo => {
            worksheet.addRow({
                aluno: emprestimo.aluno,
                ano: emprestimo.ano,
                ra: emprestimo.ra,
                dataEmprestimo: emprestimo.dataEmprestimo,
                livro: emprestimo.livro,
            });
        });

        return workbook.xlsx.writeBuffer() as any;
    }
}