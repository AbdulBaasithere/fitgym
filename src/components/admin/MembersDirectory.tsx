import React, { useState } from 'react';
import { Search, Filter, QrCode, Bot, Flame, Calendar, Award, UserCheck, CheckCircle2, Shield } from 'lucide-react';
import { Member } from '../../types';
import { storageService } from '../../services/storageService';

interface MembersDirectoryProps {
  members: Member[];
  onSelectMemberForOutreach: (member: Member) => void;
}

export const MembersDirectory: React.FC<MembersDirectoryProps> = ({ members, onSelectMemberForOutreach }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const filtered = members.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedTier === 'All') return matchesSearch;
    return matchesSearch && m.tier === selectedTier;
  });

  const handleManualCheckIn = (memberId: string) => {
    const res = storageService.checkInMember(memberId, 'Front Desk');
    if (res.success) {
      alert(`Manual check-in recorded! +${res.xpEarned} XP awarded.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5">
            <span>Gym Member Directory</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-bold">
              {filtered.length} Members
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Complete member roster with live attendance logs, tier credentials, and habit streaks
          </p>
        </div>

        {/* Search & Tier Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search member or email..."
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500 w-48 sm:w-60"
            />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            {(['All', 'VIP Black', 'Pro', 'Basic', 'Student'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                  selectedTier === tier
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

      {/* Grid of Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((member) => (
          <div
            key={member.id}
            className="p-5 rounded-3xl bg-[#0F172A] border border-slate-800/90 hover:border-slate-700 shadow-lg space-y-4 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Member Top Info */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-700" />
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      {member.name}
                      {member.tier === 'VIP Black' && (
                        <Shield className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      )}
                    </div>
                    <div className="text-xs text-slate-400">{member.email}</div>
                    <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5">
                      Level {member.level} {member.levelTitle}
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  member.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {member.status}
                </span>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 my-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                <div>
                  <div className="text-[10px] text-slate-400">Streak</div>
                  <div className="text-xs font-black text-amber-400 flex items-center justify-center gap-0.5">
                    <Flame className="w-3 h-3 fill-amber-400" />
                    {member.currentStreak}d
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Workouts</div>
                  <div className="text-xs font-black text-white font-mono">{member.totalWorkouts}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Churn Risk</div>
                  <div className={`text-xs font-black font-mono ${
                    member.churnRisk.score > 60 ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {member.churnRisk.score}%
                  </div>
                </div>
              </div>

              {/* Last visit & tier */}
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Tier: <strong className="text-slate-200">{member.tier}</strong></span>
                <span>Last visit: <strong className="text-slate-200">{member.daysSinceLastVisit === 0 ? 'Today' : `${member.daysSinceLastVisit}d ago`}</strong></span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <button
                onClick={() => handleManualCheckIn(member.id)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="Manual Front Desk Check-in"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Check-in</span>
              </button>

              <button
                onClick={() => onSelectMemberForOutreach(member)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>AI Message</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
