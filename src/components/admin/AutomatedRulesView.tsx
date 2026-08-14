import React, { useState } from 'react';
import { Zap, Bell, Gift, Sparkles, Plus, CheckCircle2, Flame, ShieldAlert, ToggleLeft, ToggleRight, ArrowRight } from 'lucide-react';
import { AutomatedRule } from '../../types';
import { storageService } from '../../services/storageService';

interface AutomatedRulesViewProps {
  rules: AutomatedRule[];
}

export const AutomatedRulesView: React.FC<AutomatedRulesViewProps> = ({ rules }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [triggerType, setTriggerType] = useState<AutomatedRule['triggerType']>('inactive_days');
  const [conditionValue, setConditionValue] = useState(5);
  const [actionType, setActionType] = useState<AutomatedRule['actionType']>('issue_incentive_voucher');
  const [incentiveTitle, setIncentiveTitle] = useState('Free Protein Shake Pass + 100 Bonus XP');
  const [messageTemplate, setMessageTemplate] = useState('Hey {{firstName}}! We miss your energy at FitPulse. Enjoy a free shake on us this week!');

  const handleToggle = (ruleId: string) => {
    storageService.toggleAutomatedRule(ruleId);
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let condDesc = `${conditionValue} days inactive`;
    if (triggerType === 'missed_visits') condDesc = `${conditionValue} missed scheduled workouts`;
    if (triggerType === 'streak_broken') condDesc = `Active streak broken`;

    storageService.addAutomatedRule({
      title: newTitle.trim(),
      triggerType,
      conditionValue,
      conditionDescription: condDesc,
      actionType,
      actionPayload: {
        incentiveTitle: incentiveTitle.trim(),
        messageTemplate: messageTemplate.trim(),
        channel: 'Push',
        xpBonus: 150
      },
      isActive: true
    });

    setShowCreateModal(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5">
            <span>Automated Retention Rules</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
              {rules.filter((r) => r.isActive).length} Active Triggers
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Self-driving engagement workflows that automatically intervene before members cancel
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create Retention Rule</span>
        </button>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`p-6 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between ${
              rule.isActive
                ? 'bg-[#0F172A] border-slate-700/80 shadow-xl'
                : 'bg-slate-950/40 border-slate-800/60 opacity-60'
            }`}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{rule.title}</h3>
                    <span className="text-xs text-slate-400">Trigger: {rule.conditionDescription}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(rule.id)}
                  className="cursor-pointer text-slate-400 hover:text-emerald-400 transition-colors"
                  title={rule.isActive ? 'Deactivate rule' : 'Activate rule'}
                >
                  {rule.isActive ? (
                    <ToggleRight className="w-8 h-8 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-600" />
                  )}
                </button>
              </div>

              {/* Action details */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Automated Action</span>
                  <span className="text-emerald-400 font-semibold">{rule.actionPayload.channel || 'Push'} Notification</span>
                </div>
                <p className="text-xs text-slate-300 italic">
                  "{rule.actionPayload.messageTemplate}"
                </p>
                {rule.actionPayload.incentiveTitle && (
                  <div className="text-[11px] text-amber-300/90 flex items-center gap-1.5 pt-1 border-t border-slate-800/80">
                    <Gift className="w-3.5 h-3.5 text-amber-400" />
                    <span>Incentive: {rule.actionPayload.incentiveTitle}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="text-slate-400">
                Fired <strong className="text-white font-mono">{rule.timesTriggered}</strong> times
              </div>
              <div className="flex items-center gap-1 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{rule.successRate}% Return Rate</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Rule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0F172A] border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create Automated Retention Rule</h3>
                  <p className="text-xs text-slate-400">Trigger automatic outreach when behavior patterns shift</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-800"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 5 Days Inactive → Free Protein Shake"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Trigger Condition</label>
                  <select
                    value={triggerType}
                    onChange={(e) => setTriggerType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 outline-none focus:border-emerald-500"
                  >
                    <option value="inactive_days">Days Inactive</option>
                    <option value="missed_visits">Missed Expected Visits</option>
                    <option value="streak_broken">Streak Broken Shock</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Threshold Value</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={conditionValue}
                    onChange={(e) => setConditionValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1">Incentive Voucher (Optional)</label>
                <input
                  type="text"
                  value={incentiveTitle}
                  onChange={(e) => setIncentiveTitle(e.target.value)}
                  placeholder="e.g. Free Guest Pass / Shake"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1">Message Template</label>
                <textarea
                  rows={3}
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all"
              >
                Save & Activate Rule
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
