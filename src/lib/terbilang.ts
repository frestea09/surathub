
const ones = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan'];
const teens = ['Sepuluh', 'Sebelas', 'Dua Belas', 'Tiga Belas', 'Empat Belas', 'Lima Belas', 'Enam Belas', 'Tujuh Belas', 'Delapan Belas', 'Sembilan Belas'];
const tens = ['', '', 'Dua Puluh', 'Tiga Puluh', 'Empat Puluh', 'Lima Puluh', 'Enam Puluh', 'Tujuh Puluh', 'Delapan Puluh', 'Sembilan Puluh'];
const thousands = ['', 'Ribu', 'Juta', 'Miliar', 'Triliun'];

function convertGroup(n: number): string {
    let result = '';

    const hundred = Math.floor(n / 100);
    const rest = n % 100;

    if (hundred > 0) {
        result += (hundred === 1 ? 'Seratus' : ones[hundred] + ' Ratus');
    }

    if (rest > 0) {
        if (hundred > 0) result += ' ';
        if (rest < 10) {
            result += ones[rest];
        } else if (rest < 20) {
            result += teens[rest - 10];
        } else {
            const ten = Math.floor(rest / 10);
            const one = rest % 10;
            result += tens[ten];
            if (one > 0) {
                result += ' ' + ones[one];
            }
        }
    }

    return result;
}

export function terbilang(n: number): string {
    if (n === 0) return 'Nol';

    let result = '';
    let i = 0;
    
    while (n > 0) {
        const group = n % 1000;
        if (group > 0) {
            let groupText = convertGroup(group);
            if (i === 1 && group === 1) { // Handle "Seribu"
                groupText = 'Seribu';
            } else {
                groupText += (i > 0 ? ' ' + thousands[i] : '');
            }
            result = groupText + (result ? ' ' + result : '');
        }
        n = Math.floor(n / 1000);
        i++;
    }

    return result.trim();
}
