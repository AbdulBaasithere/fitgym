import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Bot, User, CheckCircle2, RefreshCw, X, Gift, PhoneCall, Bell, ShieldAlert } from 'lucide-react';
import { Member } from '../../types';
import { storageService } from '../../services/storageService';

interface AIOutreachModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AIOutreachModal: React.FC<AIOutreachModalProps> = ({ member, isOpen, onClose }) => {
  const [tone, setTone] = useState<'empathetic' | 'coach' | 'incentive' | 'recovery'>('empathetic');
  const [channel, setChannel] = useState<'Push' | 'SMS' | 'Email'>('Push');
  const [message, setMessage] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [retentionDelta, setRetentionDelta] = useState<string>('+28%');
  const [loading, setLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [includeIncentive, setIncludeIncentive] = useState(true);
  const [incentiveTitle, setIncentiveTitle] = useState('Free Protein Shake Voucher + 150 Bonus XP');

  // Generate or regenerate AI message
  const handleGenerate = async (selectedTone = tone) => {
    if (!member) return;
    setLoading(true);
    setSentSuccess(false);

    try {
      const res = await fetch('/api/gemini/generate-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member,
          tone: selectedTone,
          gymName: 'FitPulse Club'
        }),
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      setMessage(data.message || '');
      setRecommendations(data.recommendations || []);
      if (data.retentionScoreDeltaEstimated) {
        setRetentionDelta(data.retentionScoreDeltaEstimated);
      }
    } catch (e) {
      console.error('Error generating AI outreach', e);
      // Fallback
      setMessage(`Hey ${member.name.split(' ')[0]}! We noticed life got busy and we miss your energy at FitPulse! Come by this week for a quick session + grab a complimentary protein shake at the desk.`);
      setRecommendations([
        'Schedule a low-friction 25m workout session',
        'Offer complimentary recovery smoothie',
        'Assign 3-day recovery quest'
      ]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && member) {
      setSentSuccess(false);
      handleGenerate('empathetic');
    }
  }, [isOpen, member]);

  if (!isOpen || !member) return null;

  const handleSend = () => {
    if (!message.trim()) return;
    storageService.sendOutreachMessage(
      member.id,
      message,
      channel,
      includeIncentive ? incentiveTitle : undefined
    );
    setSentSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1600);
  };

  return (
    <AnimatePresence>
      <div id="ai-outreach-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-[#0F172A] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  AI Retention Outreach <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">Gemini 2.5</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Targeted re-engagement for <strong className="text-slate-200">{member.name}</strong> ({member.tier} Member • {member.daysSinceLastVisit}d Inactive)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Churn Risk Snapshot */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
                <div>
                  <div className="text-sm font-bold text-white">{member.name}</div>
                  <div className="text-xs text-slate-400">
                    Last check-in: <span className="text-amber-400 font-medium">{member.daysSinceLastVisit} days ago</span> • Streak: {member.currentStreak}d
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Churn Risk Score</div>
                  <div className={`text-base font-black ${member.churnRisk.score > 60 ? 'text-rose-400' : 'text-amber-400'}`}>
                    {member.churnRisk.score}% ({member.churnRisk.level.toUpperCase()})
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5" />
                  Estimated Impact: {retentionDelta}
                </div>
              </div>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Choose AI Persona & Tone
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'empathetic', label: 'Empathetic Nudge', desc: 'Warm & friendly' },
                  { id: 'coach', label: 'Head Coach Alert', desc: 'High energy & focus' },
                  { id: 'incentive', label: 'VIP Reward Pass', desc: 'Free gift incentive' },
                  { id: 'recovery', label: 'Streak Quest', desc: 'Habit recovery boost' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setTone(t.id as any);
                      handleGenerate(t.id as any);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      tone === t.id
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-white shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{t.label}</div>
                    <div className="text-[10px] text-slate-400">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Generated Message Editor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Personalized Outreach Message
                </label>
                <button
                  type="button"
                  onClick={() => handleGenerate(tone)}
                  disabled={loading}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  Regenerate with Gemini
                </button>
              </div>

              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Generating personalized outreach message..."
                  className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-100 text-sm leading-relaxed resize-none outline-none"
                />
                {loading && (
                  <div className="absolute inset-0 rounded-2xl bg-slate-900/80 backdrop-blur-sm flex items-center justify-center gap-2 text-emerald-400 text-xs font-bold">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Synthesizing member context & writing message...
                  </div>
                )}
              </div>
            </div>

            {/* Incentive Attachment Toggle */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Gift className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">Attach Re-Engagement Incentive Pass</span>
                </div>
                <input
                  type="checkbox"
                  checked={includeIncentive}
                  onChange={(e) => setIncludeIncentive(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </div>
              {includeIncentive && (
                <input
                  type="text"
                  value={incentiveTitle}
                  onChange={(e) => setIncentiveTitle(e.target.value)}
                  placeholder="e.g. Free Smoothie + 150 Bonus XP"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-emerald-500"
                />
              )}
            </div>

            {/* Tactical Staff Action Items */}
            {recommendations.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                  Staff Retention Action Plan
                </div>
                <ul className="space-y-1.5">
                  {recommendations.map((rec, i) => (
                    <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Delivery Channel */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Channel:</span>
                {(['Push', 'SMS', 'Email'] as const).map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setChannel(ch)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                      channel === ch
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-500">
                Auto-logs to member profile & reduces churn risk score
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              id="btn-send-outreach"
              type="button"
              onClick={handleSend}
              disabled={loading || sentSuccess || !message.trim()}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98 transition-all"
            >
              {sentSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Outreach Dispatched!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send {channel} Outreach</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
