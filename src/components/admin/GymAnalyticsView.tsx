import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts';
import { TrendingUp, Users, AlertTriangle, Calendar, Flame, Activity, CheckCircle2 } from 'lucide-react';
import { Member, GymStats } from '../../types';

interface GymAnalyticsViewProps {
  members: Member[];
  gymStats: GymStats;
}

export const GymAnalyticsView: React.FC<GymAnalyticsViewProps> = ({ members, gymStats }) => {
  // Chart 1: Daily Attendance Trends (Past 14 Days)
  const attendanceData = [
    { day: 'Aug 1', visits: 132, avgTime: 58 },
    { day: 'Aug 2', visits: 145, avgTime: 62 },
    { day: 'Aug 3', visits: 110, avgTime: 55 },
    { day: 'Aug 4', visits: 95, avgTime: 48 },
    { day: 'Aug 5', visits: 142, avgTime: 60 },
    { day: 'Aug 6', visits: 158, avgTime: 65 },
    { day: 'Aug 7', visits: 164, avgTime: 64 },
    { day: 'Aug 8', visits: 150, avgTime: 59 },
    { day: 'Aug 9', visits: 118, avgTime: 52 },
    { day: 'Aug 10', visits: 90, avgTime: 45 },
    { day: 'Aug 11', visits: 162, avgTime: 61 },
    { day: 'Aug 12', visits: 175, avgTime: 66 },
    { day: 'Aug 13', visits: 168, avgTime: 63 },
    { day: 'Aug 14', visits: 182, avgTime: 65 },
  ];

  // Chart 2: Retention by Join Month
  const retentionByMonthData = [
    { month: 'Feb 2026', rate: 94, newMembers: 32 },
    { month: 'Mar 2026', rate: 91, newMembers: 40 },
    { month: 'Apr 2026', rate: 89, newMembers: 38 },
    { month: 'May 2026', rate: 86, newMembers: 45 },
    { month: 'Jun 2026', rate: 88, newMembers: 50 },
    { month: 'Jul 2026', rate: 92, newMembers: 48 },
    { month: 'Aug 2026 (MTD)', rate: 95, newMembers: 24 },
  ];

  // Chart 3: Churn Risk Tier Distribution
  const criticalCount = members.filter((m) => m.churnRisk.level === 'critical').length;
  const highCount = members.filter((m) => m.churnRisk.level === 'high').length;
  const moderateCount = members.filter((m) => m.churnRisk.level === 'moderate').length;
  const lowCount = members.filter((m) => m.churnRisk.level === 'low').length;

  const churnPieData = [
    { name: 'Low Risk', value: lowCount, color: '#10B981' },
    { name: 'Moderate Risk', value: moderateCount, color: '#FACC15' },
    { name: 'High Risk', value: highCount, color: '#F59E0B' },
    { name: 'Critical Ghost', value: criticalCount, color: '#F43F5E' },
  ];

  // Chart 4: Peak Hours Breakdown
  const peakHoursData = [
    { time: '6 AM', count: 48 },
    { time: '8 AM', count: 32 },
    { time: '10 AM', count: 18 },
    { time: '12 PM', count: 35 },
    { time: '2 PM', count: 20 },
    { time: '5 PM', count: 65 },
    { time: '7 PM', count: 58 },
    { time: '9 PM', count: 24 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5">
          <span>Gym Analytics & Retention Metrics</span>
        </h2>
        <p className="text-xs text-slate-400">
          Holistic view of gym traffic, member adherence patterns, churn hazard rates, and peak usage hours
        </p>
      </div>

      {/* Row 1: Attendance Volume Chart */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Daily Check-In Attendance Velocity</span>
            </h3>
            <p className="text-xs text-slate-400">Total gym visits per day across turnstiles and app check-ins</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Peak Day: </span>
            <span className="text-xs font-bold text-emerald-400">Aug 14 (182 check-ins)</span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={attendanceData}>
              <defs>
                <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#f8fafc'
                }}
              />
              <Area type="monotone" dataKey="visits" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#attendanceGrad)" name="Check-ins" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Churn Distribution & Cohort Retention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Churn Risk Distribution Donut */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Current Member Churn Risk Distribution</span>
            </h3>
            <p className="text-xs text-slate-400">Algorithmic risk breakdown based on recency and streak stability</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={churnPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {churnPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#f8fafc'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
            {churnPieData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 font-medium">{item.name}:</span>
                <span className="text-white font-mono font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Retention Rate by Cohort */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Cohort Retention % by Join Month</span>
            </h3>
            <p className="text-xs text-slate-400">Percentage of members still active after initial 30 days</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={retentionByMonthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis domain={[70, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#f8fafc'
                  }}
                />
                <Bar dataKey="rate" fill="#06B6D4" radius={[6, 6, 0, 0]} name="Retention Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
            <span>Industry Gym Avg: <strong className="text-slate-300">72%</strong></span>
            <span>FitPulse Gamification Avg: <strong className="text-emerald-400">89.2% (+17.2%)</strong></span>
          </div>
        </div>
      </div>

      {/* Row 3: Peak Gym Load Distribution */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Facility Peak Hours & Capacity Heatmap</span>
          </h3>
          <p className="text-xs text-slate-400">Peak visitor influx times to optimize trainer availability & automated reminders</p>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={peakHoursData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#f8fafc'
                }}
              />
              <Bar dataKey="count" fill="#F59E0B" radius={[6, 6, 0, 0]} name="Active Visitors" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
