import { Member, Challenge, AutomatedRule, CommunityPost, GymStats, WorkoutRecord, AppNotification, UserRole } from '../types';
import { INITIAL_MEMBERS, INITIAL_CHALLENGES, INITIAL_AUTOMATED_RULES, INITIAL_COMMUNITY_POSTS, INITIAL_GYM_STATS, INITIAL_RECENT_WORKOUTS } from '../data/initialData';
import { calculateMemberChurnRisk } from './churnEngine';
import { getLevelDetails, getStreakMultiplier, triggerConfetti, ALL_BADGES } from './gamificationEngine';

const STORAGE_KEY = 'fitpulse_app_state_v1';

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
  celebrationModal: {
    isOpen: boolean;
    title: string;
    subtitle: string;
    type: 'streak' | 'level_up' | 'badge' | 'challenge' | 'checkin';
    rewardXp?: number;
    badgeName?: string;
    streakCount?: number;
  } | null;
}

class StorageService {
  private state: FitPulseState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadInitialState();
  }

  private loadInitialState(): FitPulseState {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed.members) && parsed.members.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Could not load FitPulse state from localStorage', e);
      }
    }

    return {
      currentRole: 'admin',
      currentUserId: 'mem_1', // Sarah Connor by default when in member mode
      adminProfile: {
        id: 'admin_1',
        name: 'Marcus Vance',
        email: 'marcus.vance@fitpulse.gym',
        role: 'Head General Manager',
        gymName: 'FitPulse Downtown Club',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      members: INITIAL_MEMBERS,
      challenges: INITIAL_CHALLENGES,
      rules: INITIAL_AUTOMATED_RULES,
      communityPosts: INITIAL_COMMUNITY_POSTS,
      workouts: INITIAL_RECENT_WORKOUTS,
      notifications: [
        {
          id: 'notif_1',
          recipientId: 'mem_1',
          title: '🔥 21-Day Streak Legend!',
          message: 'You have hit a 21-day attendance streak! 1.5x XP multiplier is active.',
          type: 'streak',
          timestamp: '2 hours ago',
          read: false
        },
        {
          id: 'notif_2',
          recipientId: 'mem_1',
          title: '🏆 You hold #1 on the Gym Leaderboard',
          message: 'Jordan Lee is trailing by 140 pts. Keep up the high tempo!',
          type: 'leaderboard',
          timestamp: 'Yesterday',
          read: true
        }
      ],
      gymStats: INITIAL_GYM_STATS,
      celebrationModal: null
    };
  }

  private saveState() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.error('Failed to persist FitPulse state', e);
      }
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public getState(): FitPulseState {
    return this.state;
  }

  public setRole(role: UserRole) {
    this.state.currentRole = role;
    this.saveState();
  }

  public setCurrentUser(memberId: string) {
    const exists = this.state.members.some((m) => m.id === memberId);
    if (exists) {
      this.state.currentUserId = memberId;
      this.saveState();
    }
  }

  public getCurrentMember(): Member {
    const found = this.state.members.find((m) => m.id === this.state.currentUserId);
    return found || this.state.members[0];
  }

  public dismissCelebration() {
    this.state.celebrationModal = null;
    this.saveState();
  }

  // Action: Gym Check-In
  public checkInMember(memberId: string, method: 'QR Code' | 'NFC' | 'Front Desk' | 'GPS Auto-CheckIn' = 'QR Code'): { success: boolean; xpEarned: number; newStreak: number } {
    const memberIndex = this.state.members.findIndex((m) => m.id === memberId);
    if (memberIndex === -1) return { success: false, xpEarned: 0, newStreak: 0 };

    const member = { ...this.state.members[memberIndex] };
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Compute streak
    const prevStreak = member.currentStreak;
    const newStreak = prevStreak + 1;
    const multiplier = getStreakMultiplier(newStreak);
    const baseCheckInXp = 50;
    const xpEarned = Math.round(baseCheckInXp * multiplier);

    // Update Attendance
    const newRecord = {
      id: `att_${Date.now()}`,
      date: todayStr,
      checkInTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationMinutes: 60,
      gymLocation: 'FitPulse Downtown Club',
      method
    };

    member.attendanceHistory = [newRecord, ...(member.attendanceHistory || [])];
    member.lastVisitDate = todayStr;
    member.daysSinceLastVisit = 0;
    member.weeklyAttendanceCurrent = Math.min(member.weeklyAttendanceGoal, (member.weeklyAttendanceCurrent || 0) + 1);
    member.currentStreak = newStreak;
    if (newStreak > member.bestStreak) {
      member.bestStreak = newStreak;
    }
    member.todayCheckedIn = true;
    member.xp += xpEarned;
    member.weeklyPoints += xpEarned;
    member.monthlyPoints += xpEarned;

    // Check level progression
    const levelInfo = getLevelDetails(member.xp);
    const didLevelUp = levelInfo.level > member.level;
    member.level = levelInfo.level;
    member.levelTitle = levelInfo.levelTitle;
    member.nextLevelXp = levelInfo.nextLevelXp;

    // Re-evaluate Churn Risk (dropping it drastically because they just checked in!)
    member.churnRisk = calculateMemberChurnRisk(member);
    member.status = 'active';

    // Check badge unlocks
    this.evaluateBadges(member);

    // Update member in array
    this.state.members[memberIndex] = member;

    // Trigger Celebration
    if (didLevelUp) {
      this.state.celebrationModal = {
        isOpen: true,
        title: `LEVEL UP! LEVEL ${member.level}`,
        subtitle: `You unlocked the "${member.levelTitle}" title! +${xpEarned} XP added.`,
        type: 'level_up',
        rewardXp: xpEarned,
      };
      triggerConfetti('epic');
    } else {
      this.state.celebrationModal = {
        isOpen: true,
        title: `CHECKED IN! 🔥 STREAK: ${newStreak} DAYS`,
        subtitle: `Welcome back to FitPulse! +${xpEarned} XP (${multiplier}x streak boost applied)`,
        type: 'streak',
        streakCount: newStreak,
        rewardXp: xpEarned
      };
      triggerConfetti('medium');
    }

    // Auto post to community feed for milestone streaks
    if (newStreak === 3 || newStreak === 7 || newStreak === 14 || newStreak === 21 || newStreak === 30) {
      const milestonePost: CommunityPost = {
        id: `post_auto_${Date.now()}`,
        authorId: member.id,
        authorName: member.name,
        authorAvatar: member.avatar,
        authorTier: member.tier,
        authorLevel: member.level,
        type: 'streak_milestone',
        title: `Crushed a ${newStreak}-Day Streak! 🔥`,
        content: `Just checked into FitPulse and extended my active workout streak to ${newStreak} consecutive days!`,
        timestamp: 'Just now',
        stats: { streak: newStreak, xpEarned },
        likes: 1,
        fistBumps: 1,
        fires: 3,
        comments: []
      };
      this.state.communityPosts.unshift(milestonePost);
    }

    // Recalculate leaderboard ranks
    this.recalculateLeaderboard();
    this.saveState();

    return { success: true, xpEarned, newStreak };
  }

  // Action: Log Workout
  public logWorkout(workout: Omit<WorkoutRecord, 'id' | 'timestamp'>): { success: boolean; xpEarned: number } {
    const memberIndex = this.state.members.findIndex((m) => m.id === workout.memberId);
    if (memberIndex === -1) return { success: false, xpEarned: 0 };

    const member = { ...this.state.members[memberIndex] };
    const xpEarned = workout.xpEarned || Math.round(workout.durationMinutes * 3.5 + (workout.caloriesBurned / 4));

    const newWorkout: WorkoutRecord = {
      ...workout,
      id: `w_${Date.now()}`,
      xpEarned,
      timestamp: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    this.state.workouts.unshift(newWorkout);

    member.totalWorkouts = (member.totalWorkouts || 0) + 1;
    member.xp += xpEarned;
    member.weeklyPoints += xpEarned;
    member.monthlyPoints += xpEarned;

    // Level check
    const levelInfo = getLevelDetails(member.xp);
    const didLevelUp = levelInfo.level > member.level;
    member.level = levelInfo.level;
    member.levelTitle = levelInfo.levelTitle;
    member.nextLevelXp = levelInfo.nextLevelXp;

    // Badges check
    this.evaluateBadges(member);

    // Recalculate churn risk
    member.churnRisk = calculateMemberChurnRisk(member);
    this.state.members[memberIndex] = member;

    // Add celebration
    if (didLevelUp) {
      this.state.celebrationModal = {
        isOpen: true,
        title: `LEVEL UP! LEVEL ${member.level}`,
        subtitle: `You unlocked "${member.levelTitle}"! +${xpEarned} Workout XP logged.`,
        type: 'level_up',
        rewardXp: xpEarned
      };
      triggerConfetti('epic');
    } else {
      this.state.celebrationModal = {
        isOpen: true,
        title: `WORKOUT CRUSHED! 💪`,
        subtitle: `Logged ${workout.title} (${workout.durationMinutes}m • ${workout.caloriesBurned} kcal). +${xpEarned} XP!`,
        type: 'checkin',
        rewardXp: xpEarned
      };
      triggerConfetti('medium');
    }

    // Auto post to community feed
    const workoutPost: CommunityPost = {
      id: `post_w_${Date.now()}`,
      authorId: member.id,
      authorName: member.name,
      authorAvatar: member.avatar,
      authorTier: member.tier,
      authorLevel: member.level,
      type: workout.isPersonalRecord ? 'workout_pr' : 'general',
      title: workout.isPersonalRecord ? `🔥 NEW PR: ${workout.title}` : `Completed ${workout.title}`,
      content: `Just wrapped up a ${workout.durationMinutes}-minute ${workout.type} workout burning ${workout.caloriesBurned} calories! ${workout.notes ? `"${workout.notes}"` : ''}`,
      timestamp: 'Just now',
      stats: { workoutType: workout.type, xpEarned },
      likes: 0,
      fistBumps: 0,
      fires: 1,
      comments: []
    };
    this.state.communityPosts.unshift(workoutPost);

    this.recalculateLeaderboard();
    this.saveState();

    return { success: true, xpEarned };
  }

  // Action: Send AI Motivational Outreach / Intervention
  public sendOutreachMessage(memberId: string, message: string, channel: 'SMS' | 'Push' | 'Email' = 'Push', incentiveTitle?: string) {
    const memberIndex = this.state.members.findIndex((m) => m.id === memberId);
    if (memberIndex === -1) return false;

    const member = { ...this.state.members[memberIndex] };

    // Create Notification for the member
    const newNotification: AppNotification = {
      id: `notif_${Date.now()}`,
      recipientId: memberId,
      title: incentiveTitle ? `🎁 ${incentiveTitle}` : `💬 Message from Coach Marcus`,
      message,
      type: 'admin_outreach',
      timestamp: 'Just now',
      read: false,
    };
    this.state.notifications.unshift(newNotification);

    // Provide immediate churn risk alleviation
    if (member.churnRisk) {
      member.churnRisk.score = Math.max(10, member.churnRisk.score - 20);
      if (member.churnRisk.score < 30) member.churnRisk.level = 'low';
      else if (member.churnRisk.score < 55) member.churnRisk.level = 'moderate';
      else member.churnRisk.level = 'high';
      member.churnRisk.rootCause = 'Re-engagement outreach active. Awaiting next gym visit.';
      member.churnRisk.recommendedAction = 'Staff outreach sent. Monitor check-in over next 48h.';
    }

    this.state.members[memberIndex] = member;
    this.saveState();
    return true;
  }

  // Action: Streak Recovery Quest Activation
  public activateRecoveryQuest(memberId: string) {
    const memberIndex = this.state.members.findIndex((m) => m.id === memberId);
    if (memberIndex === -1) return;

    const member = { ...this.state.members[memberIndex] };
    if (!member.activeChallengeIds.includes('chal_recovery_quest')) {
      member.activeChallengeIds.push('chal_recovery_quest');
    }

    this.state.members[memberIndex] = member;

    this.state.notifications.unshift({
      id: `notif_quest_${Date.now()}`,
      recipientId: memberId,
      title: '🛡️ Phoenix Streak Recovery Quest Activated',
      message: 'Complete 3 workouts this week to restore your streak multiplier and earn +300 bonus XP!',
      type: 'challenge',
      timestamp: 'Just now',
      read: false
    });

    this.saveState();
  }

  // Action: Join Challenge
  public joinChallenge(challengeId: string, memberId: string) {
    const chalIndex = this.state.challenges.findIndex((c) => c.id === challengeId);
    const memberIndex = this.state.members.findIndex((m) => m.id === memberId);

    if (chalIndex === -1 || memberIndex === -1) return;

    const challenge = { ...this.state.challenges[chalIndex] };
    const member = { ...this.state.members[memberIndex] };

    if (!challenge.participants.includes(memberId)) {
      challenge.participants.push(memberId);
      challenge.participantCount += 1;
    }

    if (!member.activeChallengeIds.includes(challengeId)) {
      member.activeChallengeIds.push(challengeId);
    }

    this.state.challenges[chalIndex] = challenge;
    this.state.members[memberIndex] = member;
    this.saveState();
  }

  // Action: Complete Challenge
  public completeChallenge(challengeId: string, memberId: string) {
    const chalIndex = this.state.challenges.findIndex((c) => c.id === challengeId);
    const memberIndex = this.state.members.findIndex((m) => m.id === memberId);

    if (chalIndex === -1 || memberIndex === -1) return;

    const challenge = { ...this.state.challenges[chalIndex] };
    const member = { ...this.state.members[memberIndex] };

    if (!challenge.completedMembers.includes(memberId)) {
      challenge.completedMembers.push(memberId);
    }

    member.xp += challenge.rewardXp;
    member.weeklyPoints += challenge.rewardXp;
    member.monthlyPoints += challenge.rewardXp;

    // Check level details
    const levelInfo = getLevelDetails(member.xp);
    member.level = levelInfo.level;
    member.levelTitle = levelInfo.levelTitle;
    member.nextLevelXp = levelInfo.nextLevelXp;

    this.state.challenges[chalIndex] = challenge;
    this.state.members[memberIndex] = member;

    this.state.celebrationModal = {
      isOpen: true,
      title: `CHALLENGE COMPLETED! 🏆`,
      subtitle: `You conquered "${challenge.title}"! Earned +${challenge.rewardXp} XP!`,
      type: 'challenge',
      rewardXp: challenge.rewardXp,
      badgeName: challenge.badgeName
    };
    triggerConfetti('epic');

    this.recalculateLeaderboard();
    this.saveState();
  }

  // Action: Create Challenge (Admin)
  public createChallenge(newChallenge: Omit<Challenge, 'id' | 'participantCount' | 'participants' | 'completedMembers'>) {
    const created: Challenge = {
      ...newChallenge,
      id: `chal_${Date.now()}`,
      participantCount: 0,
      participants: [],
      completedMembers: []
    };
    this.state.challenges.unshift(created);
    this.saveState();
    return created;
  }

  // Action: Toggle Automated Rule
  public toggleAutomatedRule(ruleId: string) {
    const rule = this.state.rules.find((r) => r.id === ruleId);
    if (rule) {
      rule.isActive = !rule.isActive;
      this.saveState();
    }
  }

  // Action: Add Automated Rule
  public addAutomatedRule(rule: Omit<AutomatedRule, 'id' | 'timesTriggered' | 'successRate'>) {
    const created: AutomatedRule = {
      ...rule,
      id: `rule_${Date.now()}`,
      timesTriggered: 0,
      successRate: 70
    };
    this.state.rules.unshift(created);
    this.saveState();
    return created;
  }

  // Action: Post to Community
  public addCommunityPost(content: string, type: CommunityPost['type'] = 'general', title?: string) {
    const member = this.getCurrentMember();
    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      authorId: member.id,
      authorName: member.name,
      authorAvatar: member.avatar,
      authorTier: member.tier,
      authorLevel: member.level,
      type,
      title,
      content,
      timestamp: 'Just now',
      likes: 0,
      fistBumps: 0,
      fires: 0,
      comments: []
    };
    this.state.communityPosts.unshift(newPost);
    this.saveState();
  }

  // Action: React to Community Post
  public reactToPost(postId: string, reactionType: 'like' | 'fistBump' | 'fire') {
    const post = this.state.communityPosts.find((p) => p.id === postId);
    if (!post) return;

    if (reactionType === 'like') {
      if (post.userLiked) {
        post.likes = Math.max(0, post.likes - 1);
        post.userLiked = false;
      } else {
        post.likes += 1;
        post.userLiked = true;
      }
    } else if (reactionType === 'fistBump') {
      if (post.userFistBumped) {
        post.fistBumps = Math.max(0, post.fistBumps - 1);
        post.userFistBumped = false;
      } else {
        post.fistBumps += 1;
        post.userFistBumped = true;
        // Award social XP
        const member = this.getCurrentMember();
        member.xp += 10;
        this.saveState();
      }
    } else if (reactionType === 'fire') {
      if (post.userFired) {
        post.fires = Math.max(0, post.fires - 1);
        post.userFired = false;
      } else {
        post.fires += 1;
        post.userFired = true;
      }
    }

    this.saveState();
  }

  // Action: Add Comment to Community Post
  public addComment(postId: string, text: string) {
    const post = this.state.communityPosts.find((p) => p.id === postId);
    if (!post || !text.trim()) return;

    const currentMember = this.getCurrentMember();
    post.comments.push({
      id: `comm_${Date.now()}`,
      authorName: currentMember.name,
      authorAvatar: currentMember.avatar,
      text: text.trim(),
      timestamp: 'Just now'
    });
    this.saveState();
  }

  // Helper: Badge Evaluation
  private evaluateBadges(member: Member) {
    ALL_BADGES.forEach((badgeDef) => {
      const alreadyHas = member.badges.some((b) => b.id === badgeDef.id);
      if (alreadyHas) return;

      let shouldUnlock = false;
      if (badgeDef.id === 'badge_first_checkin' && member.attendanceHistory.length >= 1) {
        shouldUnlock = true;
      } else if (badgeDef.id === 'badge_streak_3' && member.currentStreak >= 3) {
        shouldUnlock = true;
      } else if (badgeDef.id === 'badge_streak_7' && member.currentStreak >= 7) {
        shouldUnlock = true;
      } else if (badgeDef.id === 'badge_streak_14' && member.currentStreak >= 14) {
        shouldUnlock = true;
      } else if (badgeDef.id === 'badge_streak_30' && member.currentStreak >= 30) {
        shouldUnlock = true;
      } else if (badgeDef.id === 'badge_workouts_10' && member.totalWorkouts >= 10) {
        shouldUnlock = true;
      } else if (badgeDef.id === 'badge_workouts_50' && member.totalWorkouts >= 50) {
        shouldUnlock = true;
      }

      if (shouldUnlock) {
        member.badges.push({
          ...badgeDef,
          unlockedAt: new Date().toISOString().split('T')[0]
        });
        member.xp += badgeDef.xpBonus;

        this.state.celebrationModal = {
          isOpen: true,
          title: `BADGE UNLOCKED! 🎖️`,
          subtitle: `You unlocked "${badgeDef.name}"! +${badgeDef.xpBonus} XP added to your rank!`,
          type: 'badge',
          rewardXp: badgeDef.xpBonus,
          badgeName: badgeDef.name
        };
        triggerConfetti('epic');
      }
    });
  }

  // Helper: Recalculate Leaderboard
  private recalculateLeaderboard() {
    const sorted = [...this.state.members].sort((a, b) => b.weeklyPoints - a.weeklyPoints);
    sorted.forEach((m, idx) => {
      const newRank = idx + 1;
      m.rankChange = m.leaderboardRank ? m.leaderboardRank - newRank : 0;
      m.leaderboardRank = newRank;
    });
  }

  // Reset to default demo data
  public resetToDemoData() {
    this.state = this.loadInitialState();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    this.notify();
  }
}

export const storageService = new StorageService();
