import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, ArrowUpRight, Lock, Github, Instagram, Mail, MessageSquare, Linkedin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-surface-charcoal text-ink-inverted pt-16 pb-12 mt-20 border-t border-surface-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Bio */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white">
                <span className="font-mono font-black text-brand-accent text-sm">D</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Digitway<span className="text-brand-accent">.</span>
              </span>
            </div>
            <p className="text-sm text-ink-muted leading-relaxed max-w-md">
              Bespoke full-stack web engineering for startups and modern businesses.
              Specialized in high-conversion landing pages, complex SaaS dashboards, and fast e-commerce platforms.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-accent bg-brand-dark/80 px-3 py-1.5 rounded-full inline-flex border border-brand-primary/30">
              <span className="w-2 h-2 rounded-full bg-brand-accent animate-ping" />
              <span>{t('hero.badge')}</span>
            </div>

            {/* Social Channels Row */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/Abdellah252627"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-ink-muted hover:text-white transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/northstack.dev?igsi=YnU3dDl6bWNneWN6"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-pink-600/30 text-ink-muted hover:text-pink-400 transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="mailto:hello.northstack2@gmail.com"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-emerald-600/30 text-ink-muted hover:text-emerald-400 transition-colors"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/212600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-emerald-600/30 text-ink-muted hover:text-emerald-400 transition-colors"
                title="WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/abdellah-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-sky-600/30 text-ink-muted hover:text-sky-400 transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-accent mb-4">
              {t('nav.services')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to={`/${language}/services/landing-pages`}
                  className="text-ink-muted hover:text-white transition-colors"
                >
                  {t('nav.landingPages')}
                </Link>
              </li>
              <li>
                <Link
                  to={`/${language}/services/dashboards`}
                  className="text-ink-muted hover:text-white transition-colors"
                >
                  {t('nav.dashboards')}
                </Link>
              </li>
              <li>
                <Link
                  to={`/${language}/services/ecommerce`}
                  className="text-ink-muted hover:text-white transition-colors"
                >
                  {t('nav.ecommerce')}
                </Link>
              </li>
              <li>
                <Link
                  to={`/${language}/services`}
                  className="text-brand-primary hover:text-brand-accent transition-colors font-medium flex items-center gap-1 mt-1"
                >
                  <span>{t('nav.allServices')}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation & Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-accent mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to={`/${language}/portfolio`} className="text-ink-muted hover:text-white transition-colors">
                  {t('nav.portfolio')}
                </Link>
              </li>
              <li>
                <Link to={`/${language}/process`} className="text-ink-muted hover:text-white transition-colors">
                  {t('nav.process')}
                </Link>
              </li>
              <li>
                <Link to={`/${language}/reviews`} className="text-ink-muted hover:text-white transition-colors">
                  {t('nav.reviews')}
                </Link>
              </li>
              <li>
                <Link to={`/${language}/contact-links`} className="text-ink-muted hover:text-white transition-colors">
                  {t('nav.contactLinks')}
                </Link>
              </li>
              <li>
                <Link to={`/${language}/privacy`} className="text-ink-muted hover:text-white transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{t('nav.privacy')}</span>
                </Link>
              </li>
              <li>
                <Link to={`/${language}/quote`} className="text-brand-accent hover:underline font-semibold">
                  {t('nav.getQuote')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <p>© {new Date().getFullYear()} Digitway. All rights reserved. Engineering by Abdellah (North Stack).</p>
          <div className="flex items-center gap-4">
            <Link
              to={`/${language}/privacy`}
              className="inline-flex items-center gap-1 text-ink-muted/80 hover:text-brand-accent transition-colors"
              title="Privacy Policy"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>{t('nav.privacy')}</span>
            </Link>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-ink-muted/80 hover:text-brand-accent transition-colors"
              title="Admin Portal"
            >
              <Lock className="w-3 h-3" />
              <span>{t('nav.adminPortal')}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
