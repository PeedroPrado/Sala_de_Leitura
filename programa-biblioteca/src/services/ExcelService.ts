import Excel from 'exceljs';
import { Emprestimo } from '../interfaces/Emprestimo';

/**
 * Serviço para gerar relatórios em formato Excel.
 * Ele cria o arquivo em memória e retorna o seu conteúdo como um Buffer.
 */
export class ExcelService {
    /**
     * Gera um arquivo Excel com base na lista de empréstimos.
     * @param emprestimos A lista de empréstimos a ser incluída no relatório.
     * @returns Um Buffer contendo o arquivo Excel.
     */
    async gerarExcel(emprestimos: Emprestimo[]): Promise<any> {
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Empréstimos');

        // Define os cabeçalhos das colunas
        worksheet.columns = [
            { header: 'Aluno', key: 'aluno', width: 30 },
            { header: 'Ano', key: 'ano', width: 15 },
            { header: 'RA', key: 'ra', width: 15 },
            { header: 'Data do Empréstimo', key: 'dataEmprestimo', width: 25, style: { numFmt: 'DD/MM/YYYY' } },
            { header: 'Livro', key: 'livro', width: 50 },
        ];

        // Adiciona cada empréstimo como uma nova linha na planilha
        emprestimos.forEach(emprestimo => {
            worksheet.addRow({
                aluno: emprestimo.aluno,
                ano: emprestimo.ano,
                ra: emprestimo.ra,
                dataEmprestimo: emprestimo.dataEmprestimo,
                livro: emprestimo.livro,
            });
        });

        // Retorna o conteúdo do arquivo como um buffer de dados
        return workbook.xlsx.writeBuffer() as any;
    }
}