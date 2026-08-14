import { Member, Challenge, AutomatedRule, CommunityPost, GymStats, WorkoutRecord } from '../types';
import { calculateMemberChurnRisk } from '../services/churnEngine';
import { ALL_BADGES } from '../services/gamificationEngine';

export const INITIAL_GYM_STATS: GymStats = {
  totalMembers: 248,
  activeMembers: 194,
  inactiveGhostMembers: 54,
  atRiskMembersCount: 22,
  retentionRatePercent: 89.2,
  avgWeeklyAttendance: 884,
  streakMastersCount: 68,
  recentCancellations: [
    {
      id: 'canc_1',
      memberName: 'David Miller',
      memberAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      tier: 'Basic',
      date: '2026-08-10',
      reason: 'Lost motivation after breaking 10-day workout habit; felt intimidated coming back alone.',
      tenureMonths: 2.5
    },
    {
      id: 'canc_2',
      memberName: 'Rachel Green',
      memberAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      tier: 'Pro',
      date: '2026-08-04',
      reason: 'Relocated job; mentioned she would have stayed if remote accountability workouts were offered.',
      tenureMonths: 7
    },
    {
      id: 'canc_3',
      memberName: 'Kevin Zhang',
      memberAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      tier: 'Basic',
      date: '2026-07-28',
      reason: 'Ghosted for 3 weeks; price sensitivity without regular utilization.',
      tenureMonths: 1.8
    }
  ]
};

