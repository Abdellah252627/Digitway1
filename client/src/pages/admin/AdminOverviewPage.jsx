import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Inbox,
  Star,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  Plus,
  Shield,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';

export default function AdminOverviewPage() {
  const { language, t, isRtl } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.projects
      .getOverview()
      .then((res) => setData(res))
      .catch((err) => console.error('Overview error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-ink-muted">{t('admin.overview.loading')}</p>
      </div>
    );
  }

  const stats = data?.stats || {
    activeProjects: 0,
    newQuotes: 0,
    pendingReviews: 0,
    completedProjects: 0,
  };

  const statCards = [
    {
      label: t('admin.overview.activeProjects'),
      value: stats.activeProjects,
      icon: FolderKanban,
      color: 'text-brand-primary bg-brand-subtle',
      link: '/admin/projects',
    },
    {
      label: t('admin.overview.newQuotes'),
      value: stats.newQuotes,
      icon: Inbox,
      color: 'text-amber-700 bg-amber-100',
      badge: stats.newQuotes > 0 ? t('admin.overview.requiresFollowUp') : undefined,
      link: '/admin/quotes',
    },
    {
      label: t('admin.overview.pendingReviews'),
      value: stats.pendingReviews,
      icon: Star,
      color: 'text-purple-700 bg-purple-100',
      badge: stats.pendingReviews > 0 ? t('admin.overview.actionNeeded') : undefined,
      link: '/admin/reviews',
    },
    {
      label: t('admin.overview.completedProjects'),
      value: stats.completedProjects,
      icon: CheckCircle2,
      color: 'text-emerald-700 bg-emerald-100',
      link: '/admin/projects?status=completed',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink-primary tracking-tight">
            {t('admin.overview.title')}
          </h1>
          <p className="text-xs text-ink-secondary mt-1">
            {t('admin.overview.subtitle')}
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex items-center gap-2">
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-dark hover:bg-brand-primary transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('admin.overview.newProjectBtn')}</span>
          </Link>

          <Link
            to="/admin/reviews"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-surface-card hover:bg-surface-elevated text-ink-primary border border-surface-muted transition-colors"
          >
            <Star className="w-3.5 h-3.5 text-brand-primary" />
            <span>{t('admin.overview.moderateReviewsBtn')}</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link
              key={i}
              to={stat.link}
              className="bg-surface-card rounded-2xl p-5 border border-surface-muted shadow-soft hover:shadow-card hover:border-brand-primary/30 transition-all block group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {stat.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 animate-pulse">
                    {stat.badge}
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-ink-secondary">{stat.label}</p>
              <p className="text-2xl font-black font-mono text-ink-primary mt-1 group-hover:text-brand-dark transition-colors">
                {stat.value}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Grid: Recent Quotes & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Recent Quote Requests */}
        <div className="bg-surface-card rounded-3xl p-6 border border-surface-muted shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-muted/60">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-brand-primary" />
              <h2 className="text-sm font-bold text-ink-primary">
                {t('admin.overview.recentQuotes')}
              </h2>
            </div>
            <Link
              to="/admin/quotes"
              className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
            >
              <span>{t('admin.common.viewAll')}</span>
              <ArrowRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>

          <div className="space-y-3">
            {!data?.recentQuotes || data.recentQuotes.length === 0 ? (
              <p className="text-xs text-ink-muted text-center py-6">{t('admin.overview.noQuotes')}</p>
            ) : (
              data.recentQuotes.map((q) => (
                <div
                  key={q.id}
                  className="p-3.5 rounded-xl bg-surface-elevated/70 border border-surface-muted/60 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink-primary truncate">{q.project_name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          q.status === 'new'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-surface-muted text-ink-secondary'
                        }`}
                      >
                        {q.status}
                      </span>
                    </div>
                     <p className="text-[11px] text-ink-muted">
                       {q.client_name || q.email} • <span className="font-mono font-bold text-brand-dark">{q.budget}</span>
                     </p>
                  </div>
                  <Link
                    to="/admin/quotes"
                    className="p-1.5 rounded-lg text-ink-muted hover:text-brand-dark hover:bg-surface-card transition-colors shrink-0"
                    title={t('admin.overview.viewRequest')}
                  >
                    <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Recent Active Projects (Confidential) */}
        <div className="bg-surface-card rounded-3xl p-6 border border-surface-muted shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-muted/60">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-brand-primary" />
              <h2 className="text-sm font-bold text-ink-primary">
                {t('admin.overview.recentProjects')}
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-surface-charcoal text-brand-accent">
                {t('admin.overview.confidential')}
              </span>
            </div>
            <Link
              to="/admin/projects"
              className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
            >
              <span>{t('admin.overview.crmHub')}</span>
              <ArrowRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>

          <div className="space-y-3">
            {!data?.recentProjects || data.recentProjects.length === 0 ? (
              <p className="text-xs text-ink-muted text-center py-6">{t('admin.overview.noProjects')}</p>
            ) : (
              data.recentProjects.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl bg-surface-elevated/70 border border-surface-muted/60 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-ink-primary">{p.title}</p>
                      <p className="text-[11px] text-ink-muted">{p.client_name} • {p.service_type}</p>
                    </div>
                    <span className="font-mono font-bold text-brand-dark bg-brand-subtle px-2 py-0.5 rounded">
                      {p.budget}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-ink-muted">
                      <span className="capitalize">{p.status.replace('_', ' ')}</span>
                      <span>{p.progress_percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-surface-muted overflow-hidden">
                      <div
                        className="h-full bg-brand-primary rounded-full transition-all"
                        style={{ width: `${p.progress_percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
