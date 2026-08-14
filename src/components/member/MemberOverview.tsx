import React from 'react';
import { Flame, Trophy, Award, Zap, QrCode, Dumbbell, ChevronRight, Target, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { Member, Challenge } from '../../types';
import { getLevelDetails, getStreakMultiplier } from '../../services/gamificationEngine';
import { storageService } from '../../services/storageService';

interface MemberOverviewProps {
  member: Member;
  challenges: Challenge[];
  onOpenCheckIn: () => void;
  onOpenLogWorkout: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const MemberOverview: React.FC<MemberOverviewProps> = ({
  member,
  challenges,
  onOpenCheckIn,
  onOpenLogWorkout,
  onNavigateToTab
}) => {
  const levelInfo = getLevelDetails(member.xp);
  const streakMultiplier = getStreakMultiplier(member.currentStreak);
  const activeChallenges = challenges.filter((c) => member.activeChallengeIds.includes(c.id));

  // Compute daily goal status
  const checkedInToday = member.todayCheckedIn || member.daysSinceLastVisit === 0;

  const handleClaimReward = (challengeId: string) => {
    storageService.completeChallenge(challengeId, member.id);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Member Welcome & Hero Metrics */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#162039] to-[#0F172A] border border-slate-700/80 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar & Title */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover border-2 border-emerald-500/50 shadow-xl"
              />
              <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-black text-emerald-400 font-mono">
                LVL {member.level}
              </div>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
                <Sparkles className="w-3 h-3" />
                <span>{member.tier} Member</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
                Welcome back, {member.name.split(' ')[0]}!
              </h2>
              <p className="text-xs text-slate-300">
                You're in the <strong className="text-emerald-400">Top 5%</strong> of active FitPulse lifters this week. Keep up the high tempo!
              </p>
            </div>
          </div>

          {/* Quick Interactive Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-member-checkin-hero"
              onClick={onOpenCheckIn}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <QrCode className="w-4 h-4" />
              <span>{checkedInToday ? 'Checked In Today ✅' : 'Gym Check-In (+50 XP)'}</span>
            </button>

            <button
              id="btn-member-log-workout-hero"
              onClick={onOpenLogWorkout}
              className="px-5 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              <span>Log Workout</span>
            </button>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Level {member.level}: {member.levelTitle}</span>
              <span className="text-[11px] text-slate-400 font-mono">({member.xp.toLocaleString()} XP)</span>
            </div>
            <span className="text-emerald-400 font-mono font-bold">
              {levelInfo.xpRemaining.toLocaleString()} XP to Level {levelInfo.level + 1}
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500 shadow-sm"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Row 2: Gamification Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak 🔥 */}
        <div className="p-5 rounded-3xl bg-[#0F172A] border border-amber-500/30 glow-amber shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Attendance Streak</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-3xl font-black text-amber-400 flex items-center gap-1 font-display">
              <Flame className="w-7 h-7 fill-amber-400 animate-pulse" />
              {member.currentStreak} Days
            </div>
            <div className="text-xs text-slate-300 mt-1">
              <span className="font-bold text-amber-300">{streakMultiplier}x XP Multiplier</span> active!
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between">
            <span>Personal Best: <strong>{member.bestStreak}d</strong></span>
            <span className="text-emerald-400 font-bold">Streak Protected 🛡️</span>
          </div>
        </div>

        {/* Leaderboard Standing */}
        <div
          onClick={() => onNavigateToTab('leaderboard')}
          className="p-5 rounded-3xl bg-[#0F172A] border border-slate-800 hover:border-slate-700 shadow-xl relative overflow-hidden flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Leaderboard Rank</span>
            <div className="p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
              <Trophy className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-3xl font-black text-white font-display">
              #{member.leaderboardRank} <span className="text-xs font-bold text-emerald-400">Overall</span>
            </div>
            <div className="text-xs text-slate-300 mt-1 font-mono">
              {member.weeklyPoints} Weekly Points
            </div>
          </div>

          <div className="text-[11px] text-emerald-400 group-hover:text-emerald-300 font-bold pt-2 border-t border-slate-800 flex items-center justify-between">
            <span>View Full Podium</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Weekly Attendance Habit Ring */}
        <div className="p-5 rounded-3xl bg-[#0F172A] border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weekly Habit</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Target className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-3xl font-black text-emerald-400 font-display">
              {member.weeklyAttendanceCurrent} / {member.weeklyAttendanceGoal} <span className="text-xs font-bold text-slate-400">Days</span>
            </div>
            <div className="text-xs text-slate-300 mt-1">
              {member.weeklyAttendanceCurrent >= member.weeklyAttendanceGoal ? 'Target crushed this week! 🎉' : '1 more workout to hit weekly goal'}
            </div>
          </div>

          <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-800">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
              <span
                key={idx}
                className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center ${
                  idx < member.weeklyAttendanceCurrent
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {day}
              </span>
            ))}
          </div>
        </div>

        {/* Badges & Trophies */}
        <div
          onClick={() => onNavigateToTab('badges')}
          className="p-5 rounded-3xl bg-[#0F172A] border border-slate-800 hover:border-slate-700 shadow-xl relative overflow-hidden flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trophy Cabinet</span>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Award className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-3xl font-black text-white font-display">
              {member.badges.length} <span className="text-xs font-bold text-purple-400">Unlocked</span>
            </div>
            <div className="text-xs text-slate-300 mt-1">
              Latest: <strong className="text-purple-300">{member.badges[member.badges.length - 1]?.name || 'First Step'}</strong>
            </div>
          </div>

          <div className="text-[11px] text-purple-400 group-hover:text-purple-300 font-bold pt-2 border-t border-slate-800 flex items-center justify-between">
            <span>Explore All Trophies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Row 3: Active Challenges & Recent Workouts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Competitions & Challenges */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Active Gym Challenges</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                  {activeChallenges.length} Active
                </span>
              </h3>
              <p className="text-xs text-slate-400">Complete challenges to earn rare badges and massive XP boosts</p>
            </div>

            <button
              onClick={() => onNavigateToTab('challenges')}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {activeChallenges.map((challenge) => {
              const isCompleted = challenge.completedMembers.includes(member.id);

              return (
                <div
                  key={challenge.id}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-amber-400 shrink-0">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{challenge.title}</h4>
                        {isCompleted && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            COMPLETED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-1">{challenge.description}</p>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                        <span className="text-emerald-400 font-bold font-mono">+{challenge.rewardXp} XP</span>
                        <span>•</span>
                        <span>{challenge.participantCount} competitors</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    {isCompleted ? (
                      <span className="px-4 py-2 rounded-xl bg-slate-800 text-emerald-400 text-xs font-bold">
                        Reward Claimed ✅
                      </span>
                    ) : (
                      <button
                        onClick={() => handleClaimReward(challenge.id)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer active:scale-95"
                      >
                        Complete & Claim
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Quick Habit Insights */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Workout Consistency Score</h3>
            <p className="text-xs text-slate-400 mb-4">AI Habit analysis based on last 30 days of check-ins</p>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Consistency Index</span>
                <span className="text-base font-black text-emerald-400 font-mono">96 / 100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '96%' }} />
              </div>
              <div className="text-[11px] text-slate-300 leading-relaxed">
                "You have logged 14 workouts in the past 3 weeks with zero streak interruptions. Your habit loop is in the elite percentile."
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-tr from-amber-500/10 to-orange-500/10 border border-amber-500/20 space-y-2">
            <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>Next Streak Reward</span>
            </div>
            <div className="text-xs text-slate-300">
              Reach a <strong>30-Day Streak</strong> (9 days away) to unlock the legendary <strong>Titan of Will</strong> badge + 2.0x XP multiplier!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
