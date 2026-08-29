import React, { useState, useEffect } from 'react';
import {
  FileEdit,
  Save,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
  Globe,
  Bot,
  MessageSquare,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { getServicePricing } from '../../config/pricing';

export default function AdminContentPage() {
  const { language, t } = useLanguage();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Telegram test state
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [telegramResult, setTelegramResult] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.content
      .getPublic()
      .then((data) => setContent(data.content))
      .catch((err) => setSaveError(t('admin.content.loadFailed') + ': ' + err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setSaveError('');

    try {
      await api.content.update(content);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err.message || t('admin.content.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const defaultServicePricing = getServicePricing();

  const handleTestTelegram = async () => {
    setTestingTelegram(true);
    setTelegramResult(null);
    try {
      const res = await api.content.testTelegram();
      setTelegramResult(res);
    } catch (err) {
      setTelegramResult({ success: false, error: err.message });
    } finally {
      setTestingTelegram(false);
    }
  };

  if (loading || !content) {
    return (
      <div className="text-center py-20">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-ink-muted">{t('admin.content.loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink-primary tracking-tight">
            {t('admin.content.title')}
          </h1>
          <p className="text-xs text-ink-secondary mt-1">
            {t('admin.content.subtitle')}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-dark hover:bg-brand-primary active:scale-95 transition-all shadow-sm disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? t('admin.content.saving') : t('admin.content.saveChangesBtn')}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-brand-subtle text-brand-dark text-xs flex items-center gap-2 border border-brand-primary/20 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
          <span>{t('admin.content.saveSuccess')}</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Availability Status */}
        <div className="bg-surface-card rounded-3xl p-6 sm:p-7 border border-surface-muted shadow-soft space-y-4">
          <h2 className="text-sm font-bold text-ink-primary flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
            <span>{t('admin.content.availabilitySection')}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block font-semibold text-ink-primary">{t('admin.content.statusTextEn')}</label>
              <input
                type="text"
                value={content.hero?.en?.badge || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: {
                      ...content.hero,
                      en: { ...content.hero.en, badge: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-ink-primary">{t('admin.content.statusTextAr')}</label>
              <input
                type="text"
                value={content.hero?.ar?.badge || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: {
                      ...content.hero,
                      ar: { ...content.hero.ar, badge: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Hero Headlines & Copy */}
        <div className="bg-surface-card rounded-3xl p-6 sm:p-7 border border-surface-muted shadow-soft space-y-6">
          <h2 className="text-sm font-bold text-ink-primary flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-primary" />
            <span>{t('admin.content.heroSection')}</span>
          </h2>

          {/* English Copy */}
          <div className="space-y-3 p-4 rounded-2xl bg-surface-elevated/70 border border-surface-muted/60 text-xs">
            <span className="font-bold text-brand-dark uppercase tracking-wider text-[10px]">
              {t('admin.content.englishCopy')}
            </span>
            <div className="space-y-1">
              <label className="block font-semibold text-ink-primary">{t('admin.content.headlineTitle')}</label>
              <input
                type="text"
                value={content.hero?.en?.title || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: {
                      ...content.hero,
                      en: { ...content.hero.en, title: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-muted bg-white focus:outline-none font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-ink-primary">{t('admin.content.subtitleParagraph')}</label>
              <textarea
                rows={3}
                value={content.hero?.en?.subtitle || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: {
                      ...content.hero,
                      en: { ...content.hero.en, subtitle: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-muted bg-white focus:outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Arabic Copy */}
          <div className="space-y-3 p-4 rounded-2xl bg-surface-elevated/70 border border-surface-muted/60 text-xs text-start">
            <span className="font-bold text-brand-dark uppercase tracking-wider text-[10px]">
              {t('admin.content.arabicCopy')}
            </span>
            <div className="space-y-1">
              <label className="block font-semibold text-ink-primary">{t('admin.content.arabicHeadline')}</label>
              <input
                type="text"
                value={content.hero?.ar?.title || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: {
                      ...content.hero,
                      ar: { ...content.hero.ar, title: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-muted bg-white focus:outline-none font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-ink-primary">{t('admin.content.arabicSubtitle')}</label>
              <textarea
                rows={3}
                value={content.hero?.ar?.subtitle || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: {
                      ...content.hero,
                      ar: { ...content.hero.ar, subtitle: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-muted bg-white focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Pricing & Timelines */}
        <div className="bg-surface-card rounded-3xl p-6 sm:p-7 border border-surface-muted shadow-soft space-y-5">
          <h2 className="text-sm font-bold text-ink-primary flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-brand-primary" />
            <span>{t('admin.content.pricingSection')}</span>
          </h2>

          <div className="rounded-2xl border border-brand-primary/15 bg-brand-subtle/60 p-3 text-[11px] text-brand-dark leading-relaxed">
            {t('admin.content.pricingNotice')}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            {/* Landing Pages */}
            <div className="p-4 rounded-2xl bg-surface-elevated border border-surface-muted space-y-3">
              <span className="font-bold text-brand-dark block">{t('admin.content.landingPagesCard')}</span>
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-ink-muted">{t('admin.content.startingPrice')}</label>
                <input
                  type="number"
                  value={content.services_pricing?.landingPages?.startingPrice ?? defaultServicePricing.landingPages.startingPrice}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      services_pricing: {
                        ...content.services_pricing,
                        landingPages: {
                          ...content.services_pricing.landingPages,
                          startingPrice: parseInt(e.target.value, 10),
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-surface-muted bg-white font-mono font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-ink-muted">{t('admin.content.timelineEn')}</label>
                <input
                  type="text"
                  value={content.services_pricing?.landingPages?.timelineEn || '3-5 Days'}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      services_pricing: {
                        ...content.services_pricing,
                        landingPages: {
                          ...content.services_pricing.landingPages,
                          timelineEn: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-surface-muted bg-white"
                />
              </div>
            </div>

            {/* Dashboards */}
            <div className="p-4 rounded-2xl bg-surface-elevated border border-surface-muted space-y-3">
              <span className="font-bold text-brand-dark block">{t('admin.content.dashboardsCard')}</span>
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-ink-muted">{t('admin.content.startingPrice')}</label>
                <input
                  type="number"
                  value={content.services_pricing?.dashboards?.startingPrice ?? defaultServicePricing.dashboards.startingPrice}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      services_pricing: {
                        ...content.services_pricing,
                        dashboards: {
                          ...content.services_pricing.dashboards,
                          startingPrice: parseInt(e.target.value, 10),
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-surface-muted bg-white font-mono font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-ink-muted">{t('admin.content.timelineEn')}</label>
                <input
                  type="text"
                  value={content.services_pricing?.dashboards?.timelineEn || '2-3 Weeks'}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      services_pricing: {
                        ...content.services_pricing,
                        dashboards: {
                          ...content.services_pricing.dashboards,
                          timelineEn: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-surface-muted bg-white"
                />
              </div>
            </div>

            {/* E-Commerce */}
            <div className="p-4 rounded-2xl bg-surface-elevated border border-surface-muted space-y-3">
              <span className="font-bold text-brand-dark block">{t('admin.content.ecommerceCard')}</span>
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-ink-muted">{t('admin.content.startingPrice')}</label>
                <input
                  type="number"
                  value={content.services_pricing?.ecommerce?.startingPrice ?? defaultServicePricing.ecommerce.startingPrice}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      services_pricing: {
                        ...content.services_pricing,
                        ecommerce: {
                          ...content.services_pricing.ecommerce,
                          startingPrice: parseInt(e.target.value, 10),
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-surface-muted bg-white font-mono font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-ink-muted">{t('admin.content.timelineEn')}</label>
                <input
                  type="text"
                  value={content.services_pricing?.ecommerce?.timelineEn || '1-2 Weeks'}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      services_pricing: {
                        ...content.services_pricing,
                        ecommerce: {
                          ...content.services_pricing.ecommerce,
                          timelineEn: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-surface-muted bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: External Contact Coordinates */}
        <div className="bg-surface-card rounded-3xl p-6 sm:p-7 border border-surface-muted shadow-soft space-y-4">
          <h2 className="text-sm font-bold text-ink-primary flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-primary" />
            <span>{t('admin.content.contactSection')}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block font-semibold text-ink-primary">{t('admin.content.whatsapp')}</label>
              <input
                type="text"
                value={content.contact_links?.whatsapp || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact_links: { ...content.contact_links, whatsapp: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-ink-primary">{t('admin.content.contactEmail')}</label>
              <input
                type="email"
                value={content.contact_links?.email || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact_links: { ...content.contact_links, email: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-ink-primary">{t('admin.content.linkedin')}</label>
              <input
                type="url"
                value={content.contact_links?.linkedin || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact_links: { ...content.contact_links, linkedin: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-ink-primary">{t('admin.content.github')}</label>
              <input
                type="url"
                value={content.contact_links?.github || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact_links: { ...content.contact_links, github: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 5: External Telegram Bot Real-time Alerts */}
        <div className="bg-surface-card rounded-3xl p-6 sm:p-7 border border-surface-muted shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-ink-primary flex items-center gap-2">
              <Bot className="w-4 h-4 text-brand-primary" />
              <span>{t('admin.content.telegramSection')}</span>
            </h2>

            <button
              type="button"
              onClick={handleTestTelegram}
              disabled={testingTelegram}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-surface-elevated hover:bg-brand-subtle text-brand-dark border border-surface-muted transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-brand-primary" />
              <span>{testingTelegram ? t('admin.content.sendingTelegram') : t('admin.content.testTelegramBtn')}</span>
            </button>
          </div>

          <p className="text-xs text-ink-secondary leading-relaxed">
            {t('admin.content.telegramDesc')} <code>TELEGRAM_BOT_TOKEN</code> {t('admin.content.telegramAnd')} <code>TELEGRAM_CHAT_ID</code> {t('admin.content.telegramDescEnd')}
          </p>

          {telegramResult && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                telegramResult.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {telegramResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              )}
              <span>
                {telegramResult.simulated
                  ? t('admin.content.telegramSimulated')
                  : telegramResult.success
                  ? t('admin.content.telegramSuccess')
                  : `${t('admin.content.telegramError')}: ${telegramResult.error}`}
              </span>
            </div>
          )}
        </div>

        {/* Floating Save button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs font-bold text-white bg-brand-dark hover:bg-brand-primary active:scale-95 transition-all shadow-soft disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? t('admin.content.saving') : t('admin.content.saveChangesBtn')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
