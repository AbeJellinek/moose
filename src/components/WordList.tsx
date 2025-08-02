import React from 'react';
import { COMPONENTS, type Word } from '../lib/lexicon';
import { groupBy } from '../lib/utils.ts';
import { useTranslation } from 'react-i18next';
import { formatArabic, formatArabicJoined, formatEnglish, mergeEmptySuffix } from '../lib/lexicon/utils.ts';

export default function WordList({ words }: { words: Word[] }) {
    // Put the words with the fewest components at the top
    words = Array.from(words).sort((r1, r2) =>
        Object.values(r1).filter(Boolean).length -
        Object.values(r2).filter(Boolean).length);

    // Group words with identical English glosses
    let wordsByGloss = groupBy(
        words,
        word => JSON.stringify([
            formatEnglish(word, 'prefix'),
            formatEnglish(word, 'stem'),
            formatEnglish(word, 'suffix'),
        ])
    );

    return Array.from(wordsByGloss).map(([glossKey, results]) => (
        <GroupDefinition words={results} key={glossKey}/>
    ));
}

function GroupDefinition({ words }: { words: Word[] }) {
    return (
        <div className="definition">
            <div>
                {words.map((word, i) => (
                    <WordComponents word={word} lang="ar" key={i}/>
                ))}
            </div>
            {/* Use one English gloss for the whole group */}
            <WordComponents word={words[0]} lang="en"/>
            <Links word={words[0]}/>
        </div>
    );
}

function WordComponents({ word, lang }: { word: Word, lang: 'en' | 'ar' }) {
    if (lang === 'ar') {
        // When suffix only contains vowels, merge it into the stem to prevent
        // an empty component from appearing on hover
        word = mergeEmptySuffix(word);
    }
    let components = COMPONENTS
        .filter(component => !!word[component])
        .map(component => (
            <span
                className="component"
                data-component={component}
                key={component}
            >
                {lang == 'en' ? formatEnglish(word, component) : formatArabic(word, component)}
            </span>
        ));
    return <div className="components" lang={lang}>{components}</div>;
}

function Links({ word }: { word: Word }) {
    let { t } = useTranslation();
    return (
        <div className="links">
            <a
                href={`https://en.wiktionary.org/w/index.php?search=${encodeURIComponent(formatArabicJoined(word))}`}
                target="_blank"
                rel="noreferrer"
                title={t('searchWiktionary')}
                className="link-wiktionary"
            >W</a>
        </div>
    );
}
