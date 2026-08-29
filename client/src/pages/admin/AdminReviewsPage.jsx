import React, { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit2,
  Quote,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import RatingStars from '../../components/common/RatingStars';
import Modal from '../../components/common/Modal';

export default function AdminReviewsPage() {
  const { language, t, isRtl } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('pending'); // 'pending' | 'approved' | 'rejected'

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editForm, setEditForm] = useState({
    client_name: '',
    role_company: '',
    rating: 5,
    comment: '',
    service_type: '',
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchReviews = () => {
    setLoading(true);
    api.reviews
      .getAll({ status: currentTab })
      .then((data) => setReviews(data.reviews || []))
      .catch((err) => console.error('Failed to load reviews for moderation:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, [currentTab]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.reviews.updateStatus(id, { status: newStatus });
      fetchReviews();
    } catch (err) {
      alert(err.message || t('admin.reviewMod.statusFailed'));
    }
  };

  const handleToggleFeatured = async (id, currentVal) => {
    try {
      await api.reviews.updateStatus(id, { is_featured: currentVal ? 0 : 1 });
      fetchReviews();
    } catch (err) {
      alert(err.message || t('admin.reviewMod.featuredFailed'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('admin.reviewMod.deleteConfirm'))) {
      try {
        await api.reviews.delete(id);
        fetchReviews();
      } catch (err) {
        alert(err.message || t('admin.reviewMod.deleteFailed'));
      }
    }
  };

  const handleOpenEdit = (rev) => {
    setSelectedReview(rev);
    setEditForm({
      client_name: rev.client_name,
      role_company: rev.role_company || '',
      rating: rev.rating,
      comment: rev.comment,
      service_type: rev.service_type || 'General',
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      await api.reviews.update(selectedReview.id, editForm);
      setIsEditOpen(false);
      fetchReviews();
    } catch (err) {
      alert(err.message || t('admin.reviewMod.saveFailed'));
    } finally {
      setSavingEdit(false);
    }
  };

  const tabs = [
    { key: 'pending', label: t('admin.reviewMod.pendingTab') },
    { key: 'approved', label: t('admin.reviewMod.approvedTab') },
    { key: 'rejected', label: t('admin.reviewMod.rejectedTab') },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-ink-primary tracking-tight">
          {t('admin.reviewMod.title')}
        </h1>
        <p className="text-xs text-ink-secondary mt-1">
          {t('admin.reviewMod.subtitle')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-muted pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setCurrentTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              currentTab === tab.key
                ? 'bg-brand-dark text-white shadow-soft'
                : 'bg-surface-card hover:bg-surface-elevated text-ink-secondary border border-surface-muted'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-ink-muted">{t('admin.reviewMod.loading')}</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-surface-card rounded-3xl border border-surface-muted">
          <p className="text-xs text-ink-muted">{t('admin.reviewMod.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-surface-card rounded-3xl p-6 border border-surface-muted shadow-soft space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-bold text-ink-primary">{rev.client_name}</h2>
                    <p className="text-[11px] text-ink-muted">
                      {rev.role_company || t('admin.reviewMod.clientFallback')} • {rev.service_type || t('admin.reviewMod.generalFallback')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RatingStars rating={rev.rating} size="sm" />
                    <span className="text-xs font-bold font-mono text-brand-dark">({rev.rating}/5)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-surface-elevated/70 border border-surface-muted/60 text-xs text-ink-secondary leading-relaxed italic">
                  "{rev.comment}"
                </div>

                <div className="flex items-center justify-between text-[10px] text-ink-muted">
                  <span>{t('admin.reviewMod.received')}: {new Date(rev.created_at).toLocaleDateString()}</span>
                  {rev.is_featured === 1 && (
                    <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      {t('admin.reviewMod.featuredBadge')}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-surface-muted/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {currentTab === 'pending' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(rev.id, 'approved')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-brand-primary hover:bg-brand-dark transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t('admin.reviewMod.approveBtn')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(rev.id, 'rejected')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{t('admin.reviewMod.rejectBtn')}</span>
                      </button>
                    </>
                  )}

                  {currentTab === 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(rev.id, rev.is_featured)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        rev.is_featured
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-surface-elevated hover:bg-surface-muted text-ink-secondary'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>{rev.is_featured ? t('admin.reviewMod.unfeature') : t('admin.reviewMod.feature')}</span>
                    </button>
                  )}

                  {currentTab === 'rejected' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(rev.id, 'approved')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-brand-dark bg-brand-subtle hover:bg-brand-primary hover:text-white transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t('admin.reviewMod.reapprove')}</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(rev)}
                    className="p-1.5 rounded-lg text-ink-secondary hover:text-brand-dark hover:bg-surface-elevated transition-colors"
                    title={t('admin.reviewMod.editTitle')}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(rev.id)}
                    className="p-1.5 rounded-lg text-ink-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                    title={t('admin.reviewMod.deleteTitle')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Review Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={t('admin.reviewMod.editModalTitle')}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="block font-bold text-ink-primary">{t('admin.reviewMod.clientNameLabel')}</label>
            <input
              type="text"
              required
              value={editForm.client_name}
              onChange={(e) => setEditForm({ ...editForm, client_name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-ink-primary">{t('admin.reviewMod.roleLabel')}</label>
            <input
              type="text"
              value={editForm.role_company}
              onChange={(e) => setEditForm({ ...editForm, role_company: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-ink-primary">{t('admin.reviewMod.ratingLabel')}</label>
            <RatingStars
              rating={editForm.rating}
              size="md"
              interactive
              onRatingChange={(r) => setEditForm({ ...editForm, rating: r })}
            />
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-ink-primary">{t('admin.reviewMod.commentLabel')}</label>
            <textarea
              rows={4}
              required
              value={editForm.comment}
              onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none leading-relaxed"
            />
          </div>

          <div className="pt-2 border-t border-surface-muted/60 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 rounded-xl font-semibold text-ink-secondary hover:bg-surface-elevated"
            >
              {t('admin.common.cancel')}
            </button>
            <button
              type="submit"
              disabled={savingEdit}
              className="px-6 py-2 rounded-xl font-bold text-white bg-brand-dark hover:bg-brand-primary transition-colors disabled:opacity-50"
            >
              {savingEdit ? t('admin.reviewMod.saving') : t('admin.reviewMod.saveEdits')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
