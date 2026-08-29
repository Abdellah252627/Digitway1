import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Layout,
  Layers,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Code2,
  Database,
  Zap,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { formatPrice, getServicePricing } from '../../config/pricing';
import SEO from '../../components/common/SEO';

export default function ServiceDetailPage() {
  const { serviceType } = useParams();
  const { language, t, isRtl } = useLanguage();
  const navigate = useNavigate();
  const [dynamicPricing, setDynamicPricing] = useState(null);

  useEffect(() => {
    api.content
      .getPublic()
      .then((data) => setDynamicPricing(data.content?.services_pricing))
      .catch((err) => console.warn('Could not fetch dynamic pricing:', err.message));
  }, []);

  // Map route params to service definitions
  const serviceKeyMap = {
    'landing-pages': 'landingPages',
    dashboards: 'dashboards',
    ecommerce: 'ecommerce',
  };

  const currentKey = serviceKeyMap[serviceType] || 'landingPages';

  const pricing = dynamicPricing || getServicePricing();

  const serviceData = {
    landingPages: {
      slug: 'landing-pages',
      icon: Layout,
      title: t('services.landingPages.title'),
      tagline: t('services.landingPages.tagline'),
      price: formatPrice(pricing.landingPages.startingPrice, language),
      timeline: language === 'ar' ? pricing.landingPages.timelineAr : pricing.landingPages.timelineEn,
      description: t('services.landingPages.description'),
      includes: t('services.landingPages.includes'),
      ideal: t('services.landingPages.ideal'),
      stack: ['React 18 / 19', 'Tailwind CSS', 'Vite', 'Framer Motion', 'SEO & OpenGraph', 'Cloudflare CDN'],
      deliverables: [
        { phase: 'Phase 1', title: 'Copywriting Flow & Wireframe', time: 'Day 1' },
        { phase: 'Phase 2', title: 'React Interactive UI & Animations', time: 'Day 2-3' },
        { phase: 'Phase 3', title: 'Lead Form Webhook & Core Web Vitals Audit', time: 'Day 4' },
        { phase: 'Phase 4', title: 'Domain DNS Connection & Launch', time: 'Day 5' },
      ],
    },
    dashboards: {
      slug: 'dashboards',
      icon: Layers,
      title: t('services.dashboards.title'),
      tagline: t('services.dashboards.tagline'),
      price: formatPrice(pricing.dashboards.startingPrice, language),
      timeline: language === 'ar' ? pricing.dashboards.timelineAr : pricing.dashboards.timelineEn,
      description: t('services.dashboards.description'),
      includes: t('services.dashboards.includes'),
      ideal: t('services.dashboards.ideal'),
      stack: ['React / Vite', 'Node.js & Express', 'MongoDB / SQLite / PostgreSQL', 'JWT / RBAC Auth', 'Chart.js / Recharts', 'REST / GraphQL'],
      deliverables: [
        { phase: 'Phase 1', title: 'Database Schema & User Flow Architecture', time: 'Week 1' },
        { phase: 'Phase 2', title: 'Backend REST API & Auth Roles (RBAC)', time: 'Week 2' },
        { phase: 'Phase 3', title: 'Frontend UI, Analytics Charts & Tables', time: 'Week 2-3' },
        { phase: 'Phase 4', title: 'Security Audit, Deployment & Code Handoff', time: 'Week 3' },
      ],
    },
    ecommerce: {
      slug: 'ecommerce',
      icon: ShoppingBag,
      title: t('services.ecommerce.title'),
      tagline: t('services.ecommerce.tagline'),
      price: formatPrice(pricing.ecommerce.startingPrice, language),
      timeline: language === 'ar' ? pricing.ecommerce.timelineAr : pricing.ecommerce.timelineEn,
      description: t('services.ecommerce.description'),
      includes: t('services.ecommerce.includes'),
      ideal: t('services.ecommerce.ideal'),
      stack: ['React', 'Node.js & Express', 'Stripe / PayPal API', 'Tailwind CSS', 'Lightweight Admin CMS', 'Transactional Emails'],
      deliverables: [
        { phase: 'Phase 1', title: 'Product Catalog Design & Inventory Model', time: 'Days 1-3' },
        { phase: 'Phase 2', title: 'Dynamic Cart Drawer & Discount Engine', time: 'Days 4-7' },
        { phase: 'Phase 3', title: 'Payment Gateways & Order Webhook Sync', time: 'Days 8-10' },
        { phase: 'Phase 4', title: 'Test Transactions, Deployment & Handover', time: 'Days 11-14' },
      ],
    },
  };

  const current = serviceData[currentKey];
  const Icon = current.icon;

  const seoTitle =
    serviceType?.includes('landing')
      ? t('seo.landingPages.title')
      : serviceType?.includes('dashboard')
        ? t('seo.dashboards.title')
        : t('seo.ecommerce.title');

  const seoDescription =
    serviceType?.includes('landing')
      ? t('seo.landingPages.description')
      : serviceType?.includes('dashboard')
        ? t('seo.dashboards.description')
        : t('seo.ecommerce.description');

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        locale={language}
        url={`/${language}/services/${serviceType}`}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Back Link */}
      <div>
        <Link
          to={`/${language}/services`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-brand-dark transition-colors"
        >
          <ArrowLeft className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          <span>{t('nav.allServices')}</span>
        </Link>
      </div>

      {/* Hero Header for this Sub-Service */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-subtle text-brand-dark text-xs font-bold">
            <Icon className="w-3.5 h-3.5 text-brand-primary" />
            <span>{current.tagline}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-ink-primary tracking-tight">
            {current.title}
          </h1>

          <p className="text-base text-ink-secondary leading-relaxed max-w-2xl">
            {current.description}
          </p>
        </div>

        {/* Pricing Box */}
        <div className="lg:col-span-4 bg-surface-card rounded-3xl p-7 border border-surface-muted shadow-elevated space-y-6">
          <div className="space-y-3">
            <div className="flex items-baseline justify-between border-b border-surface-muted pb-3">
              <span className="text-xs font-bold uppercase text-ink-muted">{t('services.startingAt')}</span>
              <span className="text-3xl font-black text-brand-dark font-mono">{current.price}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-ink-secondary">
              <span className="flex items-center gap-1.5 font-semibold">
                <Clock className="w-3.5 h-3.5 text-brand-primary" />
                <span>{t('services.estimatedTimeline')}</span>
              </span>
              <span className="font-bold text-brand-dark">{current.timeline}</span>
            </div>
          </div>

          <Link
            to={`/${language}/quote?service=${current.slug}`}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold text-white bg-brand-dark hover:bg-brand-primary shadow-soft hover:shadow-glow transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            <span>{t('services.requestService')}</span>
          </Link>
        </div>
      </div>

      {/* What's Included & Deliverables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: What's Included */}
        <div className="bg-surface-card rounded-3xl p-8 border border-surface-muted shadow-soft space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-ink-primary">
              {t('services.whatsIncluded')}
            </h2>
          </div>

          <div className="space-y-3">
            {Array.isArray(current.includes) &&
              current.includes.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-surface-elevated/60 text-xs text-ink-secondary">
                  <CheckCircle2 className="w-4 h-4 text-brand-accent mt-0.5 shrink-0" />
                  <span className="font-medium leading-relaxed">{item}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Right: Deliverables Timeline Roadmap */}
        <div className="bg-surface-card rounded-3xl p-8 border border-surface-muted shadow-soft space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-ink-primary">
              Milestone & Deliverables Roadmap
            </h2>
          </div>

          <div className="space-y-4">
            {current.deliverables.map((del, i) => (
              <div key={i} className="flex items-start gap-4 p-3.5 rounded-xl border border-surface-muted bg-surface-elevated/40">
                <span className="text-xs font-mono font-black text-brand-dark bg-brand-subtle px-2.5 py-1 rounded-lg">
                  {del.phase}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-ink-primary">{del.title}</p>
                  <p className="text-[11px] text-ink-muted mt-0.5">Estimated window: {del.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-surface-muted/60">
            <p className="text-xs text-ink-muted">
              <span className="font-bold text-ink-primary">{t('services.idealFor')}: </span>
              {current.ideal}
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack Bar */}
      <div className="bg-surface-elevated rounded-3xl p-8 border border-surface-muted text-center space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-dark">
          {t('services.techArchitecture')}
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {current.stack.map((tech) => (
            <span
              key={tech}
              className="text-xs font-mono font-semibold px-3.5 py-1.5 rounded-xl bg-surface-card border border-surface-muted text-brand-dark shadow-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-brand-dark rounded-3xl p-8 sm:p-12 text-white text-center space-y-6">
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Ready to kick off your {current.title}?
        </h3>
        <p className="text-sm text-surface-bg/80 max-w-xl mx-auto leading-relaxed">
          Submit your scope details to receive a fixed quote and reserve your engineering slot.
        </p>
        <Link
          to={`/${language}/quote?service=${current.slug}`}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs font-bold text-brand-dark bg-brand-accent hover:bg-white transition-all shadow-glow"
        >
          <span>{t('services.requestService')}</span>
          <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
        </Link>
      </div>
    </div>
    </>
  );
}