const rawMembers: Omit<Member, 'churnRisk'>[] = [
  {
    id: 'mem_1',
    name: 'Sarah Connor',
    email: 'sarah.c@fitpulse.gym',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    tier: 'VIP Black',
    status: 'active',
    joinedDate: '2025-09-15',
    lastVisitDate: '2026-08-14',
    daysSinceLastVisit: 0,
    weeklyAttendanceGoal: 5,
    weeklyAttendanceCurrent: 5,
    attendanceHistory: [
      { id: 'att_1', date: '2026-08-14', checkInTime: '06:45 AM', durationMinutes: 65, gymLocation: 'Downtown Main Gym', method: 'NFC' },
      { id: 'att_2', date: '2026-08-13', checkInTime: '07:10 AM', durationMinutes: 60, gymLocation: 'Downtown Main Gym', method: 'NFC' },
      { id: 'att_3', date: '2026-08-12', checkInTime: '06:30 AM', durationMinutes: 75, gymLocation: 'Downtown Main Gym', method: 'NFC' },
      { id: 'att_4', date: '2026-08-11', checkInTime: '07:00 AM', durationMinutes: 50, gymLocation: 'Downtown Main Gym', method: 'NFC' },
      { id: 'att_5', date: '2026-08-10', checkInTime: '06:40 AM', durationMinutes: 70, gymLocation: 'Downtown Main Gym', method: 'NFC' }
    ],
    totalWorkouts: 118,
    currentStreak: 21,
    bestStreak: 21,
    previousStreak: 19,
    level: 8,
    levelTitle: 'Apex Athlete',
    xp: 9650,
    nextLevelXp: 12000,
    weeklyPoints: 920,
    monthlyPoints: 3450,
    leaderboardRank: 1,
    rankChange: 0,
    badges: [
      { ...ALL_BADGES[0], unlockedAt: '2025-09-15' },
      { ...ALL_BADGES[1], unlockedAt: '2025-09-18' },
      { ...ALL_BADGES[2], unlockedAt: '2025-09-22' },
      { ...ALL_BADGES[3], unlockedAt: '2025-10-06' },
      { ...ALL_BADGES[5], unlockedAt: '2025-11-01' },
      { ...ALL_BADGES[6], unlockedAt: '2026-02-15' },
      { ...ALL_BADGES[7], unlockedAt: '2026-06-20' },
      { ...ALL_BADGES[8], unlockedAt: '2026-01-10' },
      { ...ALL_BADGES[9], unlockedAt: '2026-04-12' }
    ],
    activeChallengeIds: ['chal_5days', 'chal_streak30', 'chal_shred'],
    favoriteWorkouts: ['Strength', 'CrossFit', 'HIIT'],
    phone: '+1 (555) 384-9921',
    todayCheckedIn: true
  },
  {
    id: 'mem_2',
    name: 'Jordan Lee',
    email: 'jordan.lee@fitpulse.gym',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    tier: 'Pro',
    status: 'active',
    joinedDate: '2025-11-02',
    lastVisitDate: '2026-08-13',
    daysSinceLastVisit: 1,
    weeklyAttendanceGoal: 4,
    weeklyAttendanceCurrent: 4,
    attendanceHistory: [
      { id: 'att_21', date: '2026-08-13', checkInTime: '05:30 PM', durationMinutes: 55, gymLocation: 'Downtown Main Gym', method: 'QR Code' },
      { id: 'att_22', date: '2026-08-11', checkInTime: '06:00 PM', durationMinutes: 60, gymLocation: 'Downtown Main Gym', method: 'QR Code' }
    ],
    totalWorkouts: 84,
    currentStreak: 12,
    bestStreak: 18,
    previousStreak: 18,
    level: 7,
    levelTitle: 'Iron Titan',
    xp: 7850,
    nextLevelXp: 8800,
    weeklyPoints: 780,
    monthlyPoints: 2980,
    leaderboardRank: 2,
    rankChange: 1,
    badges: [
      { ...ALL_BADGES[0], unlockedAt: '2025-11-02' },
      { ...ALL_BADGES[1], unlockedAt: '2025-11-05' },
      { ...ALL_BADGES[2], unlockedAt: '2025-11-10' },
      { ...ALL_BADGES[5], unlockedAt: '2026-01-20' },
      { ...ALL_BADGES[6], unlockedAt: '2026-05-18' }
    ],
    activeChallengeIds: ['chal_5days', 'chal_10workouts'],
    favoriteWorkouts: ['Strength', 'Functional'],
    phone: '+1 (555) 772-1092',
    todayCheckedIn: false
  },
  {
    id: 'mem_3',
    name: 'Maya Patel',
    email: 'maya.patel@fitpulse.gym',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    tier: 'Pro',
    status: 'active',
    joinedDate: '2026-01-10',
    lastVisitDate: '2026-08-14',
    daysSinceLastVisit: 0,
    weeklyAttendanceGoal: 4,
    weeklyAttendanceCurrent: 3,
    attendanceHistory: [
      { id: 'att_31', date: '2026-08-14', checkInTime: '08:00 AM', durationMinutes: 45, gymLocation: 'Westside Studio', method: 'GPS Auto-CheckIn' }
    ],
    totalWorkouts: 62,
    currentStreak: 9,
    bestStreak: 14,
    previousStreak: 14,
    level: 6,
    levelTitle: 'Barbell Beast',
    xp: 5920,
    nextLevelXp: 6200,
    weeklyPoints: 690,
    monthlyPoints: 2650,
    leaderboardRank: 3,
    rankChange: -1,
    badges: [
      { ...ALL_BADGES[0], unlockedAt: '2026-01-10' },
      { ...ALL_BADGES[1], unlockedAt: '2026-01-14' },
      { ...ALL_BADGES[2], unlockedAt: '2026-01-22' },
      { ...ALL_BADGES[5], unlockedAt: '2026-03-01' }
    ],
    activeChallengeIds: ['chal_5days', 'chal_shred'],
    favoriteWorkouts: ['HIIT', 'Boxing', 'Yoga / Mobility'],
    phone: '+1 (555) 918-4421',
    todayCheckedIn: true
  },
  {
    id: 'mem_4',
    name: 'Devraj Chen',
    email: 'devraj.chen@fitpulse.gym',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    tier: 'Basic',
    status: 'at_risk',
    joinedDate: '2026-03-15',
    lastVisitDate: '2026-08-08',
    daysSinceLastVisit: 6,
    weeklyAttendanceGoal: 4,
    weeklyAttendanceCurrent: 0,
    attendanceHistory: [
      { id: 'att_41', date: '2026-08-08', checkInTime: '06:15 PM', durationMinutes: 40, gymLocation: 'Downtown Main Gym', method: 'QR Code' }
    ],
    totalWorkouts: 28,
    currentStreak: 0,
    bestStreak: 14,
    previousStreak: 14,
    level: 4,
    levelTitle: 'Endurance Runner',
    xp: 2450,
    nextLevelXp: 2700,
    weeklyPoints: 0,
    monthlyPoints: 840,
    leaderboardRank: 12,
    rankChange: -4,
    badges: [
      { ...ALL_BADGES[0], unlockedAt: '2026-03-15' },
      { ...ALL_BADGES[1], unlockedAt: '2026-03-20' },
      { ...ALL_BADGES[2], unlockedAt: '2026-03-28' },
      { ...ALL_BADGES[3], unlockedAt: '2026-04-12' },
      { ...ALL_BADGES[5], unlockedAt: '2026-05-02' }
    ],
    activeChallengeIds: ['chal_5days'],
    favoriteWorkouts: ['Strength', 'Cardio'],
    phone: '+1 (555) 439-0192',
    notes: 'Lost 14-day streak on Aug 9. Reported feeling exhausted at work.',
    todayCheckedIn: false
  },
  {
    id: 'mem_5',
    name: 'Alex Rivera',
    email: 'alex.rivera@fitpulse.gym',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    tier: 'Pro',
    status: 'inactive',
    joinedDate: '2026-04-20',
    lastVisitDate: '2026-08-01',
    daysSinceLastVisit: 13,
    weeklyAttendanceGoal: 3,
    weeklyAttendanceCurrent: 0,
    attendanceHistory: [
      { id: 'att_51', date: '2026-08-01', checkInTime: '11:00 AM', durationMinutes: 35, gymLocation: 'Westside Studio', method: 'Front Desk' }
    ],
    totalWorkouts: 16,
    currentStreak: 0,
    bestStreak: 6,
    previousStreak: 6,
    level: 3,
    levelTitle: 'Pulse Athlete',
    xp: 1340,
    nextLevelXp: 1600,
    weeklyPoints: 0,
    monthlyPoints: 310,
    leaderboardRank: 18,
    rankChange: -6,
    badges: [
      { ...ALL_BADGES[0], unlockedAt: '2026-04-20' },
      { ...ALL_BADGES[1], unlockedAt: '2026-04-25' },
      { ...ALL_BADGES[5], unlockedAt: '2026-06-15' }
    ],
    activeChallengeIds: [],
    favoriteWorkouts: ['Cardio', 'Functional'],
    phone: '+1 (555) 883-9201',
    notes: 'Ghost member flag: 13 days absent. AI recommends VIP recovery smoothie + personal stretch coach.',
    todayCheckedIn: false
  },
  {
    id: 'mem_6',
    name: 'Chloe Bennett',
    email: 'chloe.bennett@fitpulse.gym',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    tier: 'Basic',
    status: 'inactive',
    joinedDate: '2026-07-22',
    lastVisitDate: '2026-08-05',
    daysSinceLastVisit: 9,
    weeklyAttendanceGoal: 3,
    weeklyAttendanceCurrent: 0,
    attendanceHistory: [
      { id: 'att_61', date: '2026-08-05', checkInTime: '05:45 PM', durationMinutes: 30, gymLocation: 'Downtown Main Gym', method: 'QR Code' },
      { id: 'att_62', date: '2026-07-25', checkInTime: '06:00 PM', durationMinutes: 40, gymLocation: 'Downtown Main Gym', method: 'QR Code' }
    ],
    totalWorkouts: 3,
    currentStreak: 0,
    bestStreak: 2,
    previousStreak: 2,
    level: 1,
    levelTitle: 'Rookie Lifter',
    xp: 220,
    nextLevelXp: 300,
    weeklyPoints: 0,
    monthlyPoints: 220,
    leaderboardRank: 24,
    rankChange: -8,
    badges: [
      { ...ALL_BADGES[0], unlockedAt: '2026-07-22' }
    ],
    activeChallengeIds: [],
    favoriteWorkouts: ['Yoga / Mobility', 'Cardio'],
    phone: '+1 (555) 602-8819',
    notes: 'Danger zone: 1st month onboarding cliff with only 3 workouts logged. Needs high-touch onboarding.',
    todayCheckedIn: false
  },
  {
    id: 'mem_7',
    name: 'Leo Ramirez',
    email: 'leo.ramirez@fitpulse.gym',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    tier: 'Student',
    status: 'at_risk',
    joinedDate: '2026-02-18',
    lastVisitDate: '2026-08-09',
    daysSinceLastVisit: 5,
    weeklyAttendanceGoal: 4,
    weeklyAttendanceCurrent: 1,
    attendanceHistory: [
      { id: 'att_71', date: '2026-08-09', checkInTime: '04:30 PM', durationMinutes: 50, gymLocation: 'Downtown Main Gym', method: 'QR Code' }
    ],
    totalWorkouts: 42,
    currentStreak: 0,
    bestStreak: 8,
    previousStreak: 8,
    level: 5,
    levelTitle: 'Steel Warrior',
    xp: 3450,
    nextLevelXp: 4200,
    weeklyPoints: 120,
    monthlyPoints: 1420,
    leaderboardRank: 10,
    rankChange: -2,
    badges: [
      { ...ALL_BADGES[0], unlockedAt: '2026-02-18' },
      { ...ALL_BADGES[1], unlockedAt: '2026-02-23' },
      { ...ALL_BADGES[2], unlockedAt: '2026-03-02' },
      { ...ALL_BADGES[5], unlockedAt: '2026-04-10' }
    ],
    activeChallengeIds: ['chal_10workouts'],
    favoriteWorkouts: ['Strength', 'Boxing'],
    phone: '+1 (555) 789-2144',
    todayCheckedIn: false
  },
  {
    id: 'mem_8',
    name: 'Emma Watson',
    email: 'emma.w@fitpulse.gym',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    tier: 'VIP Black',
    status: 'active',
    joinedDate: '2025-10-15',
    lastVisitDate: '2026-08-14',
    daysSinceLastVisit: 0,
    weeklyAttendanceGoal: 4,
    weeklyAttendanceCurrent: 4,
    attendanceHistory: [
      { id: 'att_81', date: '2026-08-14', checkInTime: '07:30 AM', durationMinutes: 55, gymLocation: 'Downtown Main Gym', method: 'NFC' }
    ],
    totalWorkouts: 79,
    currentStreak: 7,
    bestStreak: 16,
    previousStreak: 12,
    level: 6,
    levelTitle: 'Barbell Beast',
    xp: 5400,
    nextLevelXp: 6200,
    weeklyPoints: 620,
    monthlyPoints: 2420,
    leaderboardRank: 4,
    rankChange: 2,
    badges: [
      { ...ALL_BADGES[0], unlockedAt: '2025-10-15' },
      { ...ALL_BADGES[1], unlockedAt: '2025-10-20' },
      { ...ALL_BADGES[2], unlockedAt: '2025-10-28' },
      { ...ALL_BADGES[5], unlockedAt: '2026-01-15' },
      { ...ALL_BADGES[6], unlockedAt: '2026-05-10' }
    ],
    activeChallengeIds: ['chal_5days', 'chal_shred'],
    favoriteWorkouts: ['HIIT', 'CrossFit'],
    phone: '+1 (555) 438-9912',
    todayCheckedIn: true
  },
  {
    id: 'mem_9',
    name: 'Brandon Cole',
    email: 'brandon.c@fitpulse.gym',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    tier: 'VIP Black',
    status: 'inactive',
    joinedDate: '2025-08-01',
    lastVisitDate: '2026-07-28',
    daysSinceLastVisit: 17,
    weeklyAttendanceGoal: 3,
    weeklyAttendanceCurrent: 0,
    attendanceHistory: [
      { id: 'att_91', date: '2026-07-28', checkInTime: '06:00 PM', durationMinutes: 45, gymLocation: 'Downtown Main Gym', method: 'QR Code' }
    ],
    totalWorkouts: 54,
    currentStreak: 0,
    bestStreak: 10,
    previousStreak: 10,
    level: 5,
    levelTitle: 'Steel Warrior',
    xp: 3820,
    nextLevelXp: 4200,
    weeklyPoints: 0,
    monthlyPoints: 450,
    leaderboardRank: 20,
    rankChange: -7,
    badges: [
      { ...ALL_BADGES[0], unlockedAt: '2025-08-01' },
      { ...ALL_BADGES[1], unlockedAt: '2025-08-06' },
      { ...ALL_BADGES[2], unlockedAt: '2025-08-15' },
      { ...ALL_BADGES[5], unlockedAt: '2025-11-20' }
    ],
    activeChallengeIds: [],
    favoriteWorkouts: ['Strength', 'Functional'],
    phone: '+1 (555) 332-9011',
    notes: 'High-value VIP Black member inactive for 17 days. High priority for personal call from owner.',
    todayCheckedIn: false
  },
  {
    id: 'mem_10',
    name: 'Priya Sharma',
    email: 'priya.s@fitpulse.gym',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    tier: 'Pro',
    status: 'active',
    joinedDate: '2025-12-05',
    lastVisitDate: '2026-08-13',
    daysSinceLastVisit: 1,
    weeklyAttendanceGoal: 4,
    weeklyAttendanceCurrent: 3,
    attendanceHistory: [
      { id: 'att_101', date: '2026-08-13', checkInTime: '06:15 AM', durationMinutes: 50, gymLocation: 'Downtown Main Gym', method: 'NFC' }
    ],
    totalWorkouts: 68,
    currentStreak: 10,
    bestStreak: 15,
    previousStreak: 15,
    level: 6,
    levelTitle: 'Barbell Beast',
    xp: 5120,
    nextLevelXp: 6200,
    weeklyPoints: 560,
    monthlyPoints: 2180,
    leaderboardRank: 5,
    rankChange: 0,
    badges: [
      { ...ALL_BADGES[0], unlockedAt: '2025-12-05' },
      { ...ALL_BADGES[1], unlockedAt: '2025-12-10' },
      { ...ALL_BADGES[2], unlockedAt: '2025-12-20' },
      { ...ALL_BADGES[5], unlockedAt: '2026-02-14' },
      { ...ALL_BADGES[8], unlockedAt: '2026-03-01' }
    ],
    activeChallengeIds: ['chal_5days', 'chal_10workouts'],
    favoriteWorkouts: ['HIIT', 'Strength', 'Boxing'],
    phone: '+1 (555) 991-8842',
    todayCheckedIn: false
  }
];

