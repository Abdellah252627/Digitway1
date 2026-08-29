import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import ServicesPage from './pages/public/ServicesPage';
import ServiceDetailPage from './pages/public/ServiceDetailPage';
import PortfolioPage from './pages/public/PortfolioPage';
import ProcessPage from './pages/public/ProcessPage';
import ContactLinksPage from './pages/public/ContactLinksPage';
import ReviewsPage from './pages/public/ReviewsPage';
import QuotePage from './pages/public/QuotePage';
import PrivacyPage from './pages/public/PrivacyPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import AdminProjectsPage from './pages/admin/AdminProjectsPage';
import AdminQuotesPage from './pages/admin/AdminQuotesPage';
import AdminContentPage from './pages/admin/AdminContentPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';

// Language Root Redirector
function RootRedirect() {
  const saved = localStorage.getItem('digitway_lang') || 'en';
  const target = saved === 'ar' ? 'ar' : 'en';
  return <Navigate to={`/${target}`} replace />;
}

// 404 Page
function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <span className="font-mono text-6xl font-black text-brand-primary">404</span>
      <h1 className="text-2xl font-bold text-ink-primary mt-2">Page Not Found</h1>
      <p className="text-xs text-ink-muted mt-1 max-w-sm">
        The requested page does not exist or may have been moved.
      </p>
      <a
        href="/en"
        className="mt-6 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-dark hover:bg-brand-primary transition-colors"
      >
        Return to Homepage
      </a>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Root redirect to localized route */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public Localized Routes (e.g., /en/..., /ar/...) */}
      <Route path="/:lang" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="services/:serviceType" element={<ServiceDetailPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="process" element={<ProcessPage />} />
        <Route path="contact-links" element={<ContactLinksPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="quote" element={<QuotePage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin Panel Protected Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminOverviewPage />} />
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="quotes" element={<AdminQuotesPage />} />
        <Route path="content" element={<AdminContentPage />} />
        <Route path="reviews" element={<AdminReviewsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
