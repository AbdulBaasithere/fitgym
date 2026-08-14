import React, { useState } from 'react';
import { Users, UserCheck, UserX, AlertTriangle, TrendingUp, Calendar, Zap, Bot, ArrowRight, ShieldCheck, MessageSquare, Sparkles } from 'lucide-react';
import { Member, GymStats } from '../../types';

interface AdminOverviewProps {
  members: Member[];
  gymStats: GymStats;
  onNavigateToTab: (tab: string) => void;
  onSelectMemberForOutreach: (member: Member) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  members,
  gymStats,
  onNavigateToTab,
  onSelectMemberForOutreach
}) => {
  const [cohortStrategy, setCohortStrategy] = useState<any>(null);
  const [generatingCohort, setGeneratingCohort] = useState(false);

  const criticalMembers = members.filter((m) => m.churnRisk.level === 'critical');
  const highRiskMembers = members.filter((m) => m.churnRisk.level === 'high');
  const moderateMembers = members.filter((m) => m.churnRisk.level === 'moderate');
  const lowRiskMembers = members.filter((m) => m.churnRisk.level === 'low');

  const handleGenerateCohortStrategy = async () => {
    setGeneratingCohort(true);
    try {
      const res = await fetch('/api/gemini/cohort-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          atRiskCount: criticalMembers.length + highRiskMembers.length,
          avgInactiveDays: 9.4,
          topChurnReason: 'Streak breaks after week 2 and onboarding friction'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCohortStrategy(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingCohort(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Retention Health & AI Cohort Blitz */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#131F37] to-[#0F172A] border border-slate-700/80 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              FitPulse AI Churn Shield Active
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
              Gym Retention Health: <span className="text-emerald-400">{gymStats.retentionRatePercent}%</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Real-time member attendance tracking detected <strong className="text-rose-400">{criticalMembers.length} critical ghost members</strong> and <strong className="text-amber-400">{highRiskMembers.length} at-risk members</strong> with broken habits. Automated rules and AI interventions are ready to deploy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-run-ai-cohort-strategy"
              onClick={handleGenerateCohortStrategy}
              disabled={generatingCohort}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50"
            >
              <Bot className="w-4 h-4" />
              <span>{generatingCohort ? 'Analyzing Cohorts...' : 'Generate 7-Day AI Retention Blitz'}</span>
            </button>

            <button
              id="btn-view-at-risk-quick"
              onClick={() => onNavigateToTab('at-risk')}
              className="px-4 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>View At-Risk Queue ({criticalMembers.length + highRiskMembers.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Cohort Strategy Result Drawer */}
        {cohortStrategy && (
          <div className="mt-6 pt-6 border-t border-slate-700/60 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-3">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60 md:col-span-1">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                Campaign Strategy
              </div>
              <div className="text-sm font-bold text-white mb-2">{cohortStrategy.strategyTitle}</div>
              <p className="text-xs text-slate-300 leading-relaxed">{cohortStrategy.summary}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60 md:col-span-1">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                Recommended Actions
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {cohortStrategy.actionSteps?.map((step: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60 md:col-span-1 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                  High-Conversion Incentive
                </div>
                <p className="text-xs text-slate-200">{cohortStrategy.incentiveIdea}</p>
              </div>
              <button
                onClick={() => onNavigateToTab('rules')}
                className="mt-3 w-full py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center justify-center gap-1.5"
              >
                <span>Automate Rule with This Incentive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Members */}
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Members</span>
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-display mb-1">{gymStats.totalMembers}</div>
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400 font-bold">+12 this month</span>
            <span>• 100% synced</span>
          </div>
        </div>

        {/* Active Members */}
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Attenders</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-display mb-1">{gymStats.activeMembers}</div>
          <div className="text-xs text-slate-400">
            {Math.round((gymStats.activeMembers / gymStats.totalMembers) * 100)}% active attendance habit
          </div>
        </div>

        {/* Ghost / Inactive Members */}
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ghost Members</span>
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-display mb-1">{gymStats.inactiveGhostMembers}</div>
          <div className="text-xs text-slate-400">
            No visits in 7+ days (target for revival)
          </div>
        </div>

        {/* Churn Risk */}
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Critical At-Risk</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-display mb-1">{criticalMembers.length + highRiskMembers.length}</div>
          <div className="text-xs text-slate-400">
            High probability of cancel in 14 days
          </div>
        </div>
      </div>

      {/* Middle Grid: Churn Risk Breakdown & Top At-Risk Members */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Priority At-Risk Attention Queue */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Priority Re-Engagement Queue</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-400">
                  {criticalMembers.length} Critical
                </span>
              </h3>
              <p className="text-xs text-slate-400">Members with high likelihood of churn requiring staff outreach</p>
            </div>

            <button
              onClick={() => onNavigateToTab('at-risk')}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {[...criticalMembers, ...highRiskMembers].slice(0, 4).map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-700" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{member.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">{member.tier}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        member.churnRisk.level === 'critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {member.churnRisk.score}% RISK
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      <strong className="text-slate-300">{member.daysSinceLastVisit} days</strong> since last visit • Streak: {member.currentStreak}d (Prev: {member.previousStreak}d)
                    </div>
                    <div className="text-[11px] text-rose-300/80 mt-0.5 line-clamp-1">
                      ⚠️ {member.churnRisk.rootCause}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => onSelectMemberForOutreach(member)}
                    className="px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>AI Motivational Outreach</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Churn Risk Distribution & Quick Rules */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Risk Tier Distribution</h3>
            <p className="text-xs text-slate-400 mb-4">Algorithmic risk evaluation across member base</p>

            <div className="space-y-3">
              {/* Critical */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-rose-400">Critical (&gt;70% Score)</span>
                  <span className="text-white font-mono">{criticalMembers.length} members</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(criticalMembers.length / members.length) * 100}%` }} />
                </div>
              </div>

              {/* High */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-amber-400">High Risk (50-70%)</span>
                  <span className="text-white font-mono">{highRiskMembers.length} members</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(highRiskMembers.length / members.length) * 100}%` }} />
                </div>
              </div>

              {/* Moderate */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-yellow-400">Moderate (30-50%)</span>
                  <span className="text-white font-mono">{moderateMembers.length} members</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(moderateMembers.length / members.length) * 100}%` }} />
                </div>
              </div>

              {/* Low */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-emerald-400">Healthy / Low (&lt;30%)</span>
                  <span className="text-white font-mono">{lowRiskMembers.length} members</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(lowRiskMembers.length / members.length) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick cancellation insights */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Recent Cancellation Cause</span>
              <span className="text-[10px] text-rose-400">Last 30 Days</span>
            </div>
            <p className="text-xs text-slate-400 italic">
              "{gymStats.recentCancellations[0]?.reason}"
            </p>
            <div className="text-[10px] text-slate-500">
              Action: Automated 3-missed-visits rule reduces this dropoff mode by 64%.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
