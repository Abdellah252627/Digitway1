import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Sparkles, Layers, Layout, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { formatPrice, getServicePricing } from '../../config/pricing';

export default function Navbar() {
  const { language, t, isRtl } = useLanguage();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    return location.pathname === `/${language}${path}` || (path === '' && location.pathname === `/${language}`);
  };

  const navLinks = [
    { label: t('nav.home'), path: '' },
    {
      label: t('nav.services'),
      path: '/services',
      hasDropdown: true,
      children: [
        {
          label: t('nav.landingPages'),
          path: '/services/landing-pages',
          icon: Layout,
          desc: 'High-converting & fast marketing pages',
          price: formatPrice(getServicePricing().landingPages.startingPrice, language),
        },
        {
          label: t('nav.dashboards'),
          path: '/services/dashboards',
          icon: Layers,
          desc: 'Fullstack web apps & analytics tools',
          price: formatPrice(getServicePricing().dashboards.startingPrice, language),
        },
        {
          label: t('nav.ecommerce'),
          path: '/services/ecommerce',
          icon: ShoppingBag,
          desc: 'Custom digital stores & checkout flows',
          price: formatPrice(getServicePricing().ecommerce.startingPrice, language),
        },
      ],
    },
    { label: t('nav.portfolio'), path: '/portfolio' },
    { label: t('nav.process'), path: '/process' },
    { label: t('nav.reviews'), path: '/reviews' },
    { label: t('nav.contactLinks'), path: '/contact-links' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-surface-bg/90 backdrop-blur-md shadow-soft border-b border-surface-muted/70 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to={`/${language}`}
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="Digitway Home"
          >
            <div className="w-9 h-9 rounded-xl bg-brand-dark flex items-center justify-center shadow-sm text-white group-hover:bg-brand-primary transition-colors">
              <span className="font-mono font-black text-lg text-brand-accent tracking-tighter">D</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-ink-primary group-hover:text-brand-dark transition-colors">
                Digitway<span className="text-brand-primary">.</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              if (link.hasDropdown) {
                return (
                  <div
                    key={link.path}
                    className="relative"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <Link
                      to={`/${language}${link.path}`}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        location.pathname.includes('/services')
                          ? 'text-brand-primary bg-brand-subtle/60'
                          : 'text-ink-secondary hover:text-ink-primary hover:bg-surface-muted/50'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          servicesDropdownOpen ? 'rotate-180 text-brand-primary' : ''
                        }`}
                      />
                    </Link>

                    {/* Services Dropdown */}
                    {servicesDropdownOpen && (
                      <div
                        className={`absolute ${
                          isRtl ? 'right-0' : 'left-0'
                        } mt-1 w-80 rounded-2xl bg-surface-card shadow-elevated border border-surface-muted p-2 z-50 animate-in fade-in zoom-in-95 duration-150`}
                      >
                        <div className="px-3 py-2 border-b border-surface-muted/50 mb-1 flex items-center justify-between">
                          <Link
                            to={`/${language}/services`}
                            className="text-xs font-bold uppercase tracking-wider text-brand-primary hover:underline flex items-center gap-1"
                          >
                            <span>{t('nav.allServices')}</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </Link>
                        </div>
                        {link.children.map((sub) => {
                          const Icon = sub.icon;
                          return (
                            <Link
                              key={sub.path}
                              to={`/${language}${sub.path}`}
                              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-elevated transition-colors group"
                            >
                              <div className="p-2 rounded-lg bg-brand-subtle text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="text-xs font-bold text-ink-primary group-hover:text-brand-dark">
                                    {sub.label}
                                  </p>
                                  <span className="text-[10px] font-mono font-semibold text-brand-primary bg-brand-subtle px-1.5 py-0.5 rounded">
                                    {sub.price}
                                  </span>
                                </div>
                                <p className="text-[11px] text-ink-muted line-clamp-1 mt-0.5">
                                  {sub.desc}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={`/${language}${link.path}`}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive(link.path)
                      ? 'text-brand-primary bg-brand-subtle/60 font-bold'
                      : 'text-ink-secondary hover:text-ink-primary hover:bg-surface-muted/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions: Language Switcher + Get a Quote CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Globe Language Switcher in top-right */}
            <LanguageSwitcher />

            {/* CTA Button */}
            <Link
              to={`/${language}/quote`}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-dark hover:bg-brand-primary active:scale-95 shadow-sm hover:shadow-glow transition-all duration-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
              <span>{t('nav.getQuote')}</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-ink-primary hover:bg-surface-muted focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-surface-muted/70 bg-surface-card rounded-2xl p-4 shadow-elevated animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-1">
              {navLinks.map((link) => {
                if (link.hasDropdown) {
                  return (
                    <div key={link.path} className="space-y-1">
                      <Link
                        to={`/${language}${link.path}`}
                        className="block px-3 py-2.5 rounded-xl text-sm font-bold text-ink-primary bg-surface-elevated"
                      >
                        {link.label}
                      </Link>
                      <div className="pl-4 pr-4 space-y-1 my-1">
                        {link.children.map((sub) => (
                          <Link
                            key={sub.path}
                            to={`/${language}${sub.path}`}
                            className="block px-3 py-2 rounded-lg text-xs font-semibold text-ink-secondary hover:text-brand-primary"
                          >
                            • {sub.label} ({sub.price})
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.path}
                    to={`/${language}${link.path}`}
                    className={`block px-3 py-2.5 rounded-xl text-sm font-semibold ${
                      isActive(link.path)
                        ? 'bg-brand-subtle text-brand-dark font-bold'
                        : 'text-ink-secondary hover:bg-surface-muted/50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="pt-3 mt-2 border-t border-surface-muted/60">
                <Link
                  to={`/${language}/quote`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-brand-dark hover:bg-brand-primary transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-brand-accent" />
                  <span>{t('nav.getQuote')}</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
