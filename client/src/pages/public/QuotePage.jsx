import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
  ShieldCheck,
  Layout,
  Layers,
  ShoppingBag,
  Cpu,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { formatPrice, getServicePricing } from '../../config/pricing';
import SEO from '../../components/common/SEO';

export default function QuotePage() {
  const [searchParams] = useSearchParams();
  const { language, t, isRtl } = useLanguage();

  const serviceParam = searchParams.get('service');

  const defaultServiceMap = {
    'landing-pages': 'Landing Pages',
    dashboards: 'Dashboards & SaaS',
    ecommerce: 'E-commerce',
  };

  const initialService = defaultServiceMap[serviceParam] || 'Landing Pages';

  const [formData, setFormData] = useState({
    client_name: '',
    project_name: '',
    service_type: initialService,
    description: '',
    budget: `500 - 1,500 ${language === 'ar' ? 'د.م.' : 'MAD'}`,
    email: '',
    phone: '',
    timeline: '2-3 Weeks',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync service if query parameter changes
  useEffect(() => {
    if (serviceParam && defaultServiceMap[serviceParam]) {
      setFormData((prev) => ({
        ...prev,
        service_type: defaultServiceMap[serviceParam],
      }));
    }
  }, [serviceParam]);

  const serviceOptions = [
    { label: 'Landing Pages', icon: Layout, desc: `High-converting & fast (from ${formatPrice(getServicePricing().landingPages.startingPrice, language)})` },
    { label: 'Dashboards & SaaS', icon: Layers, desc: `Fullstack web app & analytics (from ${formatPrice(getServicePricing().dashboards.startingPrice, language)})` },
    { label: 'E-commerce', icon: ShoppingBag, desc: `Custom stores & checkout (from ${formatPrice(getServicePricing().ecommerce.startingPrice, language)})` },
    { label: 'Custom MERN Platform', icon: Cpu, desc: 'Bespoke full-stack engineering' },
  ];

  const budgetOptions = [
    `400 - 800 ${language === 'ar' ? 'د.م.' : 'MAD'}`,
    `800 - 1,500 ${language === 'ar' ? 'د.م.' : 'MAD'}`,
    `1,500 - 3,000 ${language === 'ar' ? 'د.م.' : 'MAD'}`,
    `3,000 - 5,000+ ${language === 'ar' ? 'د.م.' : 'MAD'}`,
  ];

  const timelineOptions = [
    'Urgent (Under 1 week)',
    '1-2 Weeks',
    '2-4 Weeks',
    'Flexible / Milestone-based',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      await api.quotes.submit(formData);
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit quote request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title={t('seo.quote.title')}
        description={t('seo.quote.description')}
        locale={language}
        url={`/${language}/quote`}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-brand-subtle px-3 py-1 rounded-full inline-block">
          {t('nav.getQuote')}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink-primary tracking-tight">
          {t('quote.title')}
        </h1>
        <p className="text-sm sm:text-base text-ink-secondary leading-relaxed font-medium">
          {t('quote.subtitle')}
        </p>
        <div className="rounded-2xl border border-brand-primary/20 bg-brand-subtle/60 px-4 py-3 text-left text-[11px] sm:text-xs text-brand-dark leading-relaxed">
          {t('quote.form.pricingNotice')}
        </div>
      </div>

      {submitted ? (
        /* Success Screen */
        <div className="bg-surface-card rounded-3xl p-8 sm:p-12 border border-surface-muted shadow-elevated text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-3xl bg-brand-subtle text-brand-primary flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-brand-accent" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-ink-primary">
              {t('quote.form.successTitle')}
            </h2>
            <p className="text-sm text-ink-secondary max-w-md mx-auto leading-relaxed">
              {t('quote.form.successMessage')}
            </p>
          </div>

          <div className="bg-surface-elevated rounded-2xl p-6 border border-surface-muted max-w-md mx-auto text-start space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-ink-muted">Client:</span>
              <span className="font-bold text-ink-primary">{formData.client_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Project:</span>
              <span className="font-bold text-ink-primary">{formData.project_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Service:</span>
              <span className="font-bold text-brand-dark">{formData.service_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Preferred Budget:</span>
              <span className="font-bold text-ink-primary">{formData.budget}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Contact Email:</span>
              <span className="font-bold text-ink-primary">{formData.email}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  client_name: '',
                  project_name: '',
                  service_type: 'Landing Pages',
                  description: '',
                  budget: `500 - 1,500 ${language === 'ar' ? 'د.م.' : 'MAD'}`,
                  email: '',
                  phone: '',
                  timeline: '2-3 Weeks',
                });
              }}
              className="px-6 py-3 rounded-xl text-xs font-bold text-brand-dark bg-surface-elevated hover:bg-surface-muted transition-colors"
            >
              {t('quote.form.submitAnother')}
            </button>

            <Link
              to={`/${language}`}
              className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-brand-dark hover:bg-brand-primary transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      ) : (
        /* Form Card */
        <form
          onSubmit={handleSubmit}
          className="bg-surface-card rounded-3xl p-6 sm:p-10 border border-surface-muted shadow-elevated space-y-8"
        >
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Client Name */}
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark">
              1. Your Information *
            </label>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-ink-primary">
                {t('quote.form.clientName')} *
              </label>
              <input
                type="text"
                required
                maxLength={100}
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                placeholder={t('quote.form.clientNamePlaceholder')}
                className="w-full px-4 py-3 rounded-xl text-xs border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/40"
              />
            </div>
          </div>

          {/* 2. Service Picker */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark">
              2. Select Service Type *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {serviceOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = formData.service_type === opt.label;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setFormData({ ...formData, service_type: opt.label })}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border text-start transition-all ${
                      isSelected
                        ? 'border-brand-primary bg-brand-subtle/70 shadow-sm ring-2 ring-brand-primary/20'
                        : 'border-surface-muted bg-surface-elevated/40 hover:bg-surface-elevated hover:border-surface-muted/90'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isSelected
                          ? 'bg-brand-primary text-white'
                          : 'bg-surface-card text-brand-primary border border-surface-muted'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isSelected ? 'text-brand-dark' : 'text-ink-primary'}`}>
                        {opt.label}
                      </p>
                      <p className="text-[11px] text-ink-muted mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Project Name & Description */}
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark">
              3. Project Details *
            </label>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-ink-primary">
                {t('quote.form.projectName')} *
              </label>
              <input
                type="text"
                required
                value={formData.project_name}
                onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                placeholder={t('quote.form.projectNamePlaceholder')}
                className="w-full px-4 py-3 rounded-xl text-xs border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-ink-primary">
                {t('quote.form.description')} *
              </label>
              <textarea
                required
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('quote.form.descriptionPlaceholder')}
                className="w-full px-4 py-3 rounded-xl text-xs border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/40 leading-relaxed"
              />
            </div>
          </div>

          {/* 4. Budget & Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-ink-primary">
                {t('quote.form.budget')} *
              </label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-xs border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/40"
              >
                {budgetOptions.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-ink-primary">
                {t('quote.form.timeline')}
              </label>
              <select
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-xs border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/40"
              >
                {timelineOptions.map((tOpt) => (
                  <option key={tOpt} value={tOpt}>
                    {tOpt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 5. Contact Info */}
          <div className="space-y-4 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark">
              4. Contact Coordinates *
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-ink-primary">
                  {t('quote.form.email')} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t('quote.form.emailPlaceholder')}
                  className="w-full px-4 py-3 rounded-xl text-xs border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-ink-primary">
                  {t('quote.form.phone')}
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t('quote.form.phonePlaceholder')}
                  className="w-full px-4 py-3 rounded-xl text-xs border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/40"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-surface-muted/70 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <ShieldCheck className="w-4 h-4 text-brand-primary" />
              <span>Strictly confidential. No spam, ever.</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-xs font-bold text-white bg-brand-dark hover:bg-brand-primary active:scale-95 shadow-soft hover:shadow-glow transition-all duration-200 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-brand-accent" />
              <span>{submitting ? t('quote.form.submitting') : t('quote.form.submit')}</span>
            </button>
          </div>
        </form>
      )}
      </div>
    </>
  );
}
