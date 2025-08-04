import { useTranslation } from 'react-i18next';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import WordList from './WordList.tsx';
import { type Word } from '../lib/lexicon';
import { toggleLanguage } from '../i18n.ts';
import WordSearch from './WordSearch.tsx';
import logoSVG from '../assets/logo.svg?inline';

export default function App() {
    let { t, i18n } = useTranslation();

    let [search, setSearch] = useState(() => getSearchFromURL());
    let [results, setResults] = useState<Word[]>([]);
    let [searchDuration, setSearchDuration] = useState(0);

    let title = search ? t('pageTitleWithWord', { word: search }) : t('pageTitle');

    useEffect(() => {
        let pathname = search ? `/word/${search}` : '/';
        window.history.replaceState(null, '', pathname);
    }, [search]);

    useEffect(() => {
        document.title = title;
    }, [title]);

    useEffect(() => {
        document.body.dir = i18n.dir();
    }, [i18n, i18n.language]);

    let handleResults = useCallback((words: Word[], searchDuration: number) => {
        setResults(words);
        setSearchDuration(searchDuration);
    }, [setResults, setSearchDuration]);

    return <>
        <main>
            <header>
                <a href="/" className="logo">
                    <img src={logoSVG} title={t('moose')} alt={t('logoAlt')} width="46" height="48"/>
                </a>
                <span className="colon">:</span>
                <span className="tagline">{t('tagline')}</span>

                {search && (
                    <span className="status">
                        {t('status', { count: results.length, milliseconds: searchDuration.toFixed(0) })}
                    </span>
                )}
                <button
                    className="toggle-language"
                    onClick={toggleLanguage}
                >
                    {t('toggleLanguage')}
                </button>
            </header>
            {search
                ? <WordList words={results}/>
                : <WelcomeMessage/>
            }
        </main>
        <WordSearch search={search} onSearchChange={setSearch} onResults={handleResults}/>
    </>;
}

function WelcomeMessage() {
    let { t } = useTranslation();
    return (
        <div className="message">
            <p className="welcome">{t('welcome1')}</p>
            <p>{t('welcome2')}</p>
        </div>
    );
}

function getSearchFromURL() {
    let search = window.location.pathname.match(/^\/word\/([^/]*)$/)?.[1];
    search ??= '';
    search = decodeURIComponent(search);
    return search;
}
