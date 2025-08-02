import { Lexicon, type Word } from '../lib/lexicon';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { arabicToAscii } from '../lib/buckwalter.ts';
import { normalize } from '../lib/orthography.ts';

export default function WordSearch({ search, onSearchChange, onResults }: {
    search: string;
    onSearchChange: (search: string) => void;
    onResults: (words: Word[], searchDuration: number) => void;
}) {
    let { t } = useTranslation();

    let [lexicon, setLexicon] = useState<Lexicon | null>(null);

    let normalizedSearch = useMemo(() => normalize(search), [search]);
    let error = search && !normalizedSearch ? t('wordSearchError') : null;

    useEffect(() => {
        Lexicon.load().then(lexicon => setLexicon(lexicon));
    }, []);

    useEffect(() => {
        let startTime = performance.now();
        let results: Word[];
        if (lexicon !== null) {
            results = lexicon.lookUpWord(arabicToAscii(normalizedSearch));
        } else {
            results = [];
        }
        let endTime = performance.now();
        onResults(results, endTime - startTime);
    }, [lexicon, normalizedSearch, onResults]);

    return (
        <div className="word-search">
            {error !== null && (
                <div className="word-search-error" aria-live="assertive">{error}</div>
            )}
            <div className="word-search-field">
                <span>{t('wordSearchBefore')}</span>
                <input
                    lang="ar"
                    dir="rtl"
                    placeholder="كلمة"
                    value={search}
                    onInput={event => onSearchChange(event.currentTarget.value)}
                    autoFocus={true}
                    aria-invalid={error !== null}
                    aria-errormessage={error ?? undefined}
                />
                <span>{t('wordSearchAfter')}</span>
            </div>
        </div>
    );
}