// Initialize members with computed Churn Risk assessments
export const INITIAL_MEMBERS: Member[] = rawMembers.map((m) => ({
  ...m,
  churnRisk: calculateMemberChurnRisk(m)
}));

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'chal_5days',
    title: '5-Day Attendance Blitz',
    description: 'Check in to the gym at least 5 days this week to earn the High-Octane Habit trophy and massive bonus XP!',
    category: 'attendance',
    targetValue: 5,
    unit: 'days',
    rewardXp: 500,
    rewardBadgeId: 'badge_early_bird',
    badgeName: 'Blitz Champion',
    startDate: '2026-08-10',
    endDate: '2026-08-17',
    participantCount: 74,
    participants: ['mem_1', 'mem_2', 'mem_3', 'mem_4', 'mem_8', 'mem_10'],
    completedMembers: ['mem_1'],
    icon: 'Flame',
    isFeatured: true
  },
  {
    id: 'chal_streak30',
    title: '30-Day Streak Inferno',
    description: 'Maintain an unbroken 30-day streak of daily gym check-ins or logged active recovery sessions.',
    category: 'streak',
    targetValue: 30,
    unit: 'days',
    rewardXp: 2000,
    rewardBadgeId: 'badge_streak_30',
    badgeName: 'Titan of Will',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    participantCount: 42,
    participants: ['mem_1'],
    completedMembers: [],
    icon: 'Crown',
    isFeatured: true
  },
  {
    id: 'chal_10workouts',
    title: 'Decathlon Club: 10 Workouts',
    description: 'Complete and log 10 dedicated strength or cardio workouts in under 14 days.',
    category: 'workouts',
    targetValue: 10,
    unit: 'workouts',
    rewardXp: 750,
    rewardBadgeId: 'badge_workouts_10',
    badgeName: 'Decathlon Club',
    startDate: '2026-08-05',
    endDate: '2026-08-19',
    participantCount: 58,
    participants: ['mem_2', 'mem_7', 'mem_10'],
    completedMembers: [],
    icon: 'Dumbbell'
  },
  {
    id: 'chal_shred',
    title: 'FitPulse Summer Shred 2026',
    description: 'Burn 6,000 active calories across high-energy classes, treadmill sprints, and functional HIIT.',
    category: 'calories',
    targetValue: 6000,
    unit: 'kcal',
    rewardXp: 1200,
    badgeName: 'Inferno Master',
    startDate: '2026-08-01',
    endDate: '2026-08-25',
    participantCount: 88,
    participants: ['mem_1', 'mem_3', 'mem_8'],
    completedMembers: ['mem_1'],
    icon: 'Zap'
  },
  {
    id: 'chal_recovery_quest',
    title: 'Phoenix 3-Day Habit Recovery',
    description: 'Restart your gym momentum! Check in 3 times this week to restore your streak multiplier and claim +300 Comeback XP.',
    category: 'attendance',
    targetValue: 3,
    unit: 'visits',
    rewardXp: 300,
    rewardBadgeId: 'badge_streak_rescue',
    badgeName: 'Phoenix Comeback',
    startDate: '2026-08-10',
    endDate: '2026-08-20',
    participantCount: 16,
    participants: ['mem_4', 'mem_5'],
    completedMembers: [],
    icon: 'Sparkles'
  }
];

