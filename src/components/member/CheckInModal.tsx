import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, Smartphone, MapPin, CheckCircle2, Flame, Sparkles, X, ShieldCheck } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { Member } from '../../types';

interface CheckInModalProps {
  member: Member;
  isOpen: boolean;
  onClose: () => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({ member, isOpen, onClose }) => {
  const [method, setMethod] = useState<'QR Code' | 'NFC' | 'GPS Auto-CheckIn'>('QR Code');
  const [isScanning, setIsScanning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [xpResult, setXpResult] = useState<number>(0);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const res = storageService.checkInMember(member.id, method);
      if (res.success) {
        setXpResult(res.xpEarned);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1400);
      }
    }, 1100);
  };

  return (
    <AnimatePresence>
      <div id="checkin-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="relative w-full max-w-md bg-[#0F172A] border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-center overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 text-left">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Gym Turnstile Check-In</h3>
                <p className="text-xs text-slate-400">FitPulse Downtown Club</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Member Card preview */}
          <div className="my-6 p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/90 flex items-center justify-between">
            <div className="flex items-center gap-3 text-left">
              <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
              <div>
                <div className="text-sm font-bold text-white">{member.name}</div>
                <div className="text-xs text-emerald-400 font-semibold">{member.tier} Membership</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Streak</div>
              <div className="text-sm font-black text-amber-400 flex items-center gap-1">
                <Flame className="w-4 h-4 fill-amber-400" />
                {member.currentStreak} Days
              </div>
            </div>
          </div>

          {/* Method selector */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { id: 'QR Code', label: 'QR Scanner', icon: QrCode },
              { id: 'NFC', label: 'Tap NFC', icon: Smartphone },
              { id: 'GPS Auto-CheckIn', label: 'Gym Geo-Beacon', icon: MapPin },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMethod(item.id as any)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    method === item.id
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-sm'
                      : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mx-auto mb-1.5" />
                  <div className="text-[11px] font-bold">{item.label}</div>
                </button>
              );
            })}
          </div>

          {/* Scanner Simulation Stage */}
          <div className="relative my-6 h-48 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center overflow-hidden">
            {isScanning ? (
              <div className="space-y-3">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400 animate-ping opacity-75" />
                  <div className="relative w-20 h-20 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center">
                    <QrCode className="w-10 h-10 text-emerald-400 animate-pulse" />
                  </div>
                </div>
                <div className="text-xs font-bold text-emerald-400 tracking-wide uppercase">
                  Verifying Turnstile Access...
                </div>
              </div>
            ) : success ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-2"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="text-base font-bold text-white">Access Granted!</div>
                <div className="text-xs text-emerald-400 font-mono">+{xpResult} XP & Streak Extended</div>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <QrCode className="w-10 h-10" />
                </div>
                <div className="text-xs text-slate-400">
                  Scan turnstile QR or tap phone at gym entrance
                </div>
              </div>
            )}
          </div>

          {/* Action button */}
          <button
            id="btn-trigger-checkin"
            type="button"
            onClick={handleSimulateScan}
            disabled={isScanning || success}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Simulate Check-In at Front Desk</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
