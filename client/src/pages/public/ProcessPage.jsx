import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Layers,
  Code2,
  Rocket,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/common/SEO';

export default function ProcessPage() {
  const { language, t, isRtl } = useLanguage();
  const [openFaq, setOpenFaq] = useState(0);

  const stepIcons = [Compass, Layers, Code2, Rocket];

  return (
    <>
      <SEO
        title={t('seo.process.title')}
        description={t('seo.process.description')}
        locale={language}
        url={`/${language}/process`}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-brand-subtle px-3 py-1 rounded-full inline-block mb-3">
          {t('nav.process')}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink-primary tracking-tight leading-tight">
          {t('process.title')}
        </h1>
        <p className="text-base sm:text-lg text-ink-secondary mt-4 leading-relaxed font-medium">
          {t('process.subtitle')}
        </p>
      </div>

      {/* 4 Steps Detailed Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        {[0, 1, 2, 3].map((idx) => {
          const step = t(`process.steps.${idx}`);
          const Icon = stepIcons[idx];
          return (
            <div
              key={idx}
              className="bg-surface-card rounded-3xl p-8 border border-surface-muted shadow-card hover:shadow-elevated transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-subtle text-brand-primary flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-3xl font-black font-mono text-brand-accent/50">
                  {step.number}
                </span>
              </div>

              <div className="space-y-3">
                <h2 className="text-xl font-bold text-ink-primary">
                  {step.title}
                </h2>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-surface-muted/60 flex items-center gap-2 text-xs font-semibold text-brand-dark">
                <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0" />
                <span>Strict quality & deadline guarantee</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="max-w-4xl mx-auto space-y-8 pt-8 border-t border-surface-muted">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">
            {t('process.faqTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary mt-2">
            Everything you need to know about working together.
          </p>
        </div>

        <div className="space-y-3">
          {[0, 1, 2, 3].map((faqIdx) => {
            const faq = t(`process.faqs.${faqIdx}`);
            const isOpen = openFaq === faqIdx;
            return (
              <div
                key={faqIdx}
                className="bg-surface-card rounded-2xl border border-surface-muted overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : faqIdx)}
                  className="w-full flex items-center justify-between p-5 text-start font-bold text-ink-primary text-sm hover:bg-surface-elevated transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-brand-primary shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-ink-secondary leading-relaxed border-t border-surface-muted/40 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="bg-brand-dark rounded-3xl p-8 sm:p-12 text-white text-center space-y-6">
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Ready to initiate Step 1 for your project?
        </h3>
        <p className="text-sm text-surface-bg/80 max-w-xl mx-auto">
          Send your project brief today and receive a tailored scope within 24 hours.
        </p>
        <Link
          to={`/${language}/quote`}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs font-bold text-brand-dark bg-brand-accent hover:bg-white transition-all shadow-glow"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('hero.ctaQuote')}</span>
          <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
        </Link>
      </div>
      </div>
    </>
  );
}