export const INITIAL_AUTOMATED_RULES: AutomatedRule[] = [
  {
    id: 'rule_1',
    title: '3 Missed Visits → Friendly Check-in',
    triggerType: 'missed_visits',
    conditionValue: 3,
    conditionDescription: 'Member misses 3 expected weekly workouts',
    actionType: 'send_ai_sms',
    actionPayload: {
      messageTemplate: "Hey {{firstName}}! We missed your smile at FitPulse. Hope all is well! Your gym fam is saving your favorite spot.",
      channel: 'SMS',
      xpBonus: 50
    },
    isActive: true,
    timesTriggered: 34,
    lastTriggered: '2026-08-13 14:20',
    successRate: 64
  },
  {
    id: 'rule_2',
    title: '7 Days Inactive → VIP Recovery Voucher',
    triggerType: 'inactive_days',
    conditionValue: 7,
    conditionDescription: 'No gym check-in or app log for 7 consecutive days',
    actionType: 'issue_incentive_voucher',
    actionPayload: {
      incentiveTitle: 'Complimentary Post-Workout Protein Smoothie Voucher + 150 Comeback XP',
      messageTemplate: 'Hey {{firstName}}, we want to give you a fresh boost! Show this in-app pass for a free smoothie on your next visit.',
      channel: 'Push',
      xpBonus: 150
    },
    isActive: true,
    timesTriggered: 19,
    lastTriggered: '2026-08-12 09:15',
    successRate: 58
  },
  {
    id: 'rule_3',
    title: 'Streak Broken → Auto Phoenix Quest',
    triggerType: 'streak_broken',
    conditionValue: 1,
    conditionDescription: 'Member loses an active streak of 7+ days',
    actionType: 'assign_recovery_quest',
    actionPayload: {
      incentiveTitle: 'Phoenix 3-Day Recovery Quest',
      messageTemplate: "Don't sweat the broken streak, {{firstName}}! Complete 3 workouts this week to revive your streak multiplier.",
      channel: 'Push',
      xpBonus: 300
    },
    isActive: true,
    timesTriggered: 27,
    lastTriggered: '2026-08-14 02:00',
    successRate: 72
  },
  {
    id: 'rule_4',
    title: '14 Days Ghost Member → Coach Urgent Alert',
    triggerType: 'inactive_days',
    conditionValue: 14,
    conditionDescription: 'Member inactive for 14+ days (Critical Churn Zone)',
    actionType: 'alert_coach',
    actionPayload: {
      messageTemplate: 'High churn alert for {{fullName}}. Member has not visited in 14 days. Assigning 1-on-1 coach call.',
      channel: 'Push'
    },
    isActive: true,
    timesTriggered: 12,
    lastTriggered: '2026-08-11 11:30',
    successRate: 46
  }
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post_1',
    authorId: 'mem_1',
    authorName: 'Sarah Connor',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authorTier: 'VIP Black',
    authorLevel: 8,
    type: 'streak_milestone',
    title: '21-Day Habit Milestone Crushed! 🔥',
    content: "Hit my 21-Day attendance streak this morning at 6:45 AM! Deadlifts felt light today. Consistency really is the secret weapon. Big shoutout to the morning squad!",
    timestamp: '2 hours ago',
    stats: {
      streak: 21,
      xpEarned: 350
    },
    likes: 38,
    userLiked: true,
    fistBumps: 24,
    userFistBumped: true,
    fires: 31,
    userFired: true,
    comments: [
      {
        id: 'c_1',
        authorName: 'Jordan Lee',
        authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        text: 'Absolute beast Sarah! Coming for that #1 leaderboard spot though! 💪🔥',
        timestamp: '1 hour ago'
      },
      {
        id: 'c_2',
        authorName: 'Maya Patel',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        text: 'Incredible dedication! Inspiring as always 🙌',
        timestamp: '45 mins ago'
      }
    ]
  },
  {
    id: 'post_2',
    authorId: 'mem_2',
    authorName: 'Jordan Lee',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    authorTier: 'Pro',
    authorLevel: 7,
    type: 'workout_pr',
    title: 'New Personal Record: 180kg Squat 🏋️‍♂️',
    content: 'Finally broke my plateau on barbell back squats! 180kg (396 lbs) for a clean triple. Thanks Coach Marcus for the cueing tips last Tuesday!',
    timestamp: '5 hours ago',
    stats: {
      workoutType: 'Heavy Leg Day',
      xpEarned: 250
    },
    likes: 29,
    userLiked: false,
    fistBumps: 19,
    userFistBumped: false,
    fires: 22,
    userFired: false,
    comments: [
      {
        id: 'c_3',
        authorName: 'Emma Watson',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        text: 'Solid depth on those reps! Huge PR!',
        timestamp: '3 hours ago'
      }
    ]
  },
  {
    id: 'post_3',
    authorId: 'mem_3',
    authorName: 'Maya Patel',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    authorTier: 'Pro',
    authorLevel: 6,
    type: 'achievement',
    title: 'Unlocked "Barbell Beast" Level 6 Badge! 🛡️',
    content: 'Just leveled up to Level 6 Barbell Beast! Loving the new gym energy and all the challenges this month. Let’s keep moving everyone!',
    timestamp: 'Yesterday',
    stats: {
      badgeName: 'Barbell Beast',
      xpEarned: 500
    },
    likes: 21,
    userLiked: true,
    fistBumps: 15,
    userFistBumped: false,
    fires: 14,
    userFired: true,
    comments: []
  }
];

