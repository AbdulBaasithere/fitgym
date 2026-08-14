import React, { useState } from 'react';
import { Search, Filter, Bot, ShieldAlert, Calendar, Flame, ArrowUpRight, Gift, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { Member, ChurnRiskLevel } from '../../types';
import { storageService } from '../../services/storageService';

interface AtRiskTableProps {
  members: Member[];
  onSelectMemberForOutreach: (member: Member) => void;
}

export const AtRiskTable: React.FC<AtRiskTableProps> = ({ members, onSelectMemberForOutreach }) => {
  const [filterTier, setFilterTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMemberDetail, setSelectedMemberDetail] = useState<Member | null>(null);

  const filteredMembers = members.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.tier.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterTier === 'all') return matchesSearch;
    return matchesSearch && m.churnRisk.level === filterTier;
  }).sort((a, b) => b.churnRisk.score - a.churnRisk.score);

  const handleActivateRecovery = (member: Member) => {
    storageService.activateRecoveryQuest(member.id);
    alert(`Phoenix Streak Recovery Quest activated for ${member.name}! +300 Comeback XP notification sent.`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5">
            <span>At-Risk Members & AI Churn Shield</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-mono font-bold">
              {filteredMembers.length} Members
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time algorithmic risk detection based on attendance velocity, streak breaks, and membership tenure
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search member name..."
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500 w-48 sm:w-60"
            />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            {(['all', 'critical', 'high', 'moderate'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setFilterTier(tier)}
                className={`px-2.5 py-1 rounded-lg font-bold uppercase text-[10px] transition-all cursor-pointer ${
                  filterTier === tier
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-3xl bg-[#0F172A] border border-slate-800 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">Member Profile</th>
                <th className="py-4 px-4">Churn Risk Score</th>
                <th className="py-4 px-4">Inactivity</th>
                <th className="py-4 px-4">Streak & Habit</th>
                <th className="py-4 px-6">AI Root Cause & Recommended Action</th>
                <th className="py-4 px-6 text-right">Intervention Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredMembers.map((member) => {
                const isCritical = member.churnRisk.level === 'critical';
                const isHigh = member.churnRisk.level === 'high';
                const isMod = member.churnRisk.level === 'moderate';

                return (
                  <tr key={member.id} className="hover:bg-slate-900/50 transition-colors">
                    {/* Member Profile */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
                        <div>
                          <div className="font-bold text-white text-sm hover:text-emerald-400 cursor-pointer" onClick={() => setSelectedMemberDetail(member)}>
                            {member.name}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                            <span className="font-medium text-slate-300">{member.tier}</span>
                            <span>•</span>
                            <span>{member.totalWorkouts} workouts</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Churn Risk Score */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`text-base font-black font-mono ${
                          isCritical ? 'text-rose-400' : isHigh ? 'text-amber-400' : isMod ? 'text-yellow-400' : 'text-emerald-400'
                        }`}>
                          {member.churnRisk.score}%
                        </div>
                        <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isCritical ? 'bg-rose-500' : isHigh ? 'bg-amber-500' : isMod ? 'bg-yellow-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${member.churnRisk.score}%` }}
                          />
                        </div>
                      </div>
                      <span className={`inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider ${
                        isCritical ? 'bg-rose-500/20 text-rose-400' : isHigh ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {member.churnRisk.level}
                      </span>
                    </td>

                    {/* Inactivity */}
                    <td className="py-4 px-4">
                      <div className={`font-bold ${member.daysSinceLastVisit > 7 ? 'text-rose-300' : 'text-slate-200'}`}>
                        {member.daysSinceLastVisit === 0 ? 'Today' : `${member.daysSinceLastVisit} days ago`}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Target: {member.weeklyAttendanceGoal} visits/wk
                      </div>
                    </td>

                    {/* Streak & Habit */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 font-bold text-white">
                        <Flame className={`w-3.5 h-3.5 ${member.currentStreak > 0 ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                        <span>{member.currentStreak} Days</span>
                      </div>
                      {member.previousStreak && member.previousStreak > 0 && member.currentStreak === 0 && (
                        <div className="text-[10px] text-rose-400">
                          Broke {member.previousStreak}d streak
                        </div>
                      )}
                    </td>

                    {/* AI Root Cause & Recommendation */}
                    <td className="py-4 px-6 max-w-xs">
                      <div className="text-slate-300 font-medium line-clamp-1 mb-0.5">
                        {member.churnRisk.rootCause}
                      </div>
                      <div className="text-[11px] text-emerald-400/90 font-semibold flex items-center gap-1 line-clamp-1">
                        <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{member.churnRisk.recommendedAction}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSelectMemberForOutreach(member)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                          title="Generate AI Outreach with Gemini"
                        >
                          <Bot className="w-3.5 h-3.5" />
                          <span>AI Outreach</span>
                        </button>

                        <button
                          onClick={() => handleActivateRecovery(member)}
                          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Assign Phoenix 3-Day Recovery Quest"
                        >
                          <Sparkles className="w-4 h-4 text-cyan-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Details Drawer */}
      {selectedMemberDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#0F172A] border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <img src={selectedMemberDetail.avatar} alt={selectedMemberDetail.name} className="w-12 h-12 rounded-2xl object-cover" />
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedMemberDetail.name}</h3>
                  <p className="text-xs text-slate-400">{selectedMemberDetail.email} • {selectedMemberDetail.tier} Tier</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMemberDetail(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400 font-bold uppercase">Days Inactive</div>
                <div className="text-xl font-bold text-rose-400">{selectedMemberDetail.daysSinceLastVisit} Days</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400 font-bold uppercase">Current / Best Streak</div>
                <div className="text-xl font-bold text-amber-400">{selectedMemberDetail.currentStreak}d / {selectedMemberDetail.bestStreak}d</div>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-400 uppercase mb-2">Churn Risk Factor Breakdown</div>
              <div className="space-y-2">
                {selectedMemberDetail.churnRisk.factors.map((f, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{f.name}</span>
                    <span className="text-xs text-slate-300">{f.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  const m = selectedMemberDetail;
                  setSelectedMemberDetail(null);
                  onSelectMemberForOutreach(m);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                <span>Launch AI Outreach</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
