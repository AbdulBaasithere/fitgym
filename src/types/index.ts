export type UserRole = 'admin' | 'member';

export type ChurnRiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export type MembershipTier = 'Basic' | 'Pro' | 'VIP Black' | 'Student';

export type MemberStatus = 'active' | 'at_risk' | 'inactive' | 'cancelled';

export interface ChurnFactor {
  name: string;
  impact: 'low' | 'medium' | 'high';
  detail: string;
}

export interface ChurnRiskAssessment {
  score: number; // 0 to 100
  level: ChurnRiskLevel;
  factors: ChurnFactor[];
  rootCause: string;
  recommendedAction: string;
  lastCalculated: string;
  predictedDropDate?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // ISO date string
  checkInTime: string;
  durationMinutes: number;
  gymLocation: string;
  method: 'QR Code' | 'NFC' | 'Front Desk' | 'GPS Auto-CheckIn';
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: number;
  weightKg?: number;
}

export interface WorkoutRecord {
  id: string;
  memberId: string;
  title: string;
  type: 'Strength' | 'Cardio' | 'HIIT' | 'CrossFit' | 'Yoga / Mobility' | 'Boxing' | 'Functional';
  durationMinutes: number;
  caloriesBurned: number;
  xpEarned: number;
  exercises?: WorkoutExercise[];
  notes?: string;
  isPersonalRecord?: boolean;
  timestamp: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name or emoji
  category: 'streak' | 'workouts' | 'challenges' | 'community' | 'retention' | 'special';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  xpBonus: number;
  unlockedAt?: string;
  progress?: number; // 0 - 100%
  requiredCount?: number;
  currentCount?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'attendance' | 'streak' | 'workouts' | 'calories' | 'social';
  targetValue: number;
  unit: string;
  rewardXp: number;
  rewardBadgeId?: string;
  badgeName?: string;
  startDate: string;
  endDate: string;
  participantCount: number;
  participants: string[]; // member IDs
  completedMembers: string[]; // member IDs
  icon: string;
  isFeatured?: boolean;
  userProgress?: number; // computed for active user
  isJoined?: boolean;
  isCompleted?: boolean;
}

export interface AutomatedRule {
  id: string;
  title: string;
  triggerType: 'missed_visits' | 'inactive_days' | 'streak_broken' | 'milestone_reached' | 'low_app_open';
  conditionValue: number;
  conditionDescription: string;
  actionType: 'send_ai_sms' | 'push_notification' | 'assign_recovery_quest' | 'issue_incentive_voucher' | 'alert_coach';
  actionPayload: {
    messageTemplate?: string;
    incentiveTitle?: string;
    xpBonus?: number;
    channel?: 'Push' | 'SMS' | 'Email';
  };
  isActive: boolean;
  timesTriggered: number;
  lastTriggered?: string;
  successRate: number; // percentage of members who returned
}

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tier: MembershipTier;
  status: MemberStatus;
  joinedDate: string;
  lastVisitDate: string;
  daysSinceLastVisit: number;
  weeklyAttendanceGoal: number; // e.g. 4
  weeklyAttendanceCurrent: number; // e.g. 2
  attendanceHistory: AttendanceRecord[];
  totalWorkouts: number;
  currentStreak: number;
  bestStreak: number;
  previousStreak?: number;
  streakFrozen?: boolean;
  level: number;
  levelTitle: string;
  xp: number;
  nextLevelXp: number;
  weeklyPoints: number;
  monthlyPoints: number;
  leaderboardRank: number;
  rankChange: number; // e.g. +2 or -1
  badges: Badge[];
  activeChallengeIds: string[];
  favoriteWorkouts: string[];
  churnRisk: ChurnRiskAssessment;
  phone?: string;
  notes?: string;
  todayCheckedIn?: boolean;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorTier: MembershipTier;
  authorLevel: number;
  type: 'achievement' | 'streak_milestone' | 'workout_pr' | 'challenge_done' | 'general';
  title?: string;
  content: string;
  timestamp: string;
  stats?: {
    streak?: number;
    badgeName?: string;
    xpEarned?: number;
    workoutType?: string;
  };
  likes: number;
  userLiked?: boolean;
  fistBumps: number;
  userFistBumped?: boolean;
  fires: number;
  userFired?: boolean;
  comments: {
    id: string;
    authorName: string;
    authorAvatar: string;
    text: string;
    timestamp: string;
  }[];
}

export interface AppNotification {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: 'streak' | 'level_up' | 'leaderboard' | 'challenge' | 'admin_outreach' | 'reward' | 'community';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  data?: any;
}

export interface GymStats {
  totalMembers: number;
  activeMembers: number;
  inactiveGhostMembers: number;
  atRiskMembersCount: number;
  retentionRatePercent: number;
  avgWeeklyAttendance: number;
  streakMastersCount: number;
  recentCancellations: {
    id: string;
    memberName: string;
    memberAvatar: string;
    tier: MembershipTier;
    date: string;
    reason: string;
    tenureMonths: number;
  }[];
}

export interface CelebrationModalState {
  isOpen: boolean;
  title: string;
  subtitle: string;
  type: 'streak' | 'level_up' | 'badge' | 'challenge' | 'checkin';
  rewardXp?: number;
  badgeName?: string;
  streakCount?: number;
}

export interface FitPulseState {
  currentRole: UserRole;
  currentUserId: string;
  adminProfile: {
    id: string;
    name: string;
    email: string;
    role: string;
    gymName: string;
    avatar: string;
  };
  members: Member[];
  challenges: Challenge[];
  rules: AutomatedRule[];
  communityPosts: CommunityPost[];
  workouts: WorkoutRecord[];
  notifications: AppNotification[];
  gymStats: GymStats;
  celebrationModal: CelebrationModalState | null;
}

