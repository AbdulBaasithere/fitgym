import React, { useState } from 'react';
import { Trophy, Flame, Award, Heart, Sparkles, TrendingUp, Shield, ArrowUp, ArrowDown, User, Star } from 'lucide-react';
import { Member } from '../../types';
import { storageService } from '../../services/storageService';

interface LeaderboardViewProps {
  members: Member[];
  currentUserId: string;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ members, currentUserId }) => {
  const [filter, setFilter] = useState<'weekly' | 'monthly' | 'streak' | 'workouts'>('weekly');
  const [cheeredMemberIds, setCheeredMemberIds] = useState<Set<string>>(new Set());

  // Sort members according to filter
  const sortedMembers = [...members].sort((a, b) => {
    if (filter === 'weekly') return b.weeklyPoints - a.weeklyPoints;
    if (filter === 'monthly') return b.monthlyPoints - a.monthlyPoints;
    if (filter === 'streak') return b.currentStreak - a.currentStreak;
    return b.totalWorkouts - a.totalWorkouts;
  });

  const top1 = sortedMembers[0];
  const top2 = sortedMembers[1];
  const top3 = sortedMembers[2];

  const handleCheer = (memberId: string) => {
    if (cheeredMemberIds.has(memberId)) return;
    setCheeredMemberIds(new Set([...cheeredMemberIds, memberId]));

    // Add celebration toast and award +10 social XP to current user
    const currentMember = storageService.getCurrentMember();
    currentMember.xp += 10;
    alert(`🙌 Fist bump sent! You earned +10 Social Engagement XP.`);
  };

  const currentUserIndex = sortedMembers.findIndex((m) => m.id === currentUserId);
  const currentUserRank = currentUserIndex !== -1 ? currentUserIndex + 1 : 1;
  const higherMember = currentUserIndex > 0 ? sortedMembers[currentUserIndex - 1] : null;

  return (
    <div className="space-y-8">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <span>FitPulse Live Leaderboard</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time rankings based on weekly points, attendance consistency, and streak dedication
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          {[
            { id: 'weekly', label: 'Weekly Points' },
            { id: 'monthly', label: 'Monthly' },
            { id: 'streak', label: 'Streaks 🔥' },
            { id: 'workouts', label: 'Total Workouts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Proximity Callout for Current User */}
      {higherMember && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-xs text-slate-200">
              You are currently ranked <strong className="text-white">#{currentUserRank}</strong>! Only{' '}
              <strong className="text-emerald-400 font-mono">
                {higherMember.weeklyPoints - sortedMembers[currentUserIndex].weeklyPoints + 10} pts
              </strong>{' '}
              away from overtaking <strong className="text-white">{higherMember.name} (#{currentUserRank - 1})</strong>!
            </div>
          </div>
          <span className="text-xs text-emerald-400 font-bold hidden sm:inline">Check in to leapfrog! 🚀</span>
        </div>
      )}

      {/* 3D Glowing Podium for Top 3 */}
      {top1 && top2 && top3 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end pt-8 pb-4 max-w-2xl mx-auto text-center">
          {/* Rank 2 (Silver) */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <img
                src={top2.avatar}
                alt={top2.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-300 shadow-xl"
              />
              <div className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-slate-300 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg">
                2
              </div>
            </div>
            <div className="text-xs sm:text-sm font-bold text-white truncate max-w-[100px]">{top2.name}</div>
            <div className="text-[11px] text-amber-400 font-mono font-bold">
              {filter === 'weekly' ? `${top2.weeklyPoints} pts` : filter === 'streak' ? `${top2.currentStreak}d` : `${top2.totalWorkouts} wkt`}
            </div>
            <div className="w-full h-24 sm:h-28 rounded-t-2xl bg-gradient-to-b from-slate-700 to-slate-800 border-t-2 border-slate-300 flex items-center justify-center shadow-lg">
              <span className="text-2xl font-black text-slate-300">🥈</span>
            </div>
          </div>

          {/* Rank 1 (Gold) */}
          <div className="flex flex-col items-center space-y-2 -mt-6">
            <div className="relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-400 animate-bounce">
                <Trophy className="w-6 h-6 fill-yellow-400" />
              </div>
              <img
                src={top1.avatar}
                alt={top1.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-yellow-400 shadow-2xl glow-amber"
              />
              <div className="absolute -top-2.5 -right-2.5 w-8 h-8 rounded-full bg-yellow-400 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg">
                1
              </div>
            </div>
            <div className="text-xs sm:text-base font-extrabold text-white truncate max-w-[120px]">{top1.name}</div>
            <div className="text-xs text-yellow-400 font-mono font-black">
              {filter === 'weekly' ? `${top1.weeklyPoints} pts` : filter === 'streak' ? `${top1.currentStreak}d` : `${top1.totalWorkouts} wkt`}
            </div>
            <div className="w-full h-32 sm:h-36 rounded-t-2xl bg-gradient-to-b from-yellow-500/30 to-amber-600/20 border-t-2 border-yellow-400 flex items-center justify-center shadow-xl">
              <span className="text-3xl font-black text-yellow-400">🥇</span>
            </div>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <img
                src={top3.avatar}
                alt={top3.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-600 shadow-xl"
              />
              <div className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center shadow-lg">
                3
              </div>
            </div>
            <div className="text-xs sm:text-sm font-bold text-white truncate max-w-[100px]">{top3.name}</div>
            <div className="text-[11px] text-amber-400 font-mono font-bold">
              {filter === 'weekly' ? `${top3.weeklyPoints} pts` : filter === 'streak' ? `${top3.currentStreak}d` : `${top3.totalWorkouts} wkt`}
            </div>
            <div className="w-full h-20 sm:h-24 rounded-t-2xl bg-gradient-to-b from-amber-700/40 to-amber-900/30 border-t-2 border-amber-600 flex items-center justify-center shadow-lg">
              <span className="text-2xl font-black text-amber-500">🥉</span>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="rounded-3xl bg-[#0F172A] border border-slate-800 shadow-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
            <tr>
              <th className="py-4 px-6">Rank</th>
              <th className="py-4 px-4">Member</th>
              <th className="py-4 px-4">Level</th>
              <th className="py-4 px-4">Active Streak</th>
              <th className="py-4 px-4 text-right">Points</th>
              <th className="py-4 px-6 text-right">Cheer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {sortedMembers.map((member, idx) => {
              const rank = idx + 1;
              const isCurrentUser = member.id === currentUserId;
              const hasCheered = cheeredMemberIds.has(member.id);

              return (
                <tr
                  key={member.id}
                  className={`transition-colors ${
                    isCurrentUser ? 'bg-emerald-500/10 border-l-4 border-emerald-500' : 'hover:bg-slate-900/50'
                  }`}
                >
                  {/* Rank */}
                  <td className="py-4 px-6">
                    <span className={`font-mono font-black text-sm ${
                      rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-slate-300' : rank === 3 ? 'text-amber-500' : 'text-slate-400'
                    }`}>
                      #{rank}
                    </span>
                  </td>

                  {/* Member */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {member.name}
                          {isCurrentUser && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">{member.tier} Member</div>
                      </div>
                    </div>
                  </td>

                  {/* Level */}
                  <td className="py-4 px-4">
                    <span className="font-bold text-emerald-400">Lvl {member.level}</span>
                    <div className="text-[10px] text-slate-400">{member.levelTitle}</div>
                  </td>

                  {/* Streak */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 font-bold text-white">
                      <Flame className={`w-3.5 h-3.5 ${member.currentStreak > 0 ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                      <span>{member.currentStreak} Days</span>
                    </div>
                  </td>

                  {/* Score */}
                  <td className="py-4 px-4 text-right">
                    <div className="text-sm font-black text-white font-mono">
                      {filter === 'weekly'
                        ? `${member.weeklyPoints} pts`
                        : filter === 'monthly'
                        ? `${member.monthlyPoints} pts`
                        : filter === 'streak'
                        ? `${member.currentStreak} days`
                        : `${member.totalWorkouts} wkts`}
                    </div>
                  </td>

                  {/* Cheer button */}
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleCheer(member.id)}
                      disabled={isCurrentUser || hasCheered}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        hasCheered
                          ? 'bg-slate-800 text-emerald-400'
                          : isCurrentUser
                          ? 'opacity-20 cursor-not-allowed'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
                      }`}
                    >
                      {hasCheered ? '🙌 Cheered!' : '🙌 Fist Bump'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
