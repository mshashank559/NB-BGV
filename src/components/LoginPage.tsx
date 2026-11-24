import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, KeyRound } from 'lucide-react';
import { CloudShader } from './ui/cloud-shader';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  // Splash intro state: starts with splash logo, then fades in the login box
  const [introState, setIntroState] = useState<'splash' | 'ready'>('splash');
  const [email, setEmail] = useState('bgv@netbounceplacement.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 1.1s splash screen, then glide into the transparent login box
    const timer = setTimeout(() => {
      setIntroState('ready');
    }, 1100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check credentials: hr email & pass BGV@123
    const isHrEmail =
      cleanEmail === 'bgv@netbounceplacement.com' ||
      cleanEmail === 'hr@netbounceplacement.com';

    if (isHrEmail && cleanPass === 'BGV@123') {
      setIsLoading(true);
      setTimeout(() => {
        onLoginSuccess();
      }, 400);
    } else {
      setErrorMessage('Invalid credentials. Use official HR email and password (BGV@123).');
    }
  };

  const autofillCredentials = () => {
    setEmail('bgv@netbounceplacement.com');
    setPassword('BGV@123');
    setErrorMessage(null);
  };

  return (
    <div className="relative min-h-screen w-full font-sans text-white overflow-hidden flex items-center justify-center selection:bg-blue-500/30">
      {/* 1. Dynamic Blue Sky & Cloud Shader Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <CloudShader
          className="w-full h-full"
          speed={0.85}
          count={6}
          cloudColor="#fbf8f2"
          skyTopColor="#3876ba"
          skyBottomColor="#8cbfe8"
        />
      </div>

      {/* 2. Splash Screen: Center Logo Only (No Background Card or Text) */}
      <AnimatePresence>
        {introState === 'splash' && (
          <motion.div
            key="splash-logo"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1.12 }}
            exit={{ opacity: 0, scale: 1.05, y: -15 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
          >
            <img
              src="/netbounce-logo.png"
              alt="NETBOUNCE PLACEMENT LLC"
              className="h-20 sm:h-24 md:h-28 w-auto object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.45)]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main Transparent Light Glass Login Box */}
      {introState === 'ready' && (
        <motion.div
          key="login-card"
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 w-full max-w-md mx-4 p-6 sm:p-8 rounded-3xl backdrop-blur-2xl bg-slate-900/40 border border-white/25 shadow-[0_25px_60px_rgba(15,23,42,0.35),inset_0_1px_2px_rgba(255,255,255,0.25)] overflow-hidden"
        >
          {/* Top Brand Logo inside Card */}
          <div className="flex flex-col items-center text-center mb-6">
            <img
              src="/netbounce-logo.png"
              alt="NETBOUNCE PLACEMENT LLC"
              className="h-12 sm:h-14 w-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] mb-3 transition-transform hover:scale-102"
            />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sky-300 border border-white/15 text-[10.5px] font-extrabold uppercase tracking-wider backdrop-blur-md mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              HR Operations Access
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white drop-shadow-sm">
              BGV Portal Sign In
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Enter your credentials to access executive verifications
            </p>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-start gap-2.5 text-rose-200 text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Official HR Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="bgv@netbounceplacement.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-white focus:bg-white/15 transition-all backdrop-blur-md"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={autofillCredentials}
                  className="text-[10.5px] font-bold text-sky-300 hover:text-sky-200 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <KeyRound className="w-3 h-3" />
                  Auto-fill Demo Pass
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter BGV password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-white focus:bg-white/15 transition-all backdrop-blur-md font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white text-xs font-black shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 disabled:opacity-75"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to BGV Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Security Badge */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <p className="text-[11px] text-slate-400">
              Protected by 256-bit SSL encryption & SOC-2 compliance
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
