import React, { useState, useEffect } from 'react';
import {
  Star,
  Quote,
  CheckCircle2,
  Sparkles,
  MessageSquarePlus,
  Filter,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import RatingStars from '../../components/common/RatingStars';
import Modal from '../../components/common/Modal';
import SEO from '../../components/common/SEO';

export default function ReviewsPage() {
  const { language, t } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Review submission form state
  const [formData, setFormData] = useState({
    client_name: '',
    role_company: '',
    service_type: 'Landing Pages',
    rating: 5,
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fetchReviews = () => {
    setLoading(true);
    api.reviews
      .getPublic()
      .then((data) => setReviews(data.reviews || []))
      .catch((err) => console.error('Failed to load reviews:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      await api.reviews.submit(formData);
      setSubmitSuccess(true);
      setFormData({
        client_name: '',
        role_company: '',
        service_type: 'Landing Pages',
        rating: 5,
        comment: '',
      });
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews =
    selectedRatingFilter === 'all'
      ? reviews
      : reviews.filter((r) => r.rating === parseInt(selectedRatingFilter, 10));

  return (
    <>
      <SEO
        title={t('seo.reviews.title')}
        description={t('seo.reviews.description')}
        locale={language}
        url={`/${language}/reviews`}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-surface-muted">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-brand-subtle px-3 py-1 rounded-full inline-block mb-3">
            {t('nav.reviews')}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-ink-primary tracking-tight">
            {t('reviews.title')}
          </h1>
          <p className="text-sm sm:text-base text-ink-secondary mt-2 max-w-xl font-medium">
            {t('reviews.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              setSubmitSuccess(false);
              setSubmitError('');
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-brand-dark hover:bg-brand-primary active:scale-95 transition-all shadow-soft"
          >
            <MessageSquarePlus className="w-4 h-4 text-brand-accent" />
            <span>{t('reviews.leaveReviewBtn')}</span>
          </button>
        </div>
      </div>

      {/* Trust Rating Bar & Filter */}
      <div className="bg-surface-card rounded-2xl p-6 border border-surface-muted shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <RatingStars rating={5} size="md" />
            <span className="text-lg font-black text-brand-dark font-mono ml-1">5.0</span>
          </div>
          <span className="text-xs font-semibold text-ink-muted border-l border-surface-muted pl-4">
            {reviews.length} Verified Testimonials
          </span>
        </div>

        {/* Rating Filter buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-muted font-medium">Filter:</span>
          {['all', '5', '4'].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setSelectedRatingFilter(val)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                selectedRatingFilter === val
                  ? 'bg-brand-dark text-white'
                  : 'bg-surface-elevated hover:bg-surface-muted text-ink-secondary'
              }`}
            >
              {val === 'all' ? 'All' : `${val} Stars`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-ink-muted">Loading verified client reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-16 bg-surface-card rounded-3xl border border-surface-muted">
          <p className="text-sm font-semibold text-ink-secondary">No reviews match your selected filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((r) => (
            <div
              key={r.id}
              className="bg-surface-card rounded-3xl p-7 border border-surface-muted shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <RatingStars rating={r.rating} size="sm" />
                  <span className="text-[10px] font-bold text-brand-primary bg-brand-subtle px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-brand-accent" />
                    <span>Verified Client</span>
                  </span>
                </div>

                <Quote className="w-6 h-6 text-brand-accent/40" />

                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed italic">
                  "{r.comment}"
                </p>
              </div>

              <div className="pt-5 mt-6 border-t border-surface-muted/60 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-ink-primary">{r.client_name}</h3>
                  <p className="text-[11px] text-ink-muted mt-0.5">{r.role_company || 'Client'}</p>
                </div>
                {r.service_type && (
                  <span className="text-[10px] font-medium text-ink-muted px-2 py-0.5 rounded bg-surface-elevated">
                    {r.service_type}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Submission Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t('reviews.modalTitle')}
        maxWidth="max-w-lg"
      >
        {submitSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-brand-subtle text-brand-primary flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-ink-primary">
              Review Submitted Successfully!
            </h4>
            <p className="text-xs text-ink-secondary leading-relaxed max-w-sm mx-auto">
              {t('reviews.form.success')}
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="mt-4 px-6 py-2 rounded-xl text-xs font-bold text-white bg-brand-dark hover:bg-brand-primary transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <p className="text-xs text-ink-muted mb-2">
              {t('reviews.modalSubtitle')}
            </p>

            {submitError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Star rating selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-ink-primary">
                {t('reviews.form.rating')} *
              </label>
              <div className="flex items-center gap-2">
                <RatingStars
                  rating={formData.rating}
                  size="md"
                  interactive
                  onRatingChange={(r) => setFormData({ ...formData, rating: r })}
                />
                <span className="text-xs font-bold text-brand-dark">({formData.rating} / 5)</span>
              </div>
            </div>

            {/* Client Name */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink-primary">
                {t('reviews.form.name')} *
              </label>
              <input
                type="text"
                required
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                placeholder="e.g. Karim Bennani"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/40"
              />
            </div>

            {/* Role & Company */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink-primary">
                {t('reviews.form.role')}
              </label>
              <input
                type="text"
                value={formData.role_company}
                onChange={(e) => setFormData({ ...formData, role_company: e.target.value })}
                placeholder="e.g. Founder, NorthTech Media"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/40"
              />
            </div>

            {/* Service Type */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink-primary">
                {t('reviews.form.service')}
              </label>
              <select
                value={formData.service_type}
                onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/40"
              >
                <option value="Landing Pages">Landing Pages</option>
                <option value="Dashboards & SaaS">Dashboards & SaaS</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Custom Fullstack">Custom Fullstack</option>
              </select>
            </div>

            {/* Review Comment */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink-primary">
                {t('reviews.form.comment')} *
              </label>
              <textarea
                required
                rows={4}
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder="Share how the development process went, speed, communication, ROI..."
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/40 leading-relaxed"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-brand-dark hover:bg-brand-primary transition-colors disabled:opacity-50"
              >
                {submitting ? t('reviews.form.submitting') : t('reviews.form.submit')}
              </button>
            </div>
          </form>
          )}
        </Modal>
      </div>
    </>
  );
}
