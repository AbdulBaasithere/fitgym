import React, { useState } from 'react';
import { Award, Flame, Dumbbell, Trophy, Sparkles, CheckCircle2, Lock, ShieldCheck, Zap, Footprints, Sunrise, Medal, HeartHandshake } from 'lucide-react';
import { Member, Badge } from '../../types';
import { ALL_BADGES } from '../../services/gamificationEngine';

interface BadgesCabinetViewProps {
  member: Member;
}

export const BadgesCabinetView: React.FC<BadgesCabinetViewProps> = ({ member }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints':
        return <Footprints className="w-7 h-7 text-emerald-400" />;
      case 'Zap':
        return <Zap className="w-7 h-7 text-amber-400" />;
      case 'Flame':
        return <Flame className="w-7 h-7 text-orange-400 fill-orange-400" />;
      case 'ShieldAlert':
        return <ShieldCheck className="w-7 h-7 text-teal-400" />;
      case 'Crown':
        return <Trophy className="w-7 h-7 text-yellow-400 fill-yellow-400" />;
      case 'Dumbbell':
        return <Dumbbell className="w-7 h-7 text-blue-400" />;
      case 'Sunrise':
        return <Sunrise className="w-7 h-7 text-amber-300" />;
      case 'Medal':
        return <Medal className="w-7 h-7 text-purple-400" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-7 h-7 text-pink-400" />;
      case 'Sparkles':
        return <Sparkles className="w-7 h-7 text-cyan-400" />;
      default:
        return <Award className="w-7 h-7 text-purple-400" />;
    }
  };

  const unlockedBadgeMap = new Map(member.badges.map((b) => [b.id, b]));

  const filteredBadges = ALL_BADGES.filter((b) => {
    if (filterCategory === 'all') return true;
    return b.category === filterCategory;
  });

  const totalUnlocked = ALL_BADGES.filter((b) => unlockedBadgeMap.has(b.id)).length;
  const totalXpFromBadges = ALL_BADGES.filter((b) => unlockedBadgeMap.has(b.id)).reduce((acc, b) => acc + b.xpBonus, 0);

  return (
    <div className="space-y-6">
      {/* Header & Stats banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1A1838] to-[#0F172A] border border-purple-500/30 shadow-2xl overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            Trophy Showcase
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
            Badges & Achievements Cabinet
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Celebrate your fitness milestones, attendance streaks, and gym loyalty. Each trophy permanently boosts your leaderboard XP.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shrink-0">
          <div className="text-center pr-4 border-r border-slate-800">
            <div className="text-xs text-slate-400 font-bold">Unlocked</div>
            <div className="text-2xl font-black text-purple-400 font-mono">
              {totalUnlocked} / {ALL_BADGES.length}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-400 font-bold">XP Bonus Earned</div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              +{totalXpFromBadges.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {[
          { id: 'all', label: 'All Trophies' },
          { id: 'streak', label: 'Streak Flames 🔥' },
          { id: 'workouts', label: 'Workout Milestones' },
          { id: 'challenges', label: 'Competitions' },
          { id: 'retention', label: 'Loyalty & Habits' },
          { id: 'community', label: 'Social & Hype' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id)}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              filterCategory === tab.id
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBadges.map((badge) => {
          const unlocked = unlockedBadgeMap.get(badge.id);

          return (
            <div
              key={badge.id}
              className={`p-6 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                unlocked
                  ? 'bg-[#0F172A] border-purple-500/40 glow-purple shadow-xl'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-60'
              }`}
            >
              <div>
                {/* Top Badge Icon & Rarity */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className={`p-4 rounded-2xl border shadow-inner ${
                    unlocked
                      ? 'bg-gradient-to-tr from-slate-800 to-slate-900 border-purple-500/30 text-purple-400'
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                  }`}>
                    {unlocked ? getBadgeIcon(badge.icon) : <Lock className="w-7 h-7 text-slate-600" />}
                  </div>

                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider ${
                    badge.rarity === 'Legendary'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : badge.rarity === 'Epic'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : badge.rarity === 'Rare'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {badge.rarity}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1">{badge.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{badge.description}</p>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 font-mono">+{badge.xpBonus} XP</span>
                {unlocked ? (
                  <span className="text-purple-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Unlocked
                  </span>
                ) : (
                  <span className="text-slate-500 flex items-center gap-1 font-medium">
                    <Lock className="w-3 h-3" />
                    Locked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
