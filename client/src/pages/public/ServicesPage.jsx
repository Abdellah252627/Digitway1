import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Layers, ShoppingBag, ArrowRight, CheckCircle2, Clock, Zap, Shield, Sparkles, Cpu, Award } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { formatPrice, getServicePricing } from '../../config/pricing';
import SEO from '../../components/common/SEO';

export default function ServicesPage() {
  const { language, t, isRtl } = useLanguage();
  const [dynamicPricing, setDynamicPricing] = useState(null);

  useEffect(() => {
    api.content
      .getPublic()
      .then((data) => setDynamicPricing(data.content?.services_pricing))
      .catch((err) => console.warn('Could not fetch pricing:', err.message));
  }, []);

  const pricing = dynamicPricing || getServicePricing();

  const serviceList = [
    {
      slug: 'landing-pages',
      icon: Layout,
      title: t('services.landingPages.title'),
      tagline: t('services.landingPages.tagline'),
      price: formatPrice(pricing.landingPages.startingPrice, language),
      timeline: language === 'ar' ? pricing.landingPages.timelineAr : pricing.landingPages.timelineEn,
      description: t('services.landingPages.description'),
      includes: t('services.landingPages.includes'),
      ideal: t('services.landingPages.ideal'),
    },
    {
      slug: 'dashboards',
      icon: Layers,
      title: t('services.dashboards.title'),
      tagline: t('services.dashboards.tagline'),
      price: formatPrice(pricing.dashboards.startingPrice, language),
      timeline: language === 'ar' ? pricing.dashboards.timelineAr : pricing.dashboards.timelineEn,
      description: t('services.dashboards.description'),
      includes: t('services.dashboards.includes'),
      ideal: t('services.dashboards.ideal'),
    },
    {
      slug: 'ecommerce',
      icon: ShoppingBag,
      title: t('services.ecommerce.title'),
      tagline: t('services.ecommerce.tagline'),
      price: formatPrice(pricing.ecommerce.startingPrice, language),
      timeline: language === 'ar' ? pricing.ecommerce.timelineAr : pricing.ecommerce.timelineEn,
      description: t('services.ecommerce.description'),
      includes: t('services.ecommerce.includes'),
      ideal: t('services.ecommerce.ideal'),
    },
  ];

  return (
    <>
      <SEO
        title={t('seo.services.title')}
        description={t('seo.services.description')}
        locale={language}
        url={`/${language}/services`}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-brand-subtle px-3 py-1 rounded-full inline-block mb-3">
            {t('nav.services')}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-ink-primary tracking-tight leading-tight">
            {t('services.title')}
          </h1>
          <p className="text-base sm:text-lg text-ink-secondary mt-4 leading-relaxed font-medium">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Services List Cards */}
        <div className="space-y-10">
          {serviceList.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.slug}
                className="bg-surface-card rounded-3xl p-6 sm:p-10 border border-surface-muted shadow-card hover:shadow-elevated transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                {/* Left Details */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-brand-subtle text-brand-primary flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-ink-primary">
                        {service.title}
                      </h2>
                      <p className="text-xs text-brand-primary font-semibold">
                        {service.tagline}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-ink-secondary leading-relaxed">
                    {service.description}
                  </p>

                  <div className="bg-surface-elevated/70 rounded-2xl p-4 border border-surface-muted/60">
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">
                      {t('services.whatsIncluded')}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Array.isArray(service.includes) &&
                        service.includes.slice(0, 4).map((inc, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-ink-secondary">
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-accent mt-0.5 shrink-0" />
                            <span>{inc}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="text-xs text-ink-muted">
                    <span className="font-bold text-ink-primary">{t('services.idealFor')}: </span>
                    <span>{service.ideal}</span>
                  </div>
                </div>

                {/* Right Pricing Box & CTAs */}
                <div className="lg:col-span-5 bg-surface-elevated rounded-2xl p-6 border border-surface-muted/80 flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-baseline justify-between border-b border-surface-muted/60 pb-3">
                      <span className="text-xs font-bold uppercase text-ink-muted">
                        {t('services.startingAt')}
                      </span>
                      <span className="text-3xl font-black text-brand-dark font-mono">
                        {service.price}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-ink-secondary">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-brand-primary" />
                        <span>{t('services.estimatedTimeline')}</span>
                      </span>
                      <span className="font-bold text-brand-dark">{service.timeline}</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Link
                      to={`/${language}/services/${service.slug}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-ink-primary bg-surface-card hover:bg-white border border-surface-muted shadow-sm transition-colors"
                    >
                      <span>{t('services.learnMore')}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                    </Link>

                    <Link
                      to={`/${language}/quote?service=${service.slug}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-white bg-brand-dark hover:bg-brand-primary shadow-soft hover:shadow-glow transition-all duration-200"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
                      <span>{t('services.requestService')}</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Value Pillars */}
        <div className="pt-10 border-t border-surface-muted">
          <h2 className="text-center text-xl font-bold text-ink-primary mb-8">
            The Digitway Advantage: Why Clients Choose a Senior MERN Engineer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-card rounded-2xl p-6 border border-surface-muted shadow-soft">
              <Zap className="w-8 h-8 text-brand-accent mb-3" />
              <h4 className="text-sm font-bold text-ink-primary mb-1">Direct Engineering Contact</h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                No account managers or lost communication. You speak directly with the developer engineering your product.
              </p>
            </div>
            <div className="bg-surface-card rounded-2xl p-6 border border-surface-muted shadow-soft">
              <Cpu className="w-8 h-8 text-brand-primary mb-3" />
              <h4 className="text-sm font-bold text-ink-primary mb-1">Modern Scalable Architecture</h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Built with React, Node, Tailwind, and optimized databases. Clean, modular code designed to scale without tech debt.
              </p>
            </div>
            <div className="bg-surface-card rounded-2xl p-6 border border-surface-muted shadow-soft">
              <Shield className="w-8 h-8 text-brand-dark mb-3" />
              <h4 className="text-sm font-bold text-ink-primary mb-1">Full IP & Code Ownership</h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                You own 100% of your source code, GitHub repository, and data. Zero platform lock-ins or recurring licensing fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
