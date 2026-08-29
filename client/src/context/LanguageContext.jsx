import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import enTranslations from '../locales/en.json';
import arTranslations from '../locales/ar.json';

const translations = {
  en: enTranslations,
  ar: arTranslations,
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Detect language from URL path (e.g., /ar/... or /en/...)
  const getLangFromPath = () => {
    const segments = location.pathname.split('/').filter(Boolean);
    if (segments[0] === 'ar') return 'ar';
    if (segments[0] === 'en') return 'en';
    const saved = localStorage.getItem('digitway_lang');
    return saved === 'ar' ? 'ar' : 'en';
  };

  const [language, setLanguage] = useState(getLangFromPath);

  // Sync state when URL pathname changes — but ONLY for localized public
  // routes (/en/... or /ar/...). Admin routes (/admin/...) carry no locale
  // prefix, so the language there is driven exclusively by the persisted
  // localStorage choice. Reading localStorage here for admin paths caused
  // the switcher to instantly revert (stale value read before the
  // persistence effect below had run).
  useEffect(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    if ((segments[0] === 'ar' || segments[0] === 'en') && segments[0] !== language) {
      setLanguage(segments[0]);
    }
  }, [location.pathname]);

  // Apply HTML dir and lang attributes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('digitway_lang', language);
  }, [language]);

  // Translation helper function
  const t = (path) => {
    const keys = path.split('.');
    let current = translations[language];

    for (const key of keys) {
      if (!current || current[key] === undefined) {
        // Fallback to English if translation is missing in Arabic
        let fallback = translations.en;
        for (const fKey of keys) {
          if (!fallback || fallback[fKey] === undefined) return path;
          fallback = fallback[fKey];
        }
        return fallback;
      }
      current = current[key];
    }

    return current;
  };

  // Switch language and update URL seamlessly
  const switchLanguage = (newLang) => {
    if (newLang === language) return;
    setLanguage(newLang);

    const segments = location.pathname.split('/').filter(Boolean);
    let newPath = '';

    if (segments.length === 0) {
      newPath = `/${newLang}`;
    } else if (segments[0] === 'en' || segments[0] === 'ar') {
      segments[0] = newLang;
      newPath = `/${segments.join('/')}`;
    } else {
      // admin or root
      if (segments[0] === 'admin') {
        // Admin routes are not locale-prefixed: stay on the exact same
        // admin page. The new language is applied instantly via state and
        // persisted to localStorage by the effect above.
        newPath = `/${segments.join('/')}`;
      } else {
        newPath = `/${newLang}/${segments.join('/')}`;
      }
    }

    navigate(newPath + location.search);
  };

  const isRtl = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, isRtl, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
