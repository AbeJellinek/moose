import type { Component, Word } from './index.ts';
import { asciiToArabic } from '../buckwalter.ts';
import { endsWithNonConnectingLetter } from '../orthography.ts';

export function mergeEmptySuffix(word: Word): Word {
    if (word.suffix && word.suffix.withVowels && !word.suffix.withoutVowels) {
        return {
            prefix: word.prefix,
            stem: {
                withoutVowels: word.stem.withoutVowels + word.suffix.withoutVowels,
                withVowels: word.stem.withVowels + word.suffix.withVowels,
                category: word.stem.category,
                description: word.stem.description,
            },
            suffix: null,
        };
    }
    return word;
}

export function formatArabic(word: Word, component: Component): string {
    let entry = word[component];
    if (!entry) return '';

    let arabicWord = asciiToArabic(entry.withVowels);
    if (isLastComponent(word, component) &&
        !endsWithNonConnectingLetter(arabicWord) &&
        entry.description.includes('/PREP')
    ) {
        arabicWord += 'ـ';
    }
    return arabicWord;
}

export function formatEnglish(word: Word, component: Component): string {
    let entry = word[component];
    if (!entry) return '';

    let gloss = entry.description
        .replace(/<pos>.*<\/pos>/, '')
        .replace(/<.*>/, '')
        .replace(/;/g, '; ')
        .trim();
    if (!gloss.includes('[')) {
        if (entry.category.includes('Pref')) {
            gloss = `${gloss} +`;
        } else if (entry.category.includes('Suff')) {
            gloss = `+ ${gloss}`;
        }
    }
    return gloss;
}

export function formatArabicJoined(word: Word) {
    return asciiToArabic(
        [word.prefix, word.stem, word.suffix]
            .map(e => e?.withVowels)
            .filter(Boolean)
            .join(''));
}

function isLastComponent(word: Word, component: Component): boolean {
    switch (component) {
        case 'prefix':
            return !word.stem.withoutVowels && !word.suffix?.withoutVowels;
        case 'stem':
            return !word.suffix?.withoutVowels;
        case 'suffix':
            return true;
    }
}
