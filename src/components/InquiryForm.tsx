'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function InquiryForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    intent: 'hire',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const intents = [
    { id: 'hire', label: 'Hire Me (Full-Time / Contract)' },
    { id: 'consulting', label: 'AI & Backend Consulting' },
    { id: 'research', label: 'Research Collaboration' },
    { id: 'phd', label: 'PhD / Research Assistantship' },
    { id: 'speaking', label: 'Speaking / Workshop Invite' },
    { id: 'other', label: 'Other Professional Inquiry' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        organization: '',
        intent: 'hire',
        subject: '',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please reach out via direct email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Intent Selector */}
      <div>
        <label className="block text-xs font-mono font-medium text-zinc-300 mb-2 uppercase tracking-wider">
          Primary Collaboration Intent *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {intents.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setFormData({ ...formData, intent: item.id })}
              className={`p-3 rounded-xl text-left text-xs font-medium border transition-all ${
                formData.intent === item.id
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-semibold shadow-sm shadow-emerald-500/10'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Your Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Prof. John Doe / Jane Smith"
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
        </div>

        {/* Professional Email */}
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john.doe@university.edu"
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Organization / Lab */}
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Company / University / Lab (Optional)
          </label>
          <input
            type="text"
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            placeholder="e.g. Stanford AI Lab / Acme Tech Corp"
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Subject *
          </label>
          <input
            type="text"
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="e.g. AI Engineering Opportunity / Research Collaboration"
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-medium text-zinc-300 mb-1.5">
          Detailed Message *
        </label>
        <textarea
          rows={5}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Please describe project scope, research topic, timeline, or position details..."
          className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none"
        ></textarea>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Thank you! Your message has been securely delivered to Sumaiya Akter. You will receive a response within 24 hours.</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-zinc-950 font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending Secure Transmission...</span>
          </>
        ) : (
          <>
            <span>Submit Collaboration Inquiry</span>
            <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
