import { Badge, Member } from '../types';
import confetti from 'canvas-confetti';

export const LEVEL_THRESHOLDS = [
  { level: 1, xpRequired: 0, title: 'Rookie Lifter' },
  { level: 2, xpRequired: 300, title: 'Iron Starter' },
  { level: 3, xpRequired: 800, title: 'Pulse Athlete' },
  { level: 4, xpRequired: 1600, title: 'Endurance Runner' },
  { level: 5, xpRequired: 2700, title: 'Steel Warrior' },
  { level: 6, xpRequired: 4200, title: 'Barbell Beast' },
  { level: 7, xpRequired: 6200, title: 'Iron Titan' },
  { level: 8, xpRequired: 8800, title: 'Apex Athlete' },
  { level: 9, xpRequired: 12000, title: 'Gym Master' },
  { level: 10, xpRequired: 16000, title: 'Olympian Legend' },
];

export function getLevelDetails(totalXp: number) {
  let currentLevel = LEVEL_THRESHOLDS[0];
  let nextLevel = LEVEL_THRESHOLDS[1];

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXp >= LEVEL_THRESHOLDS[i].xpRequired) {
      currentLevel = LEVEL_THRESHOLDS[i];
      nextLevel = LEVEL_THRESHOLDS[i + 1] || {
        level: currentLevel.level + 1,
        xpRequired: currentLevel.xpRequired + 5000,
        title: 'Mythic Champion',
      };
    } else {
      break;
    }
  }

  const xpInCurrentLevel = totalXp - currentLevel.xpRequired;
  const xpNeededForNext = nextLevel.xpRequired - currentLevel.xpRequired;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpNeededForNext) * 100)));

  return {
    level: currentLevel.level,
    levelTitle: currentLevel.title,
    currentLevelXp: currentLevel.xpRequired,
    nextLevelXp: nextLevel.xpRequired,
    xpRemaining: Math.max(0, nextLevel.xpRequired - totalXp),
    progressPercent,
  };
}

export function getStreakMultiplier(streakDays: number): number {
  if (streakDays >= 30) return 2.0;
  if (streakDays >= 14) return 1.5;
  if (streakDays >= 7) return 1.25;
  if (streakDays >= 3) return 1.1;
  return 1.0;
}

export function triggerConfetti(intensity: 'small' | 'medium' | 'epic' = 'medium') {
  if (typeof window === 'undefined') return;

  if (intensity === 'small') {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10B981', '#06B6D4', '#F59E0B'],
    });
  } else if (intensity === 'medium') {
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10B981', '#00F59B', '#3B82F6', '#F59E0B', '#EC4899'],
    });
  } else {
    // Epic multi-stage celebration
    const end = Date.now() + 1200;
    const colors = ['#10B981', '#06B6D4', '#F59E0B', '#A855F7', '#FF5722'];

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }
}

export const ALL_BADGES: Badge[] = [
  {
    id: 'badge_first_checkin',
    name: 'First Step',
    description: 'Checked into FitPulse for the very first time.',
    icon: 'Footprints',
    category: 'retention',
    rarity: 'Common',
    xpBonus: 100,
    requiredCount: 1,
  },
  {
    id: 'badge_streak_3',
    name: 'Ignition Spark',
    description: 'Maintained a 3-day workout attendance streak.',
    icon: 'Zap',
    category: 'streak',
    rarity: 'Common',
    xpBonus: 150,
    requiredCount: 3,
  },
  {
    id: 'badge_streak_7',
    name: 'Unstoppable Habit',
    description: 'Crushed a 7-day attendance streak. 1.25x XP multiplier unlocked!',
    icon: 'Flame',
    category: 'streak',
    rarity: 'Rare',
    xpBonus: 350,
    requiredCount: 7,
  },
  {
    id: 'badge_streak_14',
    name: 'Iron Consistency',
    description: 'Dominated a 14-day streak. 1.5x XP multiplier unlocked!',
    icon: 'ShieldAlert',
    category: 'streak',
    rarity: 'Epic',
    xpBonus: 750,
    requiredCount: 14,
  },
  {
    id: 'badge_streak_30',
    name: 'Titan of Will',
    description: 'Achieved a legendary 30-day streak! 2.0x XP multiplier active.',
    icon: 'Crown',
    category: 'streak',
    rarity: 'Legendary',
    xpBonus: 2000,
    requiredCount: 30,
  },
  {
    id: 'badge_workouts_10',
    name: 'Decathlon Club',
    description: 'Completed 10 recorded workouts at FitPulse.',
    icon: 'Dumbbell',
    category: 'workouts',
    rarity: 'Common',
    xpBonus: 250,
    requiredCount: 10,
  },
  {
    id: 'badge_workouts_50',
    name: 'Half-Century Lifter',
    description: 'Completed 50 intense workouts in the gym.',
    icon: 'Award',
    category: 'workouts',
    rarity: 'Rare',
    xpBonus: 800,
    requiredCount: 50,
  },
  {
    id: 'badge_century_club',
    name: 'Century Legend',
    description: 'Completed 100 logged fitness sessions.',
    icon: 'Trophy',
    category: 'workouts',
    rarity: 'Legendary',
    xpBonus: 2500,
    requiredCount: 100,
  },
  {
    id: 'badge_early_bird',
    name: 'Dawn Patrol',
    description: 'Checked in before 7:00 AM for 5 morning sessions.',
    icon: 'Sunrise',
    category: 'retention',
    rarity: 'Rare',
    xpBonus: 400,
    requiredCount: 5,
  },
  {
    id: 'badge_challenge_champ',
    name: 'Challenge Crusher',
    description: 'Successfully finished 3 gym community competitions.',
    icon: 'Medal',
    category: 'challenges',
    rarity: 'Epic',
    xpBonus: 900,
    requiredCount: 3,
  },
  {
    id: 'badge_social_cheerleader',
    name: 'Hype Captain',
    description: 'Gave 25 High-Fives and cheers to fellow gym members.',
    icon: 'HeartHandshake',
    category: 'community',
    rarity: 'Common',
    xpBonus: 300,
    requiredCount: 25,
  },
  {
    id: 'badge_streak_rescue',
    name: 'Phoenix Comeback',
    description: 'Successfully completed a Streak Recovery Quest after an absence.',
    icon: 'Sparkles',
    category: 'retention',
    rarity: 'Epic',
    xpBonus: 600,
    requiredCount: 1,
  },
];
