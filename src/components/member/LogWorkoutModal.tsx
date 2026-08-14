import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dumbbell, Flame, Timer, Sparkles, X, Plus, Trash2, Award, Zap } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { Member } from '../../types';

interface LogWorkoutModalProps {
  member: Member;
  isOpen: boolean;
  onClose: () => void;
}

export const LogWorkoutModal: React.FC<LogWorkoutModalProps> = ({ member, isOpen, onClose }) => {
  const [type, setType] = useState<'Strength' | 'Cardio' | 'HIIT' | 'CrossFit' | 'Yoga / Mobility' | 'Boxing' | 'Functional'>('Strength');
  const [title, setTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [caloriesBurned, setCaloriesBurned] = useState(380);
  const [isPersonalRecord, setIsPersonalRecord] = useState(false);
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<{ name: string; sets: number; reps: number; weightKg?: number }[]>([
    { name: 'Barbell Bench Press', sets: 4, reps: 8, weightKg: 85 }
  ]);

  if (!isOpen) return null;

  const handleAddExercise = () => {
    setExercises([...exercises, { name: 'Dumbbell Incline Press', sets: 3, reps: 10, weightKg: 28 }]);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleUpdateExercise = (index: number, field: string, val: any) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: val };
    setExercises(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const workoutTitle = title.trim() || `${type} Session`;

    storageService.logWorkout({
      memberId: member.id,
      title: workoutTitle,
      type,
      durationMinutes,
      caloriesBurned,
      xpEarned: Math.round(durationMinutes * 3.5 + caloriesBurned / 4) + (isPersonalRecord ? 100 : 0),
      exercises: type === 'Strength' || type === 'CrossFit' ? exercises : undefined,
      notes: notes.trim(),
      isPersonalRecord
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <div id="log-workout-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-[#0F172A] border border-slate-700/80 rounded-3xl p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Log Workout Session</h3>
                <p className="text-xs text-slate-400">Earn XP, build challenge score & level up</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="overflow-y-auto space-y-5 py-4 flex-1">
            {/* Workout Type */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {(['Strength', 'Cardio', 'HIIT', 'CrossFit', 'Yoga / Mobility', 'Boxing', 'Functional'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      type === t
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Workout Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`e.g. Heavy Chest & Triceps Pump or 5km Sprints`}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            {/* Duration & Calories */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5 text-cyan-400" />
                  Duration (Mins)
                </label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={durationMinutes}
                  onChange={(e) => {
                    const d = Number(e.target.value);
                    setDurationMinutes(d);
                    setCaloriesBurned(Math.round(d * 8.5));
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Est. Calories (kcal)
                </label>
                <input
                  type="number"
                  min="20"
                  max="3000"
                  value={caloriesBurned}
                  onChange={(e) => setCaloriesBurned(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Exercises table for strength */}
            {(type === 'Strength' || type === 'CrossFit') && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Key Exercises
                  </label>
                  <button
                    type="button"
                    onClick={handleAddExercise}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Exercise
                  </button>
                </div>

                <div className="space-y-2">
                  {exercises.map((ex, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <input
                        type="text"
                        value={ex.name}
                        onChange={(e) => handleUpdateExercise(i, 'name', e.target.value)}
                        placeholder="Exercise name"
                        className="flex-1 px-2.5 py-1 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Sets"
                        value={ex.sets}
                        onChange={(e) => handleUpdateExercise(i, 'sets', Number(e.target.value))}
                        className="w-14 px-2 py-1 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-center font-mono outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Reps"
                        value={ex.reps}
                        onChange={(e) => handleUpdateExercise(i, 'reps', Number(e.target.value))}
                        className="w-14 px-2 py-1 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-center font-mono outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Kg"
                        value={ex.weightKg || ''}
                        onChange={(e) => handleUpdateExercise(i, 'weightKg', Number(e.target.value))}
                        className="w-16 px-2 py-1 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-center font-mono outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(i)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Record Flag */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between cursor-pointer" onClick={() => setIsPersonalRecord(!isPersonalRecord)}>
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-xs font-bold text-white">Hit a New Personal Record (PR)?</div>
                  <div className="text-[11px] text-amber-300/80">Awards +100 bonus XP and creates a Community PR post!</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isPersonalRecord}
                onChange={(e) => setIsPersonalRecord(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Workout Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Felt energetic, top set moved fast, great pump..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 outline-none resize-none focus:border-emerald-500"
              />
            </div>

            {/* Projected XP Earned */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400" />
                Estimated XP from this session:
              </div>
              <div className="text-sm font-black text-emerald-400 font-mono">
                +{Math.round(durationMinutes * 3.5 + caloriesBurned / 4) + (isPersonalRecord ? 100 : 0)} XP
              </div>
            </div>

            {/* Submit */}
            <button
              id="btn-save-workout"
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>Log Workout & Claim XP</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