export const INITIAL_RECENT_WORKOUTS: WorkoutRecord[] = [
  {
    id: 'w_1',
    memberId: 'mem_1',
    title: 'Heavy Lower Body & Posterior Chain',
    type: 'Strength',
    durationMinutes: 65,
    caloriesBurned: 540,
    xpEarned: 280,
    exercises: [
      { name: 'Barbell Deadlift', sets: 4, reps: 6, weightKg: 120 },
      { name: 'Bulgarian Split Squats', sets: 3, reps: 10, weightKg: 24 },
      { name: 'Hamstring Curls', sets: 4, reps: 12, weightKg: 45 }
    ],
    notes: 'Reps moved fast. Form felt crisp on top set.',
    isPersonalRecord: true,
    timestamp: '2026-08-14 07:45'
  },
  {
    id: 'w_2',
    memberId: 'mem_1',
    title: 'High-Octane Metcon Intervals',
    type: 'HIIT',
    durationMinutes: 45,
    caloriesBurned: 490,
    xpEarned: 220,
    exercises: [
      { name: 'Rowing Ergometer Sprint', sets: 5, reps: 500 },
      { name: 'Kettlebell Swings', sets: 5, reps: 20, weightKg: 24 },
      { name: 'Box Jump Overs', sets: 5, reps: 15 }
    ],
    timestamp: '2026-08-13 08:00'
  }
];
