import React, { useState } from 'react';
import { Activity, Shield, User, Bell, Flame, ChevronDown, RefreshCw, QrCode, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import { storageService, FitPulseState } from '../services/storageService';
import { UserRole } from '../types';

interface NavbarProps {
  state: FitPulseState;
  onOpenCheckIn: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ state, onOpenCheckIn }) => {
  const [showMemberMenu, setShowMemberMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const currentMember = state.members.find((m) => m.id === state.currentUserId) || state.members[0];
  const unreadNotifs = state.notifications.filter((n) => !n.read);

  const handleRoleChange = (role: UserRole) => {
    storageService.setRole(role);
  };

  const handleSelectMember = (memberId: string) => {
    storageService.setCurrentUser(memberId);
    setShowMemberMenu(false);
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#090D16]/90 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            <Activity className="w-6 h-6 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-white tracking-tight font-display">
                Fit<span className="text-emerald-400">Pulse</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                Retention OS
              </span>
            </div>
            <div className="text-[10px] text-slate-400 hidden sm:block">
              {state.currentRole === 'admin' ? 'Club Management & AI Churn Shield' : 'Member Gamification & Streak Zone'}
            </div>
          </div>
        </div>

        {/* Role Toggle Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800">
          <button
            id="tab-role-admin"
            onClick={() => handleRoleChange('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              state.currentRole === 'admin'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Gym Owner / Admin</span>
          </button>

          <button
            id="tab-role-member"
            onClick={() => handleRoleChange('member')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              state.currentRole === 'member'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Gym Member</span>
          </button>
        </div>

        {/* Actions & User Impersonation */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Check-In Button */}
          <button
            id="btn-quick-checkin"
            onClick={onOpenCheckIn}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all cursor-pointer active:scale-95"
            title="Fast Check-in"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Check In</span>
          </button>

          {/* Member Demo Impersonator Dropdown */}
          <div className="relative">
            <button
              id="btn-member-picker"
              onClick={() => {
                setShowMemberMenu(!showMemberMenu);
                setShowNotifMenu(false);
              }}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition-all cursor-pointer"
            >
              {state.currentRole === 'admin' ? (
                <>
                  <img
                    src={state.adminProfile.avatar}
                    alt={state.adminProfile.name}
                    className="w-6 h-6 rounded-lg object-cover border border-emerald-500/40"
                  />
                  <span className="font-semibold hidden lg:inline">{state.adminProfile.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold hidden sm:inline">
                    ADMIN
                  </span>
                </>
              ) : (
                <>
                  <img
                    src={currentMember.avatar}
                    alt={currentMember.name}
                    className="w-6 h-6 rounded-lg object-cover border border-emerald-500/40"
                  />
                  <div className="text-left hidden lg:block">
                    <span className="font-semibold block leading-tight">{currentMember.name}</span>
                    <span className="text-[10px] text-amber-400 flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5 fill-amber-400" />
                      {currentMember.currentStreak}d • Lvl {currentMember.level}
                    </span>
                  </div>
                </>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {showMemberMenu && (
              <div className="absolute right-0 mt-2 w-72 p-2 rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  Switch Demo Member State
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1 py-1">
                  {state.members.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleSelectMember(m.id)}
                      className={`w-full p-2 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer ${
                        state.currentUserId === m.id
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-white'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            {m.name}
                            {state.currentUserId === m.id && <Check className="w-3 h-3 text-emerald-400" />}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {m.currentStreak > 0 ? (
                              <span className="text-amber-400">🔥 {m.currentStreak}d Streak</span>
                            ) : (
                              <span className="text-rose-400">⚠️ {m.daysSinceLastVisit}d Inactive</span>
                            )}
                            {' • '}
                            <span>{m.churnRisk.level.toUpperCase()} RISK</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between">
                  <button
                    onClick={() => {
                      storageService.resetToDemoData();
                      setShowMemberMenu(false);
                    }}
                    className="w-full py-1.5 text-center text-xs text-slate-400 hover:text-rose-400 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reset Demo Data
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Center */}
          <div className="relative">
            <button
              id="btn-notifications"
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowMemberMenu(false);
              }}
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 p-3 rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white">Live Activity & Alerts</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">{state.notifications.length} alerts</span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {state.notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-left space-y-1"
                    >
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span>{notif.title}</span>
                        <span className="text-[10px] text-slate-500">{notif.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
