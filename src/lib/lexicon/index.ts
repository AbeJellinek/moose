import { Dict, type DictEntry, parseDictFile, parseTableFile, Table } from './parse.ts';

export class Lexicon {
    static readonly BASE_URL = '/data';

    private prefixes: Dict;
    private stems: Dict;
    private suffixes: Dict;
    private ab: Table;
    private ac: Table;
    private bc: Table;

    private constructor(prefixes: Dict, stems: Dict, suffixes: Dict, ab: Table, ac: Table, bc: Table) {
        this.prefixes = prefixes;
        this.stems = stems;
        this.suffixes = suffixes;
        this.ab = ab;
        this.ac = ac;
        this.bc = bc;
    }

    lookUpWord(word: string): Word[] {
        let results = [];
        for (let prefixEnd = 0; prefixEnd <= word.length; prefixEnd++) {
            for (let suffixStart = prefixEnd; suffixStart <= word.length; suffixStart++) {
                let prefix = word.substring(0, prefixEnd);
                let stem = word.substring(prefixEnd, suffixStart);
                let suffix = word.substring(suffixStart);

                let prefixEntries = this.prefixes.getEntries(prefix);
                if (!prefixEntries.length) continue;
                let stemEntries = this.stems.getEntries(stem);
                if (!stemEntries.length) continue;
                let suffixEntries = this.suffixes.getEntries(suffix);
                if (!suffixEntries.length) continue;

                for (let stem of stemEntries) {
                    for (let prefix of prefixEntries) {
                        if (!this.ab.isValid(prefix.category, stem.category)) continue;

                        for (let suffix of suffixEntries) {
                            if (!this.ac.isValid(prefix.category, suffix.category) ||
                                !this.bc.isValid(stem.category, suffix.category)) continue;

                            results.push({
                                prefix: prefix.category === 'Pref-0' ? null : prefix,
                                stem,
                                suffix: suffix.category === 'Suff-0' ? null : suffix,
                            });
                        }
                    }
                }
            }
        }
        return results;
    }

    static async load(): Promise<Lexicon> {
        console.log('Loading data...');
        let startTime = performance.now();
        let [prefixes, stems, suffixes] = await Promise.all(
            ['prefixes', 'stems', 'suffixes'].map(
                name =>
                    fetch(`${this.BASE_URL}/dict${name}.txt`)
                        .then(r => r.text())
                        .then(parseDictFile)
                        .then(lines => new Dict(lines))
            )
        );
        let [ab, ac, bc] = await Promise.all(
            ['ab', 'ac', 'bc'].map(
                name =>
                    fetch(`${this.BASE_URL}/table${name}.txt`)
                        .then(r => r.text())
                        .then(parseTableFile)
                        .then(lines => new Table(lines))
            )
        );
        let endTime = performance.now();
        console.log(`Loaded data in ${((endTime - startTime) / 1000).toFixed(2)}s`);
        return new Lexicon(prefixes, stems, suffixes, ab, ac, bc);
    }
}

export type Word = {
    prefix: DictEntry | null;
    stem: DictEntry;
    suffix: DictEntry | null;
}

export type Component = 'prefix' | 'stem' | 'suffix';

export const COMPONENTS = Object.freeze(['prefix', 'stem', 'suffix'] as const);
