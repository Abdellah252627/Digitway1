import React from 'react';
import { MessageSquare, Clock, Zap, ArrowUpRight, Phone, CheckCircle2, Sparkles } from 'lucide-react';

// ============================================
// VARIATION 1: MINIMALIST — Optimized for Footer
// ============================================
export function WhatsappContactFooter() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-950/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
        <MessageSquare className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-ink-primary">WhatsApp</span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
            <Clock className="w-2.5 h-2.5" />
            &lt; 2h
          </span>
        </div>
        <a
          href="https://wa.me/212664173090"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-ink-secondary hover:text-emerald-600 transition-colors"
        >
          +212 664-173090
        </a>
      </div>
      <a
        href="https://wa.me/212664173090"
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 p-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
        aria-label="Chat on WhatsApp"
      >
        <ArrowUpRight className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

// ============================================
// VARIATION 2: COMPREHENSIVE — Contact Page Card
// ============================================
export function WhatsappContactCard() {
  return (
    <div className="bg-surface-card rounded-3xl p-6 sm:p-8 border border-surface-muted shadow-soft hover:shadow-card transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-sm">
          <MessageSquare className="w-7 h-7 text-white" />
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">
          <Zap className="w-3 h-3" />
          Fastest Response — Under 2 Hours
        </span>
      </div>

      {/* Content */}
      <div className="space-y-4 mb-6">
        <h3 className="text-xl font-bold text-ink-primary">WhatsApp Direct Chat</h3>
        <p className="text-sm text-ink-secondary leading-relaxed">
          Instant messaging for quick questions, availability checks, and project scoping.
          Get a real-time response during business hours.
        </p>

        {/* Number Display */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-elevated border border-surface-muted">
          <Phone className="w-4 h-4 text-ink-muted" />
          <div className="flex-1">
            <p className="text-[11px] text-ink-muted font-medium">Direct Number</p>
            <p className="text-sm font-bold text-ink-primary font-mono">+212 664-173090</p>
          </div>
          <button
            onClick={() => navigator.clipboard?.writeText('+212664173090')}
            className="p-2 rounded-lg hover:bg-surface-muted text-ink-muted hover:text-ink-primary transition-colors"
            title="Copy number"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* CTA Button */}
      <a
        href="https://wa.me/212664173090?text=Hello%2C%20I%27m%20interested%20in%20your%20services%20and%20would%20like%20to%20discuss%20a%20project."
        target="_blank"
        rel="noopener noreferrer"
        className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-sm"
      >
        <MessageSquare className="w-4 h-4" />
        <span>Start WhatsApp Conversation</span>
        <ArrowUpRight className="w-4 h-4" />
      </a>

      {/* Trust Indicators */}
      <div className="mt-4 pt-4 border-t border-surface-muted/60 flex items-center justify-center gap-4 text-[11px] text-ink-muted">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Available Mon–Sat
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Typically replies in &lt; 2h
        </span>
      </div>
    </div>
  );
}

// ============================================
// VARIATION 3: CREATIVE — Brand-Focused Banner
// ============================================
export function WhatsappContactBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 rounded-3xl p-8 sm:p-10 text-white shadow-elevated">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-accent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
        {/* Left: Icon + Badge */}
        <div className="shrink-0 text-center lg:text-left">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-4 mx-auto lg:mx-0 border border-white/20">
            <MessageSquare className="w-10 h-10 text-emerald-300" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-accent/20 text-brand-accent text-xs font-bold border border-brand-accent/30">
            <Sparkles className="w-3 h-3" />
            Fastest Response — Under 2 Hours
          </span>
        </div>

        {/* Right: Content + CTA */}
        <div className="flex-1 text-center lg:text-left">
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-tight">
            Let's Bring Your Vision to Life,<br />
            <span className="text-brand-accent">One Message Away.</span>
          </h3>
          <p className="text-emerald-100/80 text-sm leading-relaxed mb-6 max-w-lg">
            Have a quick question? Want to check availability or scope a project?
            Skip the formalities — drop me a WhatsApp message and get a real,
            human response in under 2 hours during business hours.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href="https://wa.me/212664173090?text=Hey!%20I%20have%20a%20project%20in%20mind%20and%20would%20love%20to%20chat%20about%20it."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-emerald-900 bg-brand-accent hover:bg-white transition-all shadow-glow"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat Now on WhatsApp</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <div className="flex items-center gap-2 text-emerald-200/60 text-xs">
              <Phone className="w-3.5 h-3.5" />
              <span className="font-mono">+212 664-173090</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Combined export for easy import
export default {
  WhatsappContactFooter,
  WhatsappContactCard,
  WhatsappContactBanner,
};
