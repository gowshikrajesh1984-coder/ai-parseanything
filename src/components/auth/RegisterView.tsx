import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  User,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ParseLogoIcon } from '../common/ParseLogo';

export const RegisterView: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!name.trim()) {
      errs.name = 'Full name is required.';
    }

    if (!email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 8) {
      errs.password = 'Password must contain at least 8 characters.';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await register(name, email, password);
    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/documents');
      }, 750);
    } else {
      setErrors({ form: res.error || 'Registration failed.' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F9F2] flex items-center justify-center p-4 sm:p-6 lg:p-10 text-[#29452B]">
      <div className="w-full max-w-xl bg-white rounded-[32px] border border-[#DCE8D4] shadow-xl p-8 sm:p-12 space-y-7">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <ParseLogoIcon size={52} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#29452B] tracking-tight">
            Create an account
          </h1>
          <p className="text-xs sm:text-sm text-[#788773]">
            Start extracting and processing documents with ParseAnything AI.
          </p>
        </div>

        {errors.form && (
          <div className="p-3.5 rounded-2xl bg-[#FDE8E8] border border-[#E76F6F]/40 text-[#E76F6F] text-xs font-semibold">
            ⚠ {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#29452B] uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#788773] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah Jenkins"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F6F9F2] border border-[#DCE8D4] focus:border-[#729C56] focus:ring-2 focus:ring-[#A8D584]/30 text-sm font-medium text-[#29452B] placeholder-[#95A590] focus:outline-none transition-all"
              />
            </div>
            {errors.name && <p className="text-xs text-[#E76F6F] font-semibold pl-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#29452B] uppercase tracking-wider">
              Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#788773] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@company.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F6F9F2] border border-[#DCE8D4] focus:border-[#729C56] focus:ring-2 focus:ring-[#A8D584]/30 text-sm font-medium text-[#29452B] placeholder-[#95A590] focus:outline-none transition-all"
              />
            </div>
            {errors.email && <p className="text-xs text-[#E76F6F] font-semibold pl-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#29452B] uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#788773] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F6F9F2] border border-[#DCE8D4] focus:border-[#729C56] focus:ring-2 focus:ring-[#A8D584]/30 text-sm font-medium text-[#29452B] placeholder-[#95A590] focus:outline-none transition-all"
              />
            </div>
            {errors.password && <p className="text-xs text-[#E76F6F] font-semibold pl-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#29452B] uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#788773] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F6F9F2] border border-[#DCE8D4] focus:border-[#729C56] focus:ring-2 focus:ring-[#A8D584]/30 text-sm font-medium text-[#29452B] placeholder-[#95A590] focus:outline-none transition-all"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-[#E76F6F] font-semibold pl-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#A8D584] hover:bg-[#97C770] text-[#29452B] text-sm font-extrabold shadow-md shadow-[#A8D584]/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account…</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Account Created! Entering workspace…</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-[#DCE8D4]/60 text-xs text-[#788773]">
          <span>Already have an account? </span>
          <Link to="/login" className="font-bold text-[#29452B] hover:text-[#729C56] hover:underline ml-1">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
