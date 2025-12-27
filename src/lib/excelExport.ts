import * as XLSX from 'xlsx';

interface ExcelSheet {
  name: string;
  data: Record<string, unknown>[];
}

export function exportToExcel(
  sheets: ExcelSheet[],
  filename: string
): void {
  const workbook = XLSX.utils.book_new();

  sheets.forEach((sheet) => {
    const worksheet = XLSX.utils.json_to_sheet(sheet.data);
    
    // Auto-adjust column widths
    const columnWidths = sheet.data.length > 0
      ? Object.keys(sheet.data[0]).map((key) => {
          const maxLength = Math.max(
            key.length,
            ...sheet.data.map((row) => String(row[key] || '').length)
          );
          return { wch: Math.min(maxLength + 2, 40) };
        })
      : [];
    worksheet['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
  });

  XLSX.writeFile(workbook, filename);
}

export function formatCurrencyForExcel(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatCPF(cpf: string): string {
  // Remove non-digits
  const digits = cpf.replace(/\D/g, '');
  // Format as XXX.XXX.XXX-XX
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
