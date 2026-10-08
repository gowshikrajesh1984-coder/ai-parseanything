import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  FileCheck2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ParseLogo } from '../common/ParseLogo';

export const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('sarah.jenkins@acmecorp.ai');
  const [password, setPassword] = useState('Password@2025');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Inline validation errors
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Success state transition
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    let valid = true;

    // Email validation
    if (!email.trim()) {
      setEmailError('Email is required.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email address.');
      valid = false;
    } else {
      setEmailError(null);
    }

    // Password validation
    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must contain at least 8 characters.');
      valid = false;
    } else {
      setPasswordError(null);
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validate()) {
      return;
    }

    const res = await login(email, password, rememberMe);
    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/documents');
      }, 750);
    } else {
      setFormError(res.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F9F2] flex items-center justify-center p-4 sm:p-6 lg:p-10 text-[#29452B]">
      <div className="w-full max-w-5xl bg-white rounded-[32px] border border-[#DCE8D4] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        
        {/* ================= LEFT SIDE: BRAND / VISUAL SECTION ================= */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#EAF4E2] via-[#F0F6E9] to-[#DCE8D4] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#DCE8D4]">
          {/* Subtle background decoration waves / curves */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#A8D584]/20 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-[#4D9857]/15 blur-2xl pointer-events-none" />

          {/* Top: Logo Brand */}
          <div className="relative z-10">
            <ParseLogo size="lg" tagline="Document Intelligence" interactive={false} />
          </div>

          {/* Center: Headline & Supporting Text & Abstract Document Graphic */}
          <div className="relative z-10 my-8 sm:my-10 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#DCE8D4] text-xs font-bold text-[#29452B] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#4D9857]" />
                <span>Next-Gen AI Extraction</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#29452B] tracking-tight leading-tight">
                Turn documents into structured data with AI.
              </h1>
              <p className="text-sm text-[#788773] leading-relaxed">
                Upload, extract, validate and review your documents securely with intelligent document processing.
              </p>
            </div>

            {/* Subtle Document/AI Abstract Illustration */}
            <div className="p-4 rounded-2xl bg-white/70 border border-[#DCE8D4] backdrop-blur-xs space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-semibold text-[#29452B]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#A8D584] text-[#29452B] flex items-center justify-center">
                    <FileCheck2 className="w-3.5 h-3.5" />
                  </div>
                  <span>High-Fidelity Neural Parser</span>
                </div>
                <span className="text-[11px] font-bold text-[#4D9857] bg-[#EAF4E2] px-2 py-0.5 rounded-full">
                  92.4% Avg. Confidence
                </span>
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="h-2 w-full bg-[#DCE8D4]/60 rounded-full overflow-hidden">
                  <div className="h-full bg-[#A8D584] rounded-full w-4/5" />
                </div>
                <div className="flex justify-between text-[10px] text-[#788773]">
                  <span>Tables • Text • Figures • Math</span>
                  <span>Zero Hallucination</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Assurance */}
          <div className="relative z-10 pt-4 border-t border-[#DCE8D4]/80 flex items-center gap-2 text-xs text-[#788773]">
            <ShieldCheck className="w-4 h-4 text-[#4D9857] shrink-0" />
            <span>Secure client validation & minimal data retention</span>
          </div>
        </div>

        {/* ================= RIGHT SIDE: CENTERED LOGIN CARD ================= */}
        <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-white relative">
          <div className="max-w-md mx-auto w-full space-y-7">
            {/* Header */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#29452B] tracking-tight">
                Welcome back
              </h2>
              <p className="text-sm text-[#788773] mt-1">
                Sign in to continue to ParseAnything.
              </p>
            </div>

            {/* Global Form Error Banner */}
            {formError && (
              <div className="p-3.5 rounded-2xl bg-[#FDE8E8] border border-[#E76F6F]/40 text-[#E76F6F] text-xs font-semibold flex items-center gap-2">
                <span>⚠ {formError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email-input"
                  className="block text-xs font-bold text-[#29452B] uppercase tracking-wider"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#788773] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError(null);
                    }}
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F6F9F2] border text-sm font-medium text-[#29452B] placeholder-[#95A590] focus:outline-none transition-all ${
                      emailError
                        ? 'border-[#E76F6F] focus:ring-2 focus:ring-[#E76F6F]/20'
                        : 'border-[#DCE8D4] focus:border-[#729C56] focus:ring-2 focus:ring-[#A8D584]/30'
                    }`}
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={emailError ? 'email-error' : undefined}
                  />
                </div>
                {emailError && (
                  <p id="email-error" className="text-xs text-[#E76F6F] font-semibold pl-1">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password-input"
                  className="block text-xs font-bold text-[#29452B] uppercase tracking-wider"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#788773] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError(null);
                    }}
                    placeholder="Enter your password"
                    className={`w-full pl-10 pr-11 py-3 rounded-2xl bg-[#F6F9F2] border text-sm font-medium text-[#29452B] placeholder-[#95A590] focus:outline-none transition-all ${
                      passwordError
                        ? 'border-[#E76F6F] focus:ring-2 focus:ring-[#E76F6F]/20'
                        : 'border-[#DCE8D4] focus:border-[#729C56] focus:ring-2 focus:ring-[#A8D584]/30'
                    }`}
                    aria-invalid={Boolean(passwordError)}
                    aria-describedby={passwordError ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#788773] hover:text-[#29452B] p-1 rounded-lg transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p id="password-error" className="text-xs text-[#E76F6F] font-semibold pl-1">
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-[#29452B] font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#4D9857] border-[#DCE8D4] focus:ring-[#A8D584] accent-[#4D9857]"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to registered email address.')}
                  className="text-[#729C56] hover:text-[#29452B] font-semibold hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Primary Sign In Button (#A8D584) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || isSuccess}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#A8D584] hover:bg-[#97C770] text-[#29452B] text-sm font-extrabold shadow-md shadow-[#A8D584]/25 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#29452B]" />
                      <span>Signing In…</span>
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#29452B]" />
                      <span>Authenticated! Redirecting…</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Bottom: Don't have an account? Create account */}
            <div className="text-center pt-2 border-t border-[#DCE8D4]/60 text-xs text-[#788773]">
              <span>Don’t have an account? </span>
              <Link
                to="/register"
                className="font-bold text-[#29452B] hover:text-[#729C56] hover:underline ml-1"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
