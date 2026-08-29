import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Zap,
  Shield,
  Layers,
  Layout,
  ShoppingBag,
  Code2,
  Clock,
  Star,
  Quote,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import RatingStars from '../../components/common/RatingStars';
import { formatPrice, getServicePricing } from '../../config/pricing';
import SEO from '../../components/common/SEO';

export default function HomePage() {
  const { language, t, isRtl } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [dynamicContent, setDynamicContent] = useState(null);

  useEffect(() => {
    // Fetch approved reviews for testimonials snippet
    api.reviews
      .getPublic()
      .then((data) => setReviews((data.reviews || []).slice(0, 3)))
      .catch((err) => console.warn('Could not fetch home reviews:', err.message));

    // Fetch dynamic site prices/timelines
    api.content
      .getPublic()
      .then((data) => setDynamicContent(data.content))
      .catch((err) => console.warn('Could not fetch site content:', err.message));
  }, []);

  const pricing = dynamicContent?.services_pricing || getServicePricing();

  const services = [
    {
      key: 'landingPages',
      icon: Layout,
      title: t('services.landingPages.title'),
      desc: t('services.landingPages.tagline'),
      price: formatPrice(pricing.landingPages.startingPrice, language),
      timeline: language === 'ar' ? pricing.landingPages.timelineAr : pricing.landingPages.timelineEn,
      path: '/services/landing-pages',
      highlights: ['<800ms Load Time', 'High-Converting Copy Flow', 'Mobile-First React UI'],
    },
    {
      key: 'dashboards',
      icon: Layers,
      title: t('services.dashboards.title'),
      desc: t('services.dashboards.tagline'),
      price: formatPrice(pricing.dashboards.startingPrice, language),
      timeline: language === 'ar' ? pricing.dashboards.timelineAr : pricing.dashboards.timelineEn,
      path: '/services/dashboards',
      highlights: ['Fullstack MERN Stack', 'Role-Based Auth (RBAC)', 'Real-Time Analytics & Charts'],
    },
    {
      key: 'ecommerce',
      icon: ShoppingBag,
      title: t('services.ecommerce.title'),
      desc: t('services.ecommerce.tagline'),
      price: formatPrice(pricing.ecommerce.startingPrice, language),
      timeline: language === 'ar' ? pricing.ecommerce.timelineAr : pricing.ecommerce.timelineEn,
      path: '/services/ecommerce',
      highlights: ['Ultra-Fast Custom Cart', 'Stripe / Global Gateways', 'Zero Shopify Monthly Bloat'],
    },
  ];

  const featuredProjects = [
    {
      id: 'atelier',
      title: t('portfolio.projects.atelier.title'),
      category: t('portfolio.projects.atelier.category'),
      desc: t('portfolio.projects.atelier.summary'),
      metrics: t('portfolio.projects.atelier.metrics'),
      tags: ['React', 'Tailwind', 'Framer Motion'],
      color: 'from-amber-900/20 to-brand-primary/20',
      externalUrl: 'https://github.com/digitway-dev/atelier-showcase',
    },
    {
      id: 'fleet',
      title: t('portfolio.projects.fleet.title'),
      category: t('portfolio.projects.fleet.category'),
      desc: t('portfolio.projects.fleet.summary'),
      metrics: t('portfolio.projects.fleet.metrics'),
      tags: ['MERN', 'Leaflet GPS', 'Analytics'],
      color: 'from-blue-900/20 to-brand-primary/20',
      externalUrl: 'https://github.com/digitway-dev/fleetflow-dashboard',
    },
    {
      id: 'orbit',
      title: t('portfolio.projects.orbit.title'),
      category: t('portfolio.projects.orbit.category'),
      desc: t('portfolio.projects.orbit.summary'),
      metrics: t('portfolio.projects.orbit.metrics'),
      tags: ['React', 'Stripe API', 'RBAC'],
      color: 'from-purple-900/20 to-brand-primary/20',
      externalUrl: 'https://github.com/digitway-dev/orbit-saas',
    },
  ];

  return (
    <>
      <SEO
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        locale={language}
        url={`/${language}`}
      />
      <div className="space-y-24 sm:space-y-32">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-16 pb-12 overflow-hidden">
        {/* Subtle background gradient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Availability status badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-subtle/80 text-brand-dark border border-brand-primary/20 text-xs font-bold mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            <span>{t('hero.badge')}</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink-primary max-w-4xl mx-auto leading-[1.15] sm:leading-[1.18]">
            {t('hero.title')}
          </h1>

          {/* Hero Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-ink-secondary max-w-2xl mx-auto leading-relaxed font-medium">
            {t('hero.subtitle')}
          </p>

          {/* Primary CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to={`/${language}/quote`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white bg-brand-dark hover:bg-brand-primary shadow-soft hover:shadow-glow active:scale-95 transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 text-brand-accent" />
              <span>{t('hero.ctaQuote')}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>

            <Link
              to={`/${language}/services`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-ink-primary bg-surface-card hover:bg-surface-elevated border border-surface-muted shadow-soft transition-colors"
            >
              <span>{t('hero.ctaServices')}</span>
            </Link>
          </div>

          {/* Trust stats & Highlights bar */}
          <div className="mt-14 pt-8 border-t border-surface-muted/60 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-3 text-center">
              <p className="text-xl font-extrabold text-brand-dark font-mono">100%</p>
              <p className="text-xs text-ink-muted mt-0.5">{t('hero.stats.satisfaction')}</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-xl font-extrabold text-brand-dark font-mono">3-5 Days</p>
              <p className="text-xs text-ink-muted mt-0.5">{t('hero.stats.turnaround')}</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-xl font-extrabold text-brand-dark font-mono">MERN</p>
              <p className="text-xs text-ink-muted mt-0.5">{t('hero.stats.stack')}</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-xl font-extrabold text-brand-dark font-mono">100%</p>
              <p className="text-xs text-ink-muted mt-0.5">{t('hero.stats.ownership')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES OVERVIEW GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-2">
            {t('nav.services')}
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">
            {t('services.title')}
          </p>
          <p className="text-sm text-ink-secondary mt-3">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.key}
                className="bg-surface-card rounded-2xl p-6 sm:p-7 border border-surface-muted/80 shadow-soft hover:shadow-card hover:border-brand-primary/30 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-end">
                      <span className="text-[10px] uppercase font-bold text-ink-muted block">
                        {t('services.startingAt')}
                      </span>
                      <span className="text-lg font-black text-brand-dark font-mono">
                        {svc.price}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-ink-primary group-hover:text-brand-dark transition-colors mb-2">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-ink-secondary leading-relaxed mb-6">
                    {svc.desc}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-surface-muted/60 mb-6">
                    <div className="flex items-center gap-2 text-xs font-semibold text-brand-dark mb-2">
                      <Clock className="w-3.5 h-3.5 text-brand-primary" />
                      <span>{svc.timeline}</span>
                    </div>
                    {svc.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-ink-secondary">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/${language}${svc.path}`}
                  className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-brand-dark bg-brand-subtle/50 hover:bg-brand-primary hover:text-white transition-all duration-200"
                >
                  <span>{t('services.learnMore')}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. 4-STEP PROCESS HIGHLIGHT */}
      <section className="bg-surface-elevated py-16 sm:py-20 border-y border-surface-muted/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-2">
              {t('nav.process')}
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">
              {t('process.title')}
            </p>
            <p className="text-sm text-ink-secondary mt-3">
              {t('process.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((stepNum, idx) => {
              const step = t(`process.steps.${idx}`);
              return (
                <div
                  key={stepNum}
                  className="bg-surface-card rounded-2xl p-6 border border-surface-muted shadow-soft relative overflow-hidden"
                >
                  <span className="text-4xl font-black font-mono text-brand-subtle/70 absolute top-4 right-4">
                    0{stepNum}
                  </span>
                  <div className="relative z-10 space-y-2">
                    <h3 className="text-sm font-bold text-ink-primary pt-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-ink-secondary leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              to={`/${language}/process`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline"
            >
              <span>Explore full workflow & client FAQs</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PORTFOLIO PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-2">
              {t('nav.portfolio')}
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">
              {t('portfolio.title')}
            </p>
          </div>
          <Link
            to={`/${language}/portfolio`}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline"
          >
            <span>View all demo projects</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((p) => (
            <div
              key={p.id}
              className="bg-surface-card rounded-2xl border border-surface-muted overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between"
            >
              {/* Project preview header mockup */}
              <div className={`h-40 bg-gradient-to-br ${p.color} p-5 flex flex-col justify-between relative`}>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-surface-card/90 text-brand-dark backdrop-blur-sm self-start shadow-sm">
                  {p.category}
                </span>
                <div>
                  <h3 className="text-base font-bold text-ink-primary">{p.title}</h3>
                  <p className="text-[11px] font-semibold text-brand-dark mt-0.5">{p.metrics}</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <p className="text-xs text-ink-secondary leading-relaxed mb-4">
                  {p.desc}
                </p>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-surface-muted text-ink-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/${language}/portfolio`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-brand-dark bg-surface-elevated hover:bg-brand-subtle transition-colors"
                  >
                    <span>{t('portfolio.viewDemo')}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. VERIFIED CLIENT REVIEWS SNIPPET */}
      {reviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-2">
              {t('nav.reviews')}
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">
              {t('reviews.title')}
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <RatingStars rating={5} size="sm" />
              <span className="text-xs font-bold text-ink-primary">5.0 / 5.0</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-surface-card rounded-2xl p-6 border border-surface-muted shadow-soft flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <RatingStars rating={r.rating} size="xs" />
                    <span className="text-[10px] font-bold text-brand-primary bg-brand-subtle px-2 py-0.5 rounded-full">
                      Verified Client
                    </span>
                  </div>
                  <Quote className="w-5 h-5 text-brand-accent/40 mb-2" />
                  <p className="text-xs text-ink-secondary leading-relaxed italic">
                    "{r.comment}"
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-surface-muted/60">
                  <p className="text-xs font-bold text-ink-primary">{r.client_name}</p>
                  <p className="text-[11px] text-ink-muted">{r.role_company || r.service_type}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to={`/${language}/reviews`}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline"
            >
              <span>Read all verified reviews or submit yours</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </section>
      )}

      {/* 6. CONVERSION-FOCUSED BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-dark rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-elevated">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/60 text-brand-accent text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Let's build your next digital platform</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Ready to take your web presence to the next level?
            </h2>

            <p className="text-sm text-surface-bg/80 leading-relaxed font-medium">
              Submit your project details today to receive a free architectural review, fixed-price estimate, and delivery timeline within 24 hours.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={`/${language}/quote`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-brand-dark bg-brand-accent hover:bg-white transition-all shadow-glow active:scale-95"
              >
                <span>{t('hero.ctaQuote')}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </Link>
              <Link
                to={`/${language}/contact-links`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white hover:bg-white/10 border border-white/20 transition-colors"
              >
                <span>{t('nav.contactLinks')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
