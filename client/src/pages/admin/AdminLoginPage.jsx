import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, KeyRound, ArrowRight, Sparkles, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';

export default function AdminLoginPage() {
  const { requestOtp, verifyOtp, isAuthenticated } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [email, setEmail] = useState('admin@digitway.com');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { isRtl } = useLanguage();

  // If already authenticated, redirect to /admin
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await requestOtp(email);
      setSuccessMsg(res.message || t('admin.login.codeSent'));
      if (res.devOtp) {
        setDevOtp(res.devOtp);
      }
      setStep('otp');
    } catch (err) {
      setErrorMsg(err.message || t('admin.login.sendFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await verifyOtp(email, otp);
      navigate('/admin');
    } catch (err) {
      setErrorMsg(err.message || t('admin.login.invalidCode'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-4">
        {/* Language Switcher */}
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
        <div className="bg-surface-card rounded-3xl p-8 sm:p-10 border border-surface-muted shadow-elevated space-y-8">
        {/* Brand / Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-dark flex items-center justify-center text-white mx-auto shadow-sm">
            <Lock className="w-6 h-6 text-brand-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-ink-primary">
              {step === 'email' ? t('admin.login.title') : t('admin.login.enterCodeTitle')}
            </h1>
            <p className="text-xs text-ink-secondary mt-1">
              {step === 'email'
                ? t('admin.login.subtitle')
                : `${t('admin.login.enterCodeSubtitle')} ${email}`}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && step === 'otp' && (
          <div className="p-3.5 rounded-xl bg-brand-subtle text-brand-dark text-xs flex items-center gap-2 border border-brand-primary/20">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-brand-primary" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Step 1: Email Input */}
        {step === 'email' ? (
          <form onSubmit={handleSendCode} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-ink-primary">
                {t('admin.login.emailLabel')}
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3.5' : 'left-0 pl-3.5'} flex items-center pointer-events-none text-ink-muted`}>
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('admin.login.emailPlaceholder')}
                  className={`w-full ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 rounded-xl text-xs font-medium border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/40`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-brand-dark hover:bg-brand-primary active:scale-95 shadow-soft transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-brand-accent" />
              <span>{loading ? t('admin.login.sending') : t('admin.login.sendCodeBtn')}</span>
            </button>
          </form>
        ) : (
          /* Step 2: OTP Code Verification */
          <form onSubmit={handleVerifyCode} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-ink-primary">
                {t('admin.login.codeLabel')}
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="000000"
                className="w-full text-center tracking-[0.4em] font-mono text-xl py-3 rounded-xl border border-brand-primary bg-surface-elevated focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/40"
              />
            </div>

            {/* Dev Mode OTP auto-fill button */}
            {devOtp && (
              <div className="p-3 rounded-xl bg-surface-elevated border border-surface-muted text-center space-y-1">
                <p className="text-[11px] text-ink-muted">{t('admin.login.devNotice')}</p>
                <button
                  type="button"
                  onClick={() => setOtp(devOtp)}
                  className="inline-flex items-center gap-1 text-xs font-mono font-bold text-brand-primary hover:underline bg-brand-subtle px-2 py-0.5 rounded"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>
                    {t('admin.login.fillDevCode')}: [{devOtp}]
                  </span>
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-brand-dark hover:bg-brand-primary active:scale-95 shadow-soft transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? t('admin.login.verifying') : t('admin.login.verifyBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between text-xs text-ink-muted pt-2 border-t border-surface-muted/60">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="hover:text-brand-dark font-medium"
              >
                {t('admin.login.changeEmailBtn')}
              </button>
              <button
                type="button"
                onClick={handleSendCode}
                className="hover:text-brand-dark font-medium"
              >
                {t('admin.login.resendBtn')}
              </button>
            </div>
          </form>
        )}

        <div className="text-center">
          <p className="text-[11px] text-ink-muted flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
            <span>{t('admin.login.footerSecurity')}</span>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
