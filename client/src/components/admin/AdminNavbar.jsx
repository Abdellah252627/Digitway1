import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Inbox,
  FileEdit,
  Star,
  Bell,
  LogOut,
  ExternalLink,
  CheckCircle,
  CheckCheck,
  Trash2,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from '../common/LanguageSwitcher';

export default function AdminNavbar() {
  const { admin, logout } = useAuth();
  const { language, t, isRtl } = useLanguage();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifRef = useRef(null);

  const navItems = [
    { label: t('admin.nav.overview'), path: '/admin', icon: LayoutDashboard },
    { label: t('admin.nav.projects'), path: '/admin/projects', icon: FolderKanban },
    { label: t('admin.nav.quotes'), path: '/admin/quotes', icon: Inbox },
    { label: t('admin.nav.content'), path: '/admin/content', icon: FileEdit },
    { label: t('admin.nav.reviews'), path: '/admin/reviews', icon: Star },
  ];

  // Close notifications dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-surface-charcoal text-white border-b border-surface-muted/20 shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand */}
          <div className="flex items-center gap-6">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white">
                <span className="font-mono font-black text-brand-accent text-sm">D</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight">{t('admin.nav.brandTitle')}</span>
                <span className="text-[10px] text-brand-accent font-medium tracking-wide uppercase">
                  {t('admin.nav.brandSubtitle')}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-brand-primary text-white shadow-sm'
                        : 'text-ink-muted hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Header Actions: Notification Bell + View Site + Logout */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-xl text-ink-muted hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Menu */}
              {notifDropdownOpen && (
                <div
                  className={`absolute ${
                    isRtl ? 'left-0' : 'right-0'
                  } mt-2 w-80 sm:w-96 rounded-2xl bg-surface-card text-ink-primary shadow-elevated border border-surface-muted p-3 z-50 animate-in fade-in zoom-in-95 duration-150`}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-surface-muted/60 px-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{t('admin.nav.notifications')}</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-subtle text-brand-dark">
                          {unreadCount} {t('admin.nav.newBadge')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllAsRead}
                          className="text-brand-primary hover:underline font-medium flex items-center gap-1"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>{t('admin.nav.markAllRead')}</span>
                        </button>
                      )}
                      {notifications.length > 0 && (
                        <button
                          type="button"
                          onClick={clearAll}
                          className="text-ink-muted hover:text-red-500 transition-colors"
                          title="Clear all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* List */}
                  <div className="max-h-80 overflow-y-auto space-y-1.5 pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-center py-6 text-xs text-ink-muted">
                        {t('admin.nav.noNotifications')}
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            if (!n.is_read) markAsRead(n.id);
                            if (n.link) {
                              setNotifDropdownOpen(false);
                              navigate(n.link);
                            }
                          }}
                          className={`p-2.5 rounded-xl cursor-pointer transition-colors text-start ${
                            n.is_read
                              ? 'bg-surface-elevated/40 hover:bg-surface-elevated text-ink-secondary'
                              : 'bg-brand-subtle/40 hover:bg-brand-subtle/70 text-ink-primary font-medium border-l-4 border-brand-primary'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-brand-dark">{n.title}</span>
                            <span className="text-[10px] text-ink-muted">
                              {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-ink-secondary mt-0.5 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* View Public Website */}
            <Link
              to={`/${language}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-ink-muted hover:text-white hover:bg-white/10 transition-colors"
              title={t('admin.nav.viewSiteTitle')}
            >
              <span>{t('admin.nav.viewSite')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Admin User & Logout */}
            <div className={`flex items-center gap-2 ${isRtl ? 'pr-2 border-r' : 'pl-2 border-l'} border-white/10`}>
              <span className="hidden lg:inline-block text-xs font-medium text-ink-muted">
                {admin?.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-red-500/80 text-white transition-colors"
                title={t('admin.nav.signOutTitle')}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('admin.nav.logout')}</span>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-ink-muted hover:text-white"
              aria-label={t('admin.nav.toggleMenu')}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-white/10 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold ${
                    active ? 'bg-brand-primary text-white' : 'text-ink-muted hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
