import { groupBy } from '../utils.ts';

export type DictEntry = {
    withoutVowels: string;
    withVowels: string;
    category: string;
    description: string;
};

export type TableEntry = [category1: string, category2: string];

export class Dict {
    private readonly withoutVowelsMap: Map<string, DictEntry[]>;
    private readonly withVowelsMap: Map<string, DictEntry[]>;

    constructor(entries: Iterable<DictEntry>) {
        this.withoutVowelsMap = groupBy(entries, entry => entry.withoutVowels);
        this.withVowelsMap = groupBy(entries, entry => entry.withVowels);
    }

    getEntries(str: string) {
        return Array.from(new Set([
            ...(this.withVowelsMap.get(str) ?? []),
            ...(this.withoutVowelsMap.get(str) ?? []),
        ]));
    }
}

export class Table {
    private table = new Set<string>();

    constructor(entries: Iterable<TableEntry>) {
        for (let entry of entries) {
            this.table.add(entry.join(' '));
        }
    }

    isValid(category1: string, category2: string) {
        return this.table.has(`${category1} ${category2}`);
    }
}

function* parseFile(contents: string, numFields: number): Generator<string[]> {
    for (let line of contents.split(/\r?\n/)) {
        if (!line || line.startsWith(';')) {
            continue;
        }

        let fields: string[] = [];
        let i = 0;
        let start = 0;

        while (fields.length < numFields - 1 && i < line.length) {
            if (line[i] === '\t') {
                fields.push(line.slice(start, i));
                i++;
                start = i;
            } else if (line[i] === ' ') {
                let spaceStart = i;
                while (i < line.length && line[i] === ' ') i++;
                fields.push(line.slice(start, spaceStart));
                start = i;
            } else {
                i++;
            }
        }

        // Add final field
        fields.push(line.slice(start));

        yield fields;
    }
}

export function* parseDictFile(contents: string): Generator<DictEntry> {
    for (let fields of parseFile(contents, 4)) {
        if (fields.length < 4) {
            throw new Error('Missing fields in dict line: ' + JSON.stringify(fields));
        }
        let [withoutVowels, withVowels, category, description] = fields;
        yield { withoutVowels, withVowels, category, description };
    }
}

export function* parseTableFile(contents: string): Generator<TableEntry> {
    for (let fields of parseFile(contents, 2)) {
        if (fields.length < 2) {
            throw new Error('Missing fields in table line: ' + JSON.stringify(fields));
        }
        yield [fields[0], fields[1]];
    }
}
