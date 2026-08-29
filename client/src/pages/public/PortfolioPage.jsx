import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Layers, Layout, ShoppingBag, ArrowUpRight, Github, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/common/SEO';

export default function PortfolioPage() {
  const { language, t, isRtl } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const projects = [
    {
      id: 'atelier',
      title: t('portfolio.projects.atelier.title'),
      category: 'landing-pages',
      categoryLabel: t('portfolio.projects.atelier.category'),
      icon: Layout,
      summary: t('portfolio.projects.atelier.summary'),
      metrics: t('portfolio.projects.atelier.metrics'),
      tags: ['React 18', 'Tailwind CSS', 'Framer Motion', 'SEO Optimized'],
      gradient: 'from-amber-950/80 to-brand-dark',
      liveUrl: 'https://atelier-demo.digitway.com',
      githubUrl: 'https://github.com/digitway-dev/atelier-showcase',
      highlights: [
        '99 Lighthouse Performance Score',
        'Custom interactive photography grid',
        'Appointment consultation modal with validation',
      ],
    },
    {
      id: 'fleet',
      title: t('portfolio.projects.fleet.title'),
      category: 'dashboards',
      categoryLabel: t('portfolio.projects.fleet.category'),
      icon: Layers,
      summary: t('portfolio.projects.fleet.summary'),
      metrics: t('portfolio.projects.fleet.metrics'),
      tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Leaflet GPS', 'Chart.js'],
      gradient: 'from-blue-950/80 to-brand-dark',
      liveUrl: 'https://fleet-demo.digitway.com',
      githubUrl: 'https://github.com/digitway-dev/fleetflow-dashboard',
      highlights: [
        'Live simulated GPS telemetry map',
        'Real-time fuel & driver performance indicators',
        'CSV/PDF automated payroll export',
      ],
    },
    {
      id: 'orbit',
      title: t('portfolio.projects.orbit.title'),
      category: 'dashboards',
      categoryLabel: t('portfolio.projects.orbit.category'),
      icon: Layers,
      summary: t('portfolio.projects.orbit.summary'),
      metrics: t('portfolio.projects.orbit.metrics'),
      tags: ['React', 'Express', 'PostgreSQL', 'Stripe Webhooks', 'RBAC Auth'],
      gradient: 'from-purple-950/80 to-brand-dark',
      liveUrl: 'https://orbit-demo.digitway.com',
      githubUrl: 'https://github.com/digitway-dev/orbit-saas',
      highlights: [
        'Multi-tenant seat management',
        'Tiered billing sync with Stripe webhooks',
        'Interactive churn and MRR analytics charts',
      ],
    },
    {
      id: 'nutri',
      title: t('portfolio.projects.nutri.title'),
      category: 'ecommerce',
      categoryLabel: t('portfolio.projects.nutri.category'),
      icon: ShoppingBag,
      summary: t('portfolio.projects.nutri.summary'),
      metrics: t('portfolio.projects.nutri.metrics'),
      tags: ['React', 'Node.js', 'Tailwind CSS', 'Stripe Checkout', 'State Management'],
      gradient: 'from-emerald-950/80 to-brand-dark',
      liveUrl: 'https://nutri-demo.digitway.com',
      githubUrl: 'https://github.com/digitway-dev/nutripure-store',
      highlights: [
        'Interactive macro calorie meal customizer',
        'Sub-second cart drawer & coupon logic',
        'Automated order confirmation email routing',
      ],
    },
  ];

  const filteredProjects =
    selectedFilter === 'all'
      ? projects
      : projects.filter((p) => p.category === selectedFilter);

  const filterTabs = [
    { key: 'all', label: 'All Projects' },
    { key: 'landing-pages', label: t('nav.landingPages') },
    { key: 'dashboards', label: t('nav.dashboards') },
    { key: 'ecommerce', label: t('nav.ecommerce') },
  ];

  return (
    <>
      <SEO
        title={t('seo.portfolio.title')}
        description={t('seo.portfolio.description')}
        locale={language}
        url={`/${language}/portfolio`}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-brand-subtle px-3 py-1 rounded-full inline-block mb-3">
          {t('nav.portfolio')}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink-primary tracking-tight leading-tight">
          {t('portfolio.title')}
        </h1>
        <p className="text-base sm:text-lg text-ink-secondary mt-4 leading-relaxed font-medium">
          {t('portfolio.subtitle')}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setSelectedFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === tab.key
                ? 'bg-brand-dark text-white shadow-soft'
                : 'bg-surface-card hover:bg-surface-elevated text-ink-secondary border border-surface-muted'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((proj) => {
          const Icon = proj.icon;
          return (
            <div
              key={proj.id}
              className="bg-surface-card rounded-3xl border border-surface-muted shadow-card hover:shadow-elevated transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Banner Preview */}
              <div className={`p-7 bg-gradient-to-br ${proj.gradient} text-white relative flex flex-col justify-between min-h-[170px]`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
                    {proj.categoryLabel}
                  </span>
                  <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
                    <Icon className="w-5 h-5 text-brand-accent" />
                  </div>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">{proj.title}</h2>
                  <p className="text-xs font-semibold text-brand-accent mt-1">{proj.metrics}</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-medium">
                    {proj.summary}
                  </p>

                  {/* Highlights Checklist */}
                  <div className="space-y-1.5 pt-2">
                    {proj.highlights.map((hl, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-ink-primary">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-surface-muted/60">
                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {proj.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-surface-elevated text-brand-dark border border-surface-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* External Links */}
                  <div className="flex items-center gap-3">
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-dark hover:bg-brand-primary transition-colors shadow-sm"
                    >
                      <span>{t('portfolio.viewDemo')}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center p-2.5 rounded-xl text-ink-secondary bg-surface-elevated hover:bg-surface-muted border border-surface-muted transition-colors"
                      title="View GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quote Banner */}
      <div className="bg-surface-elevated rounded-3xl p-8 border border-surface-muted text-center space-y-4">
        <h3 className="text-xl font-bold text-ink-primary">
          Need a similar web application engineered for your business?
        </h3>
        <p className="text-xs text-ink-secondary max-w-xl mx-auto">
          Every project is built from scratch to match your specific requirements, business model, and brand identity.
        </p>
        <Link
          to={`/${language}/quote`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-brand-dark hover:bg-brand-primary shadow-soft transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
          <span>{t('nav.getQuote')}</span>
        </Link>
      </div>
      </div>
    </>
  );
}
