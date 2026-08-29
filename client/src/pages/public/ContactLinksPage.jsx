import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Linkedin,
  Instagram,
  Github,
  Mail,
  Copy,
  Check,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Send,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import SEO from '../../components/common/SEO';

export default function ContactLinksPage() {
  const { language, t, isRtl } = useLanguage();
  const [copiedKey, setCopiedKey] = useState('');
  const [links, setLinks] = useState({
    whatsapp: '+212600000000',
    whatsappUrl: 'https://wa.me/212600000000',
    linkedin: 'https://linkedin.com/in/abdellah-dev',
    instagram: 'https://www.instagram.com/northstack.dev?igsi=YnU3dDl6bWNneWN6',
    github: 'https://github.com/Abdellah252627',
    email: 'hello.northstack2@gmail.com',
  });

  useEffect(() => {
    api.content
      .getPublic()
      .then((data) => {
        if (data.content?.contact_links) {
          setLinks((prev) => ({
            ...prev,
            ...data.content.contact_links,
          }));
        }
      })
      .catch((err) => console.warn('Could not load custom contact links:', err.message));
  }, []);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const channels = [
    {
      id: 'email',
      icon: Mail,
      title: 'Official Direct Email',
      handle: links.email,
      desc: 'For formal client inquiries, proposals, and direct project communication.',
      action: 'Send an Email',
      url: `mailto:${links.email}`,
      badge: 'Primary Business Channel',
      color: 'bg-emerald-950/5 border-emerald-500/20 hover:border-emerald-600',
      iconBg: 'bg-brand-subtle text-brand-dark',
      btnColor: 'bg-brand-dark hover:bg-brand-primary text-white',
      copyValue: links.email,
    },
    {
      id: 'github',
      icon: Github,
      title: 'GitHub Repositories',
      handle: '@Abdellah252627',
      desc: 'Explore open source code, MERN repositories, architectures, and commits.',
      action: 'View GitHub Profile',
      url: links.github,
      badge: 'Source Code & Architecture',
      color: 'bg-gray-950/5 border-gray-400/30 hover:border-gray-900',
      iconBg: 'bg-gray-900 text-white',
      btnColor: 'bg-gray-900 hover:bg-black text-white',
      copyValue: links.github,
    },
    {
      id: 'instagram',
      icon: Instagram,
      title: 'Instagram',
      handle: '@northstack.dev',
      desc: 'UI/UX highlights, live product snippets, and development behind the scenes.',
      action: 'Follow on Instagram',
      url: links.instagram,
      badge: 'Workflows & Demos',
      color: 'bg-pink-950/5 border-pink-500/20 hover:border-pink-500',
      iconBg: 'bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white',
      btnColor: 'bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-95 text-white',
      copyValue: links.instagram,
    },
    {
      id: 'whatsapp',
      icon: MessageSquare,
      title: 'WhatsApp Direct Chat',
      handle: links.whatsapp || '+212 600-000000',
      desc: 'Instant messaging for quick questions, availability check, and scoping.',
      action: 'Open WhatsApp Chat',
      url: links.whatsappUrl || `https://wa.me/${links.whatsapp.replace(/[^0-9]/g, '')}`,
      badge: 'Fastest Response (< 2h)',
      color: 'bg-emerald-950/5 border-emerald-500/20 hover:border-emerald-500',
      iconBg: 'bg-emerald-600 text-white',
      btnColor: 'bg-emerald-700 hover:bg-emerald-800 text-white',
      copyValue: links.whatsapp,
    },
    {
      id: 'linkedin',
      icon: Linkedin,
      title: 'LinkedIn Network',
      handle: 'Abdellah (North Stack)',
      desc: 'Professional background, industry connections, and recommendations.',
      action: 'Connect on LinkedIn',
      url: links.linkedin,
      badge: 'Verified Developer',
      color: 'bg-sky-950/5 border-sky-500/20 hover:border-sky-600',
      iconBg: 'bg-sky-600 text-white',
      btnColor: 'bg-sky-700 hover:bg-sky-800 text-white',
      copyValue: links.linkedin,
    },
  ];

  return (
    <>
      <SEO
        title={t('seo.contactLinks.title')}
        description={t('seo.contactLinks.description')}
        locale={language}
        url={`/${language}/contact-links`}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-brand-subtle px-3 py-1 rounded-full inline-block">
          {t('nav.contactLinks')}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink-primary tracking-tight">
          {t('contactLinks.title')}
        </h1>
        <p className="text-sm sm:text-base text-ink-secondary leading-relaxed font-medium">
          {t('contactLinks.subtitle')}
        </p>
      </div>

      {/* Main Direct Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {channels.map((ch) => {
          const Icon = ch.icon;
          const isCopied = copiedKey === ch.id;
          return (
            <div
              key={ch.id}
              className={`bg-surface-card rounded-3xl p-6 sm:p-7 border shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between space-y-6 ${ch.color}`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${ch.iconBg}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-surface-elevated text-ink-secondary border border-surface-muted shadow-sm">
                    {ch.badge}
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-ink-primary">{ch.title}</h2>
                  <p className="text-xs font-mono font-bold text-brand-primary mt-0.5">{ch.handle}</p>
                  <p className="text-xs text-ink-secondary mt-2 leading-relaxed">
                    {ch.desc}
                  </p>
                </div>
              </div>

              {/* Actions: Open link + Copy button */}
              <div className="flex items-center gap-2 pt-2">
                <a
                  href={ch.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all shadow-sm ${ch.btnColor}`}
                >
                  <span>{ch.action}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                {ch.copyValue && (
                  <button
                    type="button"
                    onClick={() => handleCopy(ch.copyValue, ch.id)}
                    className="p-3 rounded-xl bg-surface-elevated hover:bg-surface-muted text-ink-primary border border-surface-muted transition-colors shrink-0"
                    title={`Copy ${ch.title}`}
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-brand-primary" />
                    ) : (
                      <Copy className="w-4 h-4 text-ink-muted" />
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quote Banner */}
      <div className="bg-brand-dark rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-elevated">
        <div className="space-y-2 text-center sm:text-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary text-brand-accent text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Formal Project Inquiries</span>
          </div>
          <h3 className="text-xl font-bold">Looking for a custom project quote & roadmap?</h3>
          <p className="text-xs text-surface-bg/80 max-w-md leading-relaxed">
            Fill in your project specifications and receive a fixed-price proposal within 24 hours.
          </p>
        </div>

        <Link
          to={`/${language}/quote`}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold text-brand-dark bg-brand-accent hover:bg-white transition-all shadow-glow shrink-0"
        >
          <span>{t('nav.getQuote')}</span>
          <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
