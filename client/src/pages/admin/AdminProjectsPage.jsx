import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Lock,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import Modal from '../../components/common/Modal';

export default function AdminProjectsPage() {
  const { language, t, isRtl } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const initialForm = {
    title: '',
    client_name: '',
    service_type: 'Landing Pages',
    status: 'in_discussion',
    start_date: new Date().toISOString().split('T')[0],
    target_delivery: '',
    budget: '1,000 MAD',
    contact_email: '',
    contact_phone: '',
    notes: '',
    progress_percentage: 10,
  };

  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchProjects = () => {
    setLoading(true);
    api.projects
      .getAll({ status: statusFilter, search })
      .then((data) => setProjects(data.projects || []))
      .catch((err) => console.error('Failed to fetch projects:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, [statusFilter, search]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setFormData(initialForm);
    setModalError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj) => {
    setModalMode('edit');
    setSelectedProjectId(proj.id);
    setFormData({
      title: proj.title,
      client_name: proj.client_name,
      service_type: proj.service_type,
      status: proj.status,
      start_date: proj.start_date || '',
      target_delivery: proj.target_delivery || '',
      budget: proj.budget || '',
      contact_email: proj.contact_email || '',
      contact_phone: proj.contact_phone || '',
      notes: proj.notes || '',
      progress_percentage: proj.progress_percentage || 0,
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    setSaving(true);
    setModalError('');

    try {
      if (modalMode === 'create') {
        await api.projects.create(formData);
      } else {
        await api.projects.update(selectedProjectId, formData);
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      setModalError(err.message || t('admin.projects.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('admin.projects.deleteConfirm'))) {
      try {
        await api.projects.delete(id);
        fetchProjects();
      } catch (err) {
        alert(err.message || t('admin.projects.deleteFailed'));
      }
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      in_discussion: { bg: 'bg-amber-100 text-amber-800', label: t('admin.projects.inDiscussion') },
      in_progress: { bg: 'bg-blue-100 text-blue-800', label: t('admin.projects.inProgress') },
      completed: { bg: 'bg-emerald-100 text-emerald-800', label: t('admin.projects.completed') },
      on_hold: { bg: 'bg-gray-100 text-gray-800', label: t('admin.projects.onHold') },
    };
    const s = map[status] || { bg: 'bg-surface-muted text-ink-primary', label: status };
    return <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${s.bg}`}>{s.label}</span>;
  };

  return (
    <div className="space-y-8">
      {/* Header & Confidentiality Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-ink-primary tracking-tight">
              {t('admin.projects.title')}
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-surface-charcoal text-brand-accent flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>{t('admin.projects.confidentialBadge')}</span>
            </span>
          </div>
          <p className="text-xs text-ink-secondary mt-1">
            {t('admin.projects.subtitle')}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-dark hover:bg-brand-primary active:scale-95 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{t('admin.projects.addProject')}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-surface-card rounded-2xl p-4 border border-surface-muted shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className={`w-4 h-4 text-ink-muted absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('admin.projects.searchPlaceholder')}
            className={`w-full ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 rounded-xl text-xs border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/40`}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-ink-muted" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none font-semibold text-ink-primary"
          >
            <option value="all">{t('admin.projects.statusFilter')}</option>
            <option value="in_discussion">{t('admin.projects.inDiscussion')}</option>
            <option value="in_progress">{t('admin.projects.inProgress')}</option>
            <option value="completed">{t('admin.projects.completed')}</option>
            <option value="on_hold">{t('admin.projects.onHold')}</option>
          </select>
        </div>
      </div>

      {/* Projects CRM Table / Cards */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-ink-muted">{t('admin.projects.loading')}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 bg-surface-card rounded-3xl border border-surface-muted">
          <p className="text-xs text-ink-muted">{t('admin.projects.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-surface-card rounded-3xl p-6 border border-surface-muted shadow-soft hover:shadow-card transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-ink-primary">{proj.title}</h2>
                    <p className="text-xs font-semibold text-brand-dark mt-0.5">
                      {proj.client_name} • <span className="text-ink-muted">{proj.service_type}</span>
                    </p>
                  </div>
                  {getStatusBadge(proj.status)}
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-ink-secondary">
                    <span>{t('admin.projects.deliveryProgress')}</span>
                    <span>{proj.progress_percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-muted overflow-hidden">
                    <div
                      className="h-full bg-brand-primary rounded-full transition-all duration-300"
                      style={{ width: `${proj.progress_percentage}%` }}
                    />
                  </div>
                </div>

                {/* Key metadata grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-surface-elevated/70 flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-brand-primary" />
                    <div>
                      <span className="text-ink-muted block text-[10px]">{t('admin.projects.valueBudget')}</span>
                      <span className="font-mono font-bold text-ink-primary">{proj.budget || t('admin.common.tbd')}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-surface-elevated/70 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                    <div>
                      <span className="text-ink-muted block text-[10px]">{t('admin.projects.deliveryTarget')}</span>
                      <span className="font-bold text-ink-primary">{proj.target_delivery || t('admin.common.flexible')}</span>
                    </div>
                  </div>
                </div>

                {/* Confidential Brief & Notes */}
                {proj.notes && (
                  <div className="p-3 rounded-xl bg-brand-subtle/30 border border-brand-primary/10 text-xs text-ink-secondary space-y-1">
                    <div className="flex items-center gap-1 font-bold text-brand-dark text-[10px] uppercase tracking-wider">
                      <FileText className="w-3 h-3" />
                      <span>{t('admin.projects.confidentialNotes')}</span>
                    </div>
                    <p className="line-clamp-3 leading-relaxed">{proj.notes}</p>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-surface-muted/60 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-ink-muted">
                  {proj.contact_email && (
                    <a
                      href={`mailto:${proj.contact_email}`}
                      className="hover:text-brand-dark"
                      title={proj.contact_email}
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                  {proj.contact_phone && (
                    <a
                      href={`tel:${proj.contact_phone}`}
                      className="hover:text-brand-dark"
                      title={proj.contact_phone}
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(proj)}
                    className="p-2 rounded-xl text-ink-secondary hover:text-brand-dark hover:bg-surface-elevated transition-colors"
                    title={t('admin.projects.editTitle')}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(proj.id)}
                    className="p-2 rounded-xl text-ink-secondary hover:text-red-600 hover:bg-red-50 transition-colors"
                    title={t('admin.projects.deleteTitle')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Modal (Create / Edit) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? t('admin.projects.addProject') : t('admin.projects.editProject')}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveProject} className="space-y-4">
          {modalError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink-primary">{t('admin.projects.form.titleLabel')}</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t('admin.projects.form.titlePlaceholder')}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/40"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink-primary">{t('admin.projects.form.clientLabel')}</label>
              <input
                type="text"
                required
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                placeholder={t('admin.projects.form.clientPlaceholder')}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink-primary">{t('admin.projects.form.serviceType')}</label>
              <select
                value={formData.service_type}
                onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none"
              >
                <option value="Landing Pages">{t('admin.projects.form.serviceLanding')}</option>
                <option value="Dashboards & SaaS">{t('admin.projects.form.serviceDashboards')}</option>
                <option value="E-commerce">{t('admin.projects.form.serviceEcommerce')}</option>
                <option value="Custom MERN">{t('admin.projects.form.serviceCustom')}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink-primary">{t('admin.projects.form.statusLabel')}</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none"
              >
                <option value="in_discussion">{t('admin.projects.inDiscussion')}</option>
                <option value="in_progress">{t('admin.projects.inProgress')}</option>
                <option value="completed">{t('admin.projects.completed')}</option>
                <option value="on_hold">{t('admin.projects.onHold')}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink-primary">{t('admin.projects.form.budgetLabel')}</label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder={t('admin.projects.form.budgetPlaceholder')}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink-primary">{t('admin.projects.form.startDate')}</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink-primary">{t('admin.projects.form.targetDelivery')}</label>
              <input
                type="date"
                value={formData.target_delivery}
                onChange={(e) => setFormData({ ...formData, target_delivery: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink-primary">{t('admin.projects.form.clientEmail')}</label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                placeholder={t('admin.projects.form.emailPlaceholder')}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink-primary">{t('admin.projects.form.clientPhone')}</label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                placeholder={t('admin.projects.form.phonePlaceholder')}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Progress Slider */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs font-bold text-ink-primary">
              <span>{t('admin.projects.form.progressLabel')}</span>
              <span>{formData.progress_percentage}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.progress_percentage}
              onChange={(e) => setFormData({ ...formData, progress_percentage: parseInt(e.target.value, 10) })}
              className="w-full accent-brand-primary cursor-pointer"
            />
          </div>

          {/* Confidential Notes */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-ink-primary">
              {t('admin.projects.form.notesLabel')}
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t('admin.projects.form.notesPlaceholder')}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none leading-relaxed"
            />
          </div>

          <div className="pt-3 border-t border-surface-muted/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-ink-secondary hover:bg-surface-elevated"
            >
              {t('admin.common.cancel')}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-dark hover:bg-brand-primary transition-colors disabled:opacity-50"
            >
              {saving ? t('admin.projects.saving') : t('admin.projects.save')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
