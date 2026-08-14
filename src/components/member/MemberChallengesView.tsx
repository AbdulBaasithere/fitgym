import React, { useState } from 'react';
import { Trophy, Flame, Zap, Award, Target, CheckCircle2, Clock, Users, ArrowRight, Plus, Sparkles } from 'lucide-react';
import { Challenge, Member } from '../../types';
import { storageService } from '../../services/storageService';

interface MemberChallengesViewProps {
  challenges: Challenge[];
  member: Member;
}

export const MemberChallengesView: React.FC<MemberChallengesViewProps> = ({ challenges, member }) => {
  const [filter, setFilter] = useState<'all' | 'joined' | 'completed'>('all');

  const handleJoin = (challengeId: string) => {
    storageService.joinChallenge(challengeId, member.id);
  };

  const handleClaim = (challengeId: string) => {
    storageService.completeChallenge(challengeId, member.id);
  };

  const filtered = challenges.filter((c) => {
    const isJoined = member.activeChallengeIds.includes(c.id);
    const isCompleted = c.completedMembers.includes(member.id);

    if (filter === 'joined') return isJoined && !isCompleted;
    if (filter === 'completed') return isCompleted;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span>Gym Competitions & Challenges</span>
          </h2>
          <p className="text-xs text-slate-400">
            Push your boundaries with attendance blitzes, calorie burners, and streak infernos
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          {[
            { id: 'all', label: 'All Challenges' },
            { id: 'joined', label: 'My Active' },
            { id: 'completed', label: 'Conquered 🏆' },
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

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((challenge) => {
          const isJoined = member.activeChallengeIds.includes(challenge.id);
          const isCompleted = challenge.completedMembers.includes(member.id);

          return (
            <div
              key={challenge.id}
              className={`p-6 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isCompleted
                  ? 'bg-slate-950/60 border-emerald-500/30'
                  : challenge.isFeatured
                  ? 'bg-[#0F172A] border-amber-500/30 shadow-xl glow-amber'
                  : 'bg-[#0F172A] border-slate-800 shadow-xl'
              }`}
            >
              <div>
                {/* Badge top indicator */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-700 text-amber-400 shadow-inner">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{challenge.title}</h3>
                        {challenge.isFeatured && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="capitalize">{challenge.category} Quest</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-500" />
                          {challenge.participantCount} competitors
                        </span>
                      </div>
                    </div>
                  </div>

                  {isCompleted && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Claimed
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">{challenge.description}</p>

                {/* Rewards Bar */}
                <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs mb-4">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono">
                    <Zap className="w-4 h-4" />
                    <span>+{challenge.rewardXp} XP Reward</span>
                  </div>
                  {challenge.badgeName && (
                    <div className="flex items-center gap-1.5 text-purple-300 font-bold">
                      <Award className="w-4 h-4" />
                      <span>{challenge.badgeName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Ends {new Date(challenge.endDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                </div>

                {isCompleted ? (
                  <span className="text-xs font-bold text-emerald-400">Completed ✅</span>
                ) : isJoined ? (
                  <button
                    onClick={() => handleClaim(challenge.id)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 cursor-pointer active:scale-95 transition-all"
                  >
                    Mark Complete & Claim XP
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoin(challenge.id)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer active:scale-95"
                  >
                    Join Challenge
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
