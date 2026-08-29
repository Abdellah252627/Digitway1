import React from 'react';
import { ShieldCheck, Mail } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/common/SEO';

export default function PrivacyPage() {
  const { language, t } = useLanguage();

  return (
    <>
      <SEO
        title={t('seo.privacy.title')}
        description={t('seo.privacy.description')}
        locale={language}
        url={`/${language}/privacy`}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-subtle text-brand-primary">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-wider">{t('nav.privacy')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-primary tracking-tight">
          {t('privacy.title')}
        </h1>
      </div>

      {/* Content */}
      <div className="bg-surface-card rounded-3xl p-8 sm:p-12 border shadow-soft">
        <div className="space-y-8">
          <div>
            <p className="text-ink-secondary leading-relaxed">
              {t('privacy.intro')}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-ink-primary mb-3">{t('privacy.collectTitle')}</h2>
            <ul className="list-disc list-inside space-y-2 text-ink-secondary">
              <li>{t('privacy.collect1')}</li>
              <li>{t('privacy.collect2')}</li>
              <li>{t('privacy.collect3')}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-ink-primary mb-3">{t('privacy.useTitle')}</h2>
            <p className="text-ink-secondary leading-relaxed mb-3">{t('privacy.useIntro')}</p>
            <ul className="list-disc list-inside space-y-2 text-ink-secondary">
              <li>{t('privacy.use1')}</li>
              <li>{t('privacy.use2')}</li>
              <li>{t('privacy.use3')}</li>
              <li>{t('privacy.use4')}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-ink-primary mb-3">{t('privacy.shareTitle')}</h2>
            <p className="text-ink-secondary leading-relaxed">
              {t('privacy.shareText')}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-ink-primary mb-3">{t('privacy.securityTitle')}</h2>
            <p className="text-ink-secondary leading-relaxed">
              {t('privacy.securityText')}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-ink-primary mb-3">{t('privacy.rightsTitle')}</h2>
            <p className="text-ink-secondary leading-relaxed mb-3">{t('privacy.rightsIntro')}</p>
            <ul className="list-disc list-inside space-y-2 text-ink-secondary">
              <li>{t('privacy.rights1')}</li>
              <li>{t('privacy.rights2')}</li>
              <li>{t('privacy.rights3')}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-ink-primary mb-3">{t('privacy.deleteTitle')}</h2>
            <p className="text-ink-secondary leading-relaxed mb-3">
              {t('privacy.deleteIntro')}
            </p>
            <a
              href={`mailto:${t('privacy.deleteEmail')}`}
              className="inline-flex items-center gap-2 text-brand-primary font-bold hover:text-brand-dark transition-colors"
            >
              <Mail className="w-4 h-4" />
              {t('privacy.deleteEmail')}
            </a>
            <p className="text-ink-secondary leading-relaxed mt-3">
              {t('privacy.deleteOutro')}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-ink-primary mb-3">{t('privacy.updatesTitle')}</h2>
            <p className="text-ink-secondary leading-relaxed">
              {t('privacy.updatesText')}
            </p>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center mt-8 text-sm text-ink-secondary">
        <p>{t('privacy.lastUpdated')}</p>
      </div>
      </div>
    </>
  );
}
