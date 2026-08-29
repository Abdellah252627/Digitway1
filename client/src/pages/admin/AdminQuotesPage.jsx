import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle2,
  MessageSquare,
  Mail,
  ArrowRight,
  FolderPlus,
  Clock,
  DollarSign,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import Modal from '../../components/common/Modal';

export default function AdminQuotesPage() {
  const { language, t, isRtl } = useLanguage();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Selected Quote Detail Modal
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Convert to project modal
  const [isConvertOpen, setIsConvertOpen] = useState(false);
  const [convertData, setConvertData] = useState({
    client_name: '',
    target_delivery: '',
    notes: '',
  });
  const [converting, setConverting] = useState(false);

  const fetchQuotes = () => {
    setLoading(true);
    api.quotes
      .getAll({ status: statusFilter, search })
      .then((data) => setQuotes(data.quotes || []))
      .catch((err) => console.error('Failed to load quotes:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuotes();
  }, [statusFilter, search]);

  const handleOpenDetail = (quote) => {
    setSelectedQuote(quote);
    if (!quote.is_read) {
      api.quotes.updateStatus(quote.id, { is_read: 1 }).then(() => {
        setQuotes((prev) =>
          prev.map((q) => (q.id === quote.id ? { ...q, is_read: 1 } : q))
        );
      });
    }
    setIsDetailOpen(true);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.quotes.updateStatus(id, { status: newStatus });
      fetchQuotes();
    } catch (err) {
      alert(err.message || t('admin.quotes.updateStatusFailed'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('admin.quotes.deleteConfirm'))) {
      try {
        await api.quotes.delete(id);
        fetchQuotes();
      } catch (err) {
        alert(err.message || t('admin.quotes.deleteFailed'));
      }
    }
  };

  const handleOpenConvert = (quote) => {
    setSelectedQuote(quote);
    setConvertData({
      client_name: quote.email.split('@')[0],
      target_delivery: '',
      notes: `Requirements from Quote #${quote.id}:\n${quote.description}`,
    });
    setIsConvertOpen(true);
  };

  const handleConvertSubmit = async (e) => {
    e.preventDefault();
    setConverting(true);

    try {
      await api.quotes.convertToProject(selectedQuote.id, convertData);
      setIsConvertOpen(false);
      setIsDetailOpen(false);
      fetchQuotes();
      alert(t('admin.quotes.convertSuccess'));
    } catch (err) {
      alert(err.message || t('admin.quotes.convertFailed'));
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink-primary tracking-tight">
            {t('admin.quotes.title')}
          </h1>
          <p className="text-xs text-ink-secondary mt-1">
            {t('admin.quotes.subtitle')}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-surface-card rounded-2xl p-4 border border-surface-muted shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className={`w-4 h-4 text-ink-muted absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('admin.quotes.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/40"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-ink-muted" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none font-semibold text-ink-primary"
          >
            <option value="all">{t('admin.quotes.statusAll')}</option>
            <option value="new">{t('admin.quotes.statusNew')}</option>
            <option value="contacted">{t('admin.quotes.statusContacted')}</option>
            <option value="converted">{t('admin.quotes.statusConverted')}</option>
            <option value="archived">{t('admin.quotes.statusArchived')}</option>
          </select>
        </div>
      </div>

      {/* Quotes Table */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-ink-muted">{t('admin.quotes.loading')}</p>
        </div>
      ) : quotes.length === 0 ? (
        <div className="text-center py-16 bg-surface-card rounded-3xl border border-surface-muted">
          <p className="text-xs text-ink-muted">{t('admin.quotes.empty')}</p>
        </div>
      ) : (
        <div className="bg-surface-card rounded-3xl border border-surface-muted shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-surface-elevated text-ink-muted border-b border-surface-muted font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 text-start">{t('admin.quotes.project')}</th>
                  <th className="py-3.5 px-4 text-start">{t('admin.quotes.clientContact')}</th>
                  <th className="py-3.5 px-4 text-start">{t('admin.quotes.budgetTimeline')}</th>
                  <th className="py-3.5 px-4 text-start">{t('admin.quotes.statusLabel')}</th>
                  <th className="py-3.5 px-4 text-end">{t('admin.quotes.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-muted/60">
                {quotes.map((q) => (
                  <tr
                    key={q.id}
                    className={`hover:bg-surface-elevated/50 transition-colors ${
                      !q.is_read ? 'bg-brand-subtle/20 font-semibold' : ''
                    }`}
                  >
                     <td className="py-4 px-4">
                       <div className="flex items-center gap-2">
                         {!q.is_read && (
                           <span className="w-2 h-2 rounded-full bg-brand-primary shrink-0" title={t('admin.quotes.badgeNew')} />
                         )}
                         <div>
                           <p className="font-bold text-ink-primary">{q.project_name}</p>
                           <span className="text-[11px] text-ink-muted">{q.client_name || q.email.split('@')[0]}</span>
                         </div>
                       </div>
                     </td>

                    <td className="py-4 px-4">
                      <p className="text-ink-primary font-medium">{q.email}</p>
                      {q.phone && <p className="text-[11px] text-ink-muted">{q.phone}</p>}
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-mono font-bold text-brand-dark">{q.budget}</p>
                      <p className="text-[11px] text-ink-muted">{q.timeline || t('admin.common.flexible')}</p>
                    </td>

                    <td className="py-4 px-4">
                      <select
                        value={q.status}
                        onChange={(e) => handleStatusChange(q.id, e.target.value)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                          q.status === 'new'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : q.status === 'converted'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : q.status === 'contacted'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-surface-muted text-ink-secondary border-surface-muted'
                        }`}
                      >
                        <option value="new">{t('admin.quotes.statusNew')}</option>
                        <option value="contacted">{t('admin.quotes.statusContacted')}</option>
                        <option value="converted">{t('admin.quotes.statusConverted')}</option>
                        <option value="archived">{t('admin.quotes.statusArchived')}</option>
                      </select>
                    </td>

                    <td className="py-4 px-4 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(q)}
                          className="p-1.5 rounded-lg text-ink-secondary hover:text-brand-dark hover:bg-surface-elevated transition-colors"
                          title={t('admin.quotes.viewDetails')}
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenConvert(q)}
                          className="p-1.5 rounded-lg text-brand-primary hover:text-brand-dark hover:bg-brand-subtle transition-colors"
                          title={t('admin.quotes.convertToProject')}
                        >
                          <FolderPlus className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(q.id)}
                          className="p-1.5 rounded-lg text-ink-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                          title={t('admin.common.delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`${t('admin.quotes.request')} #${selectedQuote.id}: ${selectedQuote.project_name}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5 text-xs">
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-surface-elevated">
              <div>
                <span className="text-ink-muted block text-[10px]">{t('admin.quotes.clientName')}</span>
                <span className="font-bold text-ink-primary">{selectedQuote.client_name || selectedQuote.email.split('@')[0]}</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[10px]">{t('admin.quotes.serviceType')}</span>
                <span className="font-bold text-brand-dark">{selectedQuote.service_type}</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[10px]">{t('admin.quotes.suggestedBudget')}</span>
                <span className="font-mono font-bold text-ink-primary">{selectedQuote.budget}</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[10px]">{t('admin.quotes.clientEmail')}</span>
                <span className="font-bold text-ink-primary">{selectedQuote.email}</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[10px]">{t('admin.quotes.clientPhone')}</span>
                <span className="font-bold text-ink-primary">{selectedQuote.phone || t('admin.common.na')}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-ink-primary uppercase tracking-wider text-[10px]">
                {t('admin.quotes.scopeTitle')}
              </label>
              <div className="p-4 rounded-2xl bg-surface-elevated border border-surface-muted leading-relaxed text-ink-secondary whitespace-pre-wrap">
                {selectedQuote.description}
              </div>
            </div>

            {/* Direct contact buttons */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-surface-muted/60">
              {selectedQuote.phone && (
                <a
                  href={`https://wa.me/${selectedQuote.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{t('admin.quotes.chatWhatsapp')}</span>
                </a>
              )}

              <a
                href={`mailto:${selectedQuote.email}?subject=Regarding your Digitway project quote: ${selectedQuote.project_name}`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-white bg-brand-dark hover:bg-brand-primary transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{t('admin.quotes.emailClient')}</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setIsDetailOpen(false);
                  handleOpenConvert(selectedQuote);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-brand-dark bg-brand-subtle hover:bg-brand-primary hover:text-white transition-colors ltr:ml-auto rtl:mr-auto"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>{t('admin.quotes.convertToProject')}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Convert to Project Modal */}
      {selectedQuote && (
        <Modal
          isOpen={isConvertOpen}
          onClose={() => setIsConvertOpen(false)}
          title={t('admin.quotes.convertTitle')}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleConvertSubmit} className="space-y-4 text-xs">
            <p className="text-ink-muted">
              {t('admin.quotes.convertDesc')} <strong>{selectedQuote.project_name}</strong> {t('admin.quotes.convertDescEnd')}
            </p>

            <div className="space-y-1">
              <label className="block font-bold text-ink-primary">{t('admin.quotes.clientName')} *</label>
              <input
                type="text"
                required
                value={convertData.client_name}
                onChange={(e) => setConvertData({ ...convertData, client_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-ink-primary">{t('admin.projects.deliveryTarget')}</label>
              <input
                type="date"
                value={convertData.target_delivery}
                onChange={(e) => setConvertData({ ...convertData, target_delivery: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-ink-primary">{t('admin.projects.confidentialNotes')}</label>
              <textarea
                rows={4}
                value={convertData.notes}
                onChange={(e) => setConvertData({ ...convertData, notes: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-muted bg-surface-elevated focus:bg-white focus:outline-none leading-relaxed"
              />
            </div>

            <div className="pt-2 border-t border-surface-muted/60 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsConvertOpen(false)}
                className="px-4 py-2 rounded-xl font-semibold text-ink-secondary hover:bg-surface-elevated"
              >
                {t('admin.common.cancel')}
              </button>
              <button
                type="submit"
                disabled={converting}
                className="px-6 py-2 rounded-xl font-bold text-white bg-brand-dark hover:bg-brand-primary transition-colors disabled:opacity-50"
              >
                {converting ? t('admin.quotes.converting') : t('admin.quotes.confirmConvert')}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
