import tableRaw from '../data/buckwalterTable.json';

let asciiToArabicTable = tableRaw as Record<string, string>;
let arabicToAsciiTable = Object.fromEntries(
    Object.entries(asciiToArabicTable)
        .map(([ascii, arabic]) => [arabic, ascii])
);

export function asciiToArabic(str: string) {
    return Array.from(str)
        .map((c) => asciiToArabicTable.hasOwnProperty(c) ? asciiToArabicTable[c] : '')
        .join('');
}

export function arabicToAscii(str: string) {
    return Array.from(str)
        .map(c => arabicToAsciiTable.hasOwnProperty(c) ? arabicToAsciiTable[c] : '')
        .join('');
}
