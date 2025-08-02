const NON_CONNECTING_LETTERS = Object.freeze(['ا', 'د', 'ذ', 'ر', 'ز', 'و', 'ة', 'ى']);

export function normalize(str: string) {
    return str
        .normalize('NFD')
        .trim()
        .replace(/[\P{Script=Arabic}\P{L}]/gu, '')
        .replace(/ـ/gu, '');
}

export function endsWithNonConnectingLetter(word: string) {
    let lastLetter = normalize(word).slice(-1);
    return NON_CONNECTING_LETTERS.includes(lastLetter);
}
