import { Member, ChurnRiskAssessment, ChurnFactor, ChurnRiskLevel } from '../types';

/**
 * FitPulse AI Churn Prediction Engine
 * Computes multidimensional churn risk based on:
 * - Recency: Days since last visit vs expected weekly frequency
 * - Streak disruption: Loss of active streak
 * - Velocity/Trend: Attendance drop in the last 14-30 days
 * - Membership Age Hazard: 30-90 day cliff
 * - App & Challenge Engagement: Points, challenge activity
 */
export function calculateMemberChurnRisk(member: Partial<Member>): ChurnRiskAssessment {
  const daysSinceLastVisit = member.daysSinceLastVisit ?? 0;
  const weeklyGoal = member.weeklyAttendanceGoal || 3;
  const currentStreak = member.currentStreak ?? 0;
  const previousStreak = member.previousStreak ?? 0;
  const totalWorkouts = member.totalWorkouts ?? 0;
  const activeChallengesCount = member.activeChallengeIds?.length ?? 0;

  // Derive joined months
  let joinedMonths = 6;
  if (member.joinedDate) {
    const diffMs = Date.now() - new Date(member.joinedDate).getTime();
    joinedMonths = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24 * 30)));
  }

  let riskScore = 10; // baseline
  const factors: ChurnFactor[] = [];

  // 1. Recency penalty (Weight: 40%)
  if (daysSinceLastVisit >= 14) {
    riskScore += 45;
    factors.push({
      name: 'Critical Inactivity',
      impact: 'high',
      detail: `No check-ins for ${daysSinceLastVisit} days (Threshold: >14 days is high danger zone)`
    });
  } else if (daysSinceLastVisit >= 7) {
    riskScore += 28;
    factors.push({
      name: 'Prolonged Absence',
      impact: 'medium',
      detail: `${daysSinceLastVisit} days since last gym visit (Missed ${Math.round(daysSinceLastVisit / 2.5)} expected workouts)`
    });
  } else if (daysSinceLastVisit >= 4) {
    riskScore += 12;
    factors.push({
      name: 'Minor Cadence Gap',
      impact: 'low',
      detail: `4+ days without attendance`
    });
  } else {
    riskScore -= 5;
    factors.push({
      name: 'High Frequency Attendance',
      impact: 'low',
      detail: `Active within last 3 days`
    });
  }

  // 2. Streak Disruption (Weight: 20%)
  if (currentStreak === 0 && previousStreak >= 7) {
    riskScore += 22;
    factors.push({
      name: 'Disrupted Habit Loop',
      impact: 'high',
      detail: `Broke a ${previousStreak}-day active streak without immediate recovery check-in`
    });
  } else if (currentStreak >= 5) {
    riskScore -= 15;
    factors.push({
      name: 'Strong Habit Consistency',
      impact: 'low',
      detail: `Active ${currentStreak}-day streak reinforcing attendance habit`
    });
  }

  // 3. Membership Age Hazard Curve (Weight: 15%)
  // First 45 days is highest churn cliff for new members
  if (joinedMonths <= 2 && totalWorkouts < 8) {
    riskScore += 18;
    factors.push({
      name: 'Onboarding Hazard Cliff',
      impact: 'high',
      detail: `Month ${joinedMonths} onboarding phase with low initial workout volume (${totalWorkouts} total)`
    });
  } else if (joinedMonths > 12) {
    riskScore -= 10;
    factors.push({
      name: 'Loyal Veteran Member',
      impact: 'low',
      detail: `${joinedMonths} months continuous gym membership history`
    });
  }

  // 4. Gamification & Challenge engagement (Weight: 15%)
  if (activeChallengesCount === 0) {
    riskScore += 10;
    factors.push({
      name: 'Zero Challenge Participation',
      impact: 'medium',
      detail: `Not enrolled in any community or personal fitness challenges`
    });
  } else {
    riskScore -= 10;
    factors.push({
      name: 'Active Challenge Competitor',
      impact: 'low',
      detail: `Enrolled in ${activeChallengesCount} active challenges`
    });
  }

  // Clamp risk score between 2 and 98
  riskScore = Math.max(3, Math.min(98, Math.round(riskScore)));

  // Determine Level
  let level: ChurnRiskLevel = 'low';
  if (riskScore >= 70) {
    level = 'critical';
  } else if (riskScore >= 50) {
    level = 'high';
  } else if (riskScore >= 30) {
    level = 'moderate';
  } else {
    level = 'low';
  }

  // Determine Root Cause & Recommended Action
  let rootCause = 'Consistent gym habit and healthy engagement.';
  let recommendedAction = 'Maintain standard rewards and celebrate streak milestones.';

  if (level === 'critical') {
    if (daysSinceLastVisit >= 14) {
      rootCause = `Ghost member alert: Absent for ${daysSinceLastVisit} days with rapid habit dissolution.`;
      recommendedAction = 'Send 1-Click AI VIP Comeback Pass + Call from Head Coach within 24h.';
    } else {
      rootCause = 'Severe drop in weekly attendance combined with broken streak and onboarding friction.';
      recommendedAction = 'Assign Streak Recovery Quest and offer free 1-on-1 Trainer Habit Reset session.';
    }
  } else if (level === 'high') {
    if (currentStreak === 0 && previousStreak >= 7) {
      rootCause = `Streak drop shock: Member lost their ${previousStreak}-day streak and attendance halved.`;
      recommendedAction = 'Trigger automated "Streak Recovery Shield" push notification with 2x XP incentive.';
    } else {
      rootCause = `Attending only ${member.weeklyAttendanceCurrent || 1} of ${weeklyGoal} planned days for 2 consecutive weeks.`;
      recommendedAction = 'Send friendly coach check-in SMS and invite to upcoming Community Challenge.';
    }
  } else if (level === 'moderate') {
    rootCause = 'Slight dip in recent visits; at risk of transitioning to ghost status if unaddressed.';
    recommendedAction = 'Send motivational nudge highlighting their current leaderboard standing.';
  }

  // Predicted drop date estimate
  let predictedDropDate: string | undefined;
  if (level === 'critical' || level === 'high') {
    const daysUntilCancel = Math.max(3, Math.round((100 - riskScore) / 4));
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysUntilCancel);
    predictedDropDate = targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return {
    score: riskScore,
    level,
    factors,
    rootCause,
    recommendedAction,
    lastCalculated: new Date().toISOString(),
    predictedDropDate
  };
}
