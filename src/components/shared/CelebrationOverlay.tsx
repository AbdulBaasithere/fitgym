import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Trophy, Award, Zap, Sparkles, X, ArrowRight } from 'lucide-react';
import { storageService } from '../../services/storageService';

interface CelebrationProps {
  modal: {
    isOpen: boolean;
    title: string;
    subtitle: string;
    type: 'streak' | 'level_up' | 'badge' | 'challenge' | 'checkin';
    rewardXp?: number;
    badgeName?: string;
    streakCount?: number;
  } | null;
}

export const CelebrationOverlay: React.FC<CelebrationProps> = ({ modal }) => {
  if (!modal || !modal.isOpen) return null;

  const handleDismiss = () => {
    storageService.dismissCelebration();
  };

  const getIcon = () => {
    switch (modal.type) {
      case 'streak':
        return <Flame className="w-12 h-12 text-amber-400 animate-bounce" />;
      case 'level_up':
        return <Zap className="w-12 h-12 text-emerald-400 animate-pulse" />;
      case 'badge':
        return <Award className="w-12 h-12 text-purple-400 animate-spin" />;
      case 'challenge':
        return <Trophy className="w-12 h-12 text-yellow-400 animate-bounce" />;
      default:
        return <Sparkles className="w-12 h-12 text-cyan-400 animate-pulse" />;
    }
  };

  const getBgGradient = () => {
    switch (modal.type) {
      case 'streak':
        return 'from-amber-500/20 via-orange-500/10 to-transparent border-amber-500/40 glow-amber';
      case 'level_up':
        return 'from-emerald-500/20 via-teal-500/10 to-transparent border-emerald-500/40 glow-emerald';
      case 'badge':
        return 'from-purple-500/20 via-indigo-500/10 to-transparent border-purple-500/40 glow-purple';
      case 'challenge':
        return 'from-yellow-500/20 via-amber-500/10 to-transparent border-yellow-500/40 glow-amber';
      default:
        return 'from-cyan-500/20 via-blue-500/10 to-transparent border-cyan-500/40 glow-cyan';
    }
  };

  return (
    <AnimatePresence>
      <div id="celebration-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className={`relative w-full max-w-md p-8 rounded-3xl bg-[#0F172A] border ${getBgGradient()} text-center shadow-2xl overflow-hidden`}
        >
          {/* Background particle glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            id="btn-close-celebration"
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon badge */}
          <div className="mx-auto mb-6 w-24 h-24 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 flex items-center justify-center shadow-inner">
            {getIcon()}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 text-xs font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              FitPulse Milestone
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2 font-display">
              {modal.title}
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {modal.subtitle}
            </p>

            {modal.rewardXp && (
              <div className="mb-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-around">
                <div className="text-center">
                  <div className="text-xs text-slate-400 font-medium">XP Reward</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">+{modal.rewardXp} XP</div>
                </div>
                {modal.streakCount && (
                  <div className="text-center border-l border-slate-800 pl-6">
                    <div className="text-xs text-slate-400 font-medium">Streak Status</div>
                    <div className="text-2xl font-black text-amber-400 flex items-center justify-center gap-1">
                      <Flame className="w-5 h-5 fill-amber-400" />
                      {modal.streakCount} Days
                    </div>
                  </div>
                )}
                {modal.badgeName && (
                  <div className="text-center border-l border-slate-800 pl-6">
                    <div className="text-xs text-slate-400 font-medium">New Badge</div>
                    <div className="text-sm font-bold text-purple-300">{modal.badgeName}</div>
                  </div>
                )}
              </div>
            )}

            <button
              id="btn-confirm-celebration"
              onClick={handleDismiss}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Continue Crushing Goals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
