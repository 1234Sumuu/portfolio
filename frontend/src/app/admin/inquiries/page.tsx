'use client';

import { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle2, Clock, Eye, X, MessageSquare } from 'lucide-react';
import { Inquiry } from '@/lib/types';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeInquiry, setActiveInquiry] = useState<Inquiry | null>(null);

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      if (data.inquiries) setInquiries(data.inquiries);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setInquiries(
        inquiries.map((inq) => (inq.id === id ? { ...inq, status: status as any } : inq))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteInquiry = async (id: number) => {
    if (!confirm('Delete this inquiry?')) return;
    try {
      await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      setInquiries(inquiries.filter((inq) => inq.id !== id));
      if (activeInquiry?.id === id) setActiveInquiry(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="border-b border-zinc-800 pb-6">
        <h1 className="text-2xl font-bold text-white">Contact & Collaboration Inquiries</h1>
        <p className="text-xs text-zinc-400">
          Messages received from companies, academic professors, recruiters, and collaborators.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
        {inquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 bg-zinc-950 border-b border-zinc-800">
                <tr>
                  <th className="p-4">Sender</th>
                  <th className="p-4">Intent</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-white">{inq.name}</div>
                      <div className="text-[11px] font-mono text-zinc-400">{inq.email}</div>
                      {inq.organization && (
                        <div className="text-[10px] text-zinc-500">{inq.organization}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-950 border border-zinc-800 text-emerald-400">
                        {inq.intent}
                      </span>
                    </td>
                    <td className="p-4 max-w-xs truncate text-zinc-300">
                      {inq.subject}
                    </td>
                    <td className="p-4 font-mono text-zinc-500 text-[11px]">
                      {inq.created_at?.slice(0, 16)}
                    </td>
                    <td className="p-4">
                      <select
                        value={inq.status}
                        onChange={(e) => updateStatus(inq.id, e.target.value)}
                        className="px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-200"
                      >
                        <option value="new">New</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setActiveInquiry(inq)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                          title="Read Message"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteInquiry(inq.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-zinc-500">
            No inquiries logged yet.
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {activeInquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-xl p-6 sm:p-8 space-y-6 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                  Inquiry Details
                </span>
                <h3 className="text-base font-bold text-white">{activeInquiry.subject}</h3>
              </div>
              <button onClick={() => setActiveInquiry(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 font-mono text-[11px]">
              <div>
                <span className="text-zinc-500 block">From:</span>
                <span className="text-white font-semibold">{activeInquiry.name}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Email:</span>
                <a href={`mailto:${activeInquiry.email}`} className="text-emerald-400 underline">
                  {activeInquiry.email}
                </a>
              </div>
              <div>
                <span className="text-zinc-500 block">Organization:</span>
                <span className="text-zinc-300">{activeInquiry.organization || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Intent:</span>
                <span className="text-zinc-300 capitalize">{activeInquiry.intent}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-zinc-400 font-mono uppercase text-[11px] block">Transmission Message:</span>
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 leading-relaxed whitespace-pre-wrap text-xs">
                {activeInquiry.message}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
              <a
                href={`mailto:${activeInquiry.email}?subject=Re: ${encodeURIComponent(activeInquiry.subject)}`}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs"
              >
                Reply via Email
              </a>
              <button
                onClick={() => setActiveInquiry(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
