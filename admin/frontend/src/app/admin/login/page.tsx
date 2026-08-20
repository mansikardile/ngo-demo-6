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
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 sky-bg">
      {/* Background ambient lighting/clouds design */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-white/80 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white/90 to-transparent" />
      </div>

      {/* Top Header / Branding */}
      <header className="absolute top-6 left-6 sm:top-8 sm:left-10 z-10 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/20 text-white font-bold text-lg">
          K
        </div>
        <div className="flex flex-col">
          <span className="text-base font-extrabold tracking-tight text-slate-800">
            Katalyst
          </span>
          <span className="text-[10px] font-semibold text-sky-700 tracking-wider uppercase">
            STEM Outreach &bull; Admin
          </span>
        </div>
      </header>

      {/* Center Glassmorphic Login Card */}
      <div className="relative z-10 w-full max-w-[420px] rounded-3xl glass-panel p-8 sm:p-9 transition-all duration-300">
        {/* Top Icon Badge */}
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-700 transition-transform duration-300 hover:scale-105">
            <LogIn className="w-6 h-6 text-slate-700" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1.5">
            Sign in with email
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-[280px] mx-auto leading-relaxed">
            Admin access to track student outreach, events, and conversion funnels.
          </p>
        </div>

        {/* Feedback Alert Messages */}
        {authError && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 flex items-start gap-2.5 text-rose-700 text-xs sm:text-sm animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="font-medium leading-snug">{authError}</span>
          </div>
        )}

        {isSuccess && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-2.5 text-emerald-700 text-xs sm:text-sm animate-in fade-in slide-in-from-top-1 duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-semibold">Authentication successful! Redirecting...</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          <div>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="admin-email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                {...register('email')}
                className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl glass-input text-slate-900 placeholder:text-slate-400 outline-none ${
                  errors.email ? '!border-rose-400 !bg-rose-50/50' : ''
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-rose-600 pl-1 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                autoComplete="current-password"
                {...register('password')}
                className={`w-full pl-10 pr-11 py-3 text-sm rounded-xl glass-input text-slate-900 placeholder:text-slate-400 outline-none ${
                  errors.password ? '!border-rose-400 !bg-rose-50/50' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none p-0.5"
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
              <p className="mt-1.5 text-xs text-rose-600 pl-1 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Helper / Info */}
          <div className="flex items-center justify-end pt-1">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-slate-400" />
              Encrypted Session
            </span>
          </div>

          {/* Submit Button */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={loginMutation.isPending || isSuccess}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {loginMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Welcome back</span>
              </>
            ) : (
              <span>Get Started</span>
            )}
          </button>
        </form>

        {/* Database Connected Status Footer Badge */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Connected to Supabase PostgreSQL</span>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="relative z-10 mt-8 text-center text-xs text-slate-500 font-medium">
        Katalyst India &copy; 2025 &bull; Empowering Young Women in STEM
      </footer>
    </main>
  );
}
