'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('katalyst_token');
    if (token) {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await api.post('/auth/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuthError(null);
      setIsSuccess(true);
      if (data.data?.token) {
        localStorage.setItem('katalyst_token', data.data.token);
        localStorage.setItem(
          'katalyst_admin',
          JSON.stringify(data.data.admin)
        );
      }
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 700);
    },
    onError: (error: any) => {
      setIsSuccess(false);
      const msg =
        error.response?.data?.message ||
        'Authentication failed. Please check your credentials and try again.';
      setAuthError(msg);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setAuthError(null);
    loginMutation.mutate(data);
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-[#fdfbf7] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl" />
      </div>

      {/* Top Header / Branding */}
      <header className="absolute top-6 left-6 sm:top-8 sm:left-10 z-10 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-[#153e2e] flex items-center justify-center shadow-md text-white font-bold text-base">
          K
        </div>
        <div className="flex flex-col">
          <span className="text-base font-extrabold tracking-tight text-slate-900">
            Katalyst India
          </span>
          <span className="text-[10px] font-bold text-emerald-800 tracking-wider uppercase">
            Outreach Command &bull; Admin
          </span>
        </div>
      </header>

      {/* Center HopeBridge Card */}
      <div className="relative z-10 w-full max-w-[440px] rounded-[32px] bg-white p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-200/80 transition-all duration-300">
        {/* Top Icon Badge */}
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-[#153e2e] shadow-sm">
            <ShieldCheck className="w-7 h-7 text-[#153e2e]" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="text-center mb-7">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1.5">
            Admin Portal.<br />
            <span className="font-editorial italic font-normal text-[#ea580c]">Executive</span> Sign In.
          </h1>
          <p className="text-xs text-slate-500 max-w-[290px] mx-auto leading-relaxed">
            Manage student evaluation dossiers, campus drives, email dispatches, and funnel analytics.
          </p>
        </div>

        {/* Feedback Alert Messages */}
        {authError && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="font-medium leading-snug">{authError}</span>
          </div>
        )}

        {isSuccess && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-800 text-xs animate-in fade-in font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Authentication successful! Redirecting to Command Center...</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
              Admin Email
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="admin-email"
                type="email"
                placeholder="admin@katalyst.org"
                autoComplete="email"
                {...register('email')}
                className={`w-full pl-10 pr-4 py-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                  errors.email ? '!border-rose-400 !bg-rose-50/50' : ''
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-[10px] text-rose-600 pl-1 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register('password')}
                className={`w-full pl-10 pr-11 py-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                  errors.password ? '!border-rose-400 !bg-rose-50/50' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-[10px] text-rose-600 pl-1 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Helper / Info */}
          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              256-Bit SSL Encrypted
            </span>
            <span>Role: Executive</span>
          </div>

          {/* Submit Button */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={loginMutation.isPending || isSuccess}
            className="w-full mt-2 py-3.5 px-5 rounded-full bg-[#153e2e] hover:bg-[#0e2c20] active:bg-[#081a13] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
          >
            {loginMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Redirecting...</span>
              </>
            ) : (
              <span>Sign In to Command Center</span>
            )}
          </button>
        </form>

        {/* Database Connected Status Footer Badge */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Connected to Supabase PostgreSQL</span>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="relative z-10 mt-8 text-center text-xs text-slate-500 font-medium">
        Katalyst India &bull; Building Hope &bull; Creating Change &bull; Transforming Lives
      </footer>
    </main>
  );
}
