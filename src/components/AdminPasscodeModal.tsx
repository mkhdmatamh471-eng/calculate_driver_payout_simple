import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, X, ShieldCheck, Clock, LogOut } from 'lucide-react';

const ADMIN_SESSION_KEY = 'yemen_dental_admin_session';
const ONE_HOUR_MS = 60 * 60 * 1000; // 1 hour session expiry

export interface AdminSessionData {
  authenticated: boolean;
  expiry: number;
  loggedInAt: number;
}

/**
  * Checks whether the admin session in localStorage is valid and not expired.
  */
export const isAdminSessionValid = (): boolean => {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return false;
    const session: AdminSessionData = JSON.parse(raw);
    if (session && session.authenticated && typeof session.expiry === 'number') {
      if (Date.now() < session.expiry) {
        return true;
      }
    }
    // Session expired or corrupted
    localStorage.removeItem(ADMIN_SESSION_KEY);
    return false;
  } catch (err) {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    return false;
  }
};

/**
  * Saves an active admin session to localStorage valid for 1 hour.
  */
export const saveAdminSession = (): void => {
  try {
    const session: AdminSessionData = {
      authenticated: true,
      loggedInAt: Date.now(),
      expiry: Date.now() + ONE_HOUR_MS,
    };
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save admin session to localStorage:', err);
  }
};

/**
  * Clears the admin session from localStorage.
  */
export const clearAdminSession = (): void => {
  try {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  } catch (err) {
    console.error('Failed to clear admin session from localStorage:', err);
  }
};

/**
  * Returns the remaining session time in minutes.
  */
export const getAdminRemainingMinutes = (): number => {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return 0;
    const session: AdminSessionData = JSON.parse(raw);
    const remainingMs = session.expiry - Date.now();
    if (remainingMs <= 0) return 0;
    return Math.ceil(remainingMs / (1000 * 60));
  } catch {
    return 0;
  }
};

interface AdminPasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPasscodeModal: React.FC<AdminPasscodeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [activeSessionMinutes, setActiveSessionMinutes] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      if (isAdminSessionValid()) {
        setError('');
        setActiveSessionMinutes(getAdminRemainingMinutes());
        // Automatically grant access if session is still valid within 1 hour
        onSuccess();
      } else {
        setActiveSessionMinutes(0);
      }
    }
  }, [isOpen, onSuccess]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode === '123456' || passcode === 'admin') {
      setError('');
      saveAdminSession();
      onSuccess();
    } else {
      setError('كلمة المرور غير صحيحة. جرب: admin123');
    }
  };

  const handleLogoutSession = () => {
    clearAdminSession();
    setActiveSessionMinutes(0);
    setPasscode('');
    setError('تم تسجيل الخروج وإلغاء الجلسة بنجاح.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-sm w-full p-6 text-right relative border border-slate-200 medical-shadow"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-3xl bg-sky-100 text-sky-700 flex items-center justify-center shadow-md">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-lg">دخول لوحة تحكم الإدارة</h3>
            <p className="text-xs text-slate-500 mt-1">أدخل كلمة مرور صاحب المتجر للوصول للإحصائيات والمنتجات</p>
          </div>
        </div>

        {/* 1-Hour Session Expiry Badge Notice */}
        <div className="mt-4 p-3 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-2 text-right">
          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-[11px] text-amber-900 leading-snug">
            <span className="font-bold block mb-0.5">أمان الجلسة (Session Expiry):</span>
            يتم حفظ تسجيل الدخول في المتصفح لمدة <strong className="text-amber-700">1 ساعة واحدة فقط</strong>، وبعد انقضائها يلزم إدخال الرمز مجدداً.
          </div>
        </div>

        {activeSessionMinutes > 0 && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>جلسة نشطة (متبقي {activeSessionMinutes} دقيقة)</span>
            </div>
            <button
              onClick={handleLogoutSession}
              className="text-[10px] text-rose-600 font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>إنهاء الجلسة</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="relative">
            <input
              type="password"
              placeholder="رمز المرور (جرب: admin123)"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full text-xs p-3 pr-9 border border-slate-200 rounded-2xl outline-none focus:border-sky-500 font-mono text-center tracking-widest"
              autoFocus
            />
            <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>

          {error && <p className="text-[11px] text-rose-600 font-bold text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer"
          >
            دخول اللوحة
          </button>
        </form>
      </div>
    </div>
  );
};

