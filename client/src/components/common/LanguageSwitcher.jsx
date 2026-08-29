import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function LanguageSwitcher({ className = '' }) {
  const { language, switchLanguage, isRtl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'ar', label: 'Arabic', native: 'العربية', flag: '🇲🇦' },
  ];

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-muted/60 hover:bg-surface-muted text-ink-primary border border-brand-dark/10 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Switch language / تغيير اللغة"
      >
        <Globe className="w-3.5 h-3.5 text-brand-primary" />
        <span className="font-medium">{currentLang.native}</span>
        <ChevronDown className={`w-3 h-3 text-ink-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-40 rounded-xl bg-surface-card shadow-elevated border border-surface-muted py-1 z-50 animate-in fade-in zoom-in-95 duration-150`}
        >
          {languages.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  switchLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-start transition-colors ${
                  isSelected
                    ? 'bg-brand-subtle text-brand-dark font-bold'
                    : 'text-ink-primary hover:bg-surface-elevated font-medium'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{lang.flag}</span>
                  <span>{lang.native}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-brand-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
