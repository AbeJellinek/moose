import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locale/en.json';
import ar from './locale/ar.json';

const LOCAL_STORAGE_KEY_LANGUAGE = 'language';

export function initI18n() {
    i18next.use(initReactI18next).init({
        lng: getLanguageTag(getPersistedLanguage()),
        debug: import.meta.env.DEV,
        resources: {
            en: { translation: en },
            ar: { translation: ar },
        },
        interpolation: {
            escapeValue: false,
        },
    });
}

export function toggleLanguage() {
    let newLanguage = i18next.language === 'en' ? 'ar' : 'en';
    setPersistedLanguage(newLanguage);
    i18next.changeLanguage(getLanguageTag(newLanguage));
}

function getPersistedLanguage(): string {
    let language = window.localStorage.getItem(LOCAL_STORAGE_KEY_LANGUAGE);
    if (language === 'en' || language === 'ar') {
        return language;
    }
    return 'en';
}

function setPersistedLanguage(language: string) {
    window.localStorage.setItem(LOCAL_STORAGE_KEY_LANGUAGE, language);
}

function getLanguageTag(language: string) {
    // Add Jordan region so we get Eastern Arabic numerals
    if (language == 'ar') return 'ar-JO';
    return language;
}
