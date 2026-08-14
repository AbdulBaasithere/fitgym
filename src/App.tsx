import React, { useState, useEffect } from 'react';
import { storageService } from './services/storageService';
import { FitPulseState, Member } from './types';
import { Navbar } from './components/Navbar';
import { AdminOverview } from './components/admin/AdminOverview';
import { AtRiskTable } from './components/admin/AtRiskTable';
import { AutomatedRulesView } from './components/admin/AutomatedRulesView';
import { GymAnalyticsView } from './components/admin/GymAnalyticsView';
import { MembersDirectory } from './components/admin/MembersDirectory';
import { MemberOverview } from './components/member/MemberOverview';
import { LeaderboardView } from './components/member/LeaderboardView';
import { MemberChallengesView } from './components/member/MemberChallengesView';
import { BadgesCabinetView } from './components/member/BadgesCabinetView';
import { CommunityFeedView } from './components/member/CommunityFeedView';
import { CheckInModal } from './components/member/CheckInModal';
import { LogWorkoutModal } from './components/member/LogWorkoutModal';
import { AIOutreachModal } from './components/shared/AIOutreachModal';
import { CelebrationOverlay } from './components/shared/CelebrationOverlay';

export function App() {
  const [state, setState] = useState<FitPulseState>(storageService.getState());
  const [activeAdminTab, setActiveAdminTab] = useState<string>('overview');
  const [activeMemberTab, setActiveMemberTab] = useState<string>('overview');

  // Modal states
  const [showCheckInModal, setShowCheckInModal] = useState<boolean>(false);
  const [showLogWorkoutModal, setShowLogWorkoutModal] = useState<boolean>(false);
  const [outreachTargetMember, setOutreachTargetMember] = useState<Member | null>(null);

  // Subscribe to storage updates
  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setState({ ...storageService.getState() });
    });
    return unsubscribe;
  }, []);

  const currentMember = state.members.find((m) => m.id === state.currentUserId) || state.members[0];

  return (
    <div className="min-h-screen bg-[#070D18] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        state={state}
        activeTab={state.currentRole === 'admin' ? activeAdminTab : activeMemberTab}
        onTabChange={(tab) => {
          if (state.currentRole === 'admin') {
            setActiveAdminTab(tab);
          } else {
            setActiveMemberTab(tab);
          }
        }}
        onOpenCheckIn={() => setShowCheckInModal(true)}
        onOpenLogWorkout={() => setShowLogWorkoutModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {state.currentRole === 'admin' ? (
          /* ================= ADMIN VIEW ================= */
          <div className="space-y-6">
            {activeAdminTab === 'overview' && (
              <AdminOverview
                members={state.members}
                gymStats={state.gymStats}
                onNavigateToTab={(t) => setActiveAdminTab(t)}
                onSelectMemberForOutreach={(m) => setOutreachTargetMember(m)}
              />
            )}

            {activeAdminTab === 'at-risk' && (
              <AtRiskTable
                members={state.members}
                onSelectMemberForOutreach={(m) => setOutreachTargetMember(m)}
              />
            )}

            {activeAdminTab === 'rules' && (
              <AutomatedRulesView rules={state.rules} />
            )}

            {activeAdminTab === 'analytics' && (
              <GymAnalyticsView members={state.members} gymStats={state.gymStats} />
            )}

            {activeAdminTab === 'members' && (
              <MembersDirectory
                members={state.members}
                onSelectMemberForOutreach={(m) => setOutreachTargetMember(m)}
              />
            )}
          </div>
        ) : (
          /* ================= MEMBER VIEW ================= */
          <div className="space-y-6">
            {activeMemberTab === 'overview' && (
              <MemberOverview
                member={currentMember}
                challenges={state.challenges}
                onOpenCheckIn={() => setShowCheckInModal(true)}
                onOpenLogWorkout={() => setShowLogWorkoutModal(true)}
                onNavigateToTab={(t) => setActiveMemberTab(t)}
              />
            )}

            {activeMemberTab === 'leaderboard' && (
              <LeaderboardView
                members={state.members}
                currentUserId={currentMember.id}
              />
            )}

            {activeMemberTab === 'challenges' && (
              <MemberChallengesView
                challenges={state.challenges}
                member={currentMember}
              />
            )}

            {activeMemberTab === 'badges' && (
              <BadgesCabinetView member={currentMember} />
            )}

            {activeMemberTab === 'community' && (
              <CommunityFeedView
                posts={state.communityPosts}
                currentMember={currentMember}
              />
            )}
          </div>
        )}
      </main>

      {/* Modals & Overlays */}
      <CheckInModal
        isOpen={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
        member={currentMember}
      />

      <LogWorkoutModal
        isOpen={showLogWorkoutModal}
        onClose={() => setShowLogWorkoutModal(false)}
        member={currentMember}
      />

      {outreachTargetMember && (
        <AIOutreachModal
          isOpen={!!outreachTargetMember}
          onClose={() => setOutreachTargetMember(null)}
          member={outreachTargetMember}
        />
      )}

      <CelebrationOverlay
        modal={state.celebrationModal}
      />
    </div>
  );
}

export default App;
