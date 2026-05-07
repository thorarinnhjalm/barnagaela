import { createContext, useContext, useState, useEffect } from 'react';
import en from './locales/en';
import is from './locales/is';
import pl from './locales/pl';

const LOCALES = { en, is, pl };
const STORAGE_KEY = 'barnaglaedur_lang';
const DEFAULT_LANG = 'is';

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && LOCALES[stored]) return stored;
    } catch {}
    return DEFAULT_LANG;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = LOCALES[lang] || LOCALES[DEFAULT_LANG];

  return (
    <I18nContext.Provider value={{ lang, setLang, t, locales: Object.keys(LOCALES) }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
