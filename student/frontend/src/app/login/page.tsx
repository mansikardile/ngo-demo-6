'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { api } from '@/lib/api';
import GoogleAuthModal from '@/components/GoogleAuthModal';
import RealGoogleAuthButton from '@/components/RealGoogleAuthButton';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function StudentLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

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
      const res = await api.post('/auth/login', data);
      return res.data;
    },
    onSuccess: (res) => {
      setServerError(null);
      setSuccessMessage(res.message);
      if (res.data?.token) {
        localStorage.setItem('katalyst_student_token', res.data.token);
        localStorage.setItem('katalyst_student_user', JSON.stringify(res.data.student));
      }
      setTimeout(() => {
        router.push('/');
      }, 700);
    },
    onError: (err: any) => {
      setServerError(err.response?.data?.message || 'Login failed. Please verify your credentials.');
    },
  });

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsGoogleLoading(true);
        setServerError(null);

        const googleRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        const { email, name, picture, sub } = googleRes.data;

        const backendRes = await api.post('/auth/google', {
          email,
          fullName: name || email.split('@')[0],
          googleId: sub,
          profileImageUrl: picture,
        });

        if (backendRes.data?.data?.token) {
          localStorage.setItem('katalyst_student_token', backendRes.data.data.token);
          localStorage.setItem(
            'katalyst_student_user',
            JSON.stringify(backendRes.data.data.student)
          );
        }

        setSuccessMessage(backendRes.data.message);
        setTimeout(() => {
          router.push('/');
        }, 700);
      } catch (err: any) {
        setServerError(err.response?.data?.message || 'Failed to authenticate Google account');
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      setIsGoogleLoading(false);
      setIsGoogleModalOpen(true);
    },
  });

  const handleGoogleClick = () => {
    try {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId || clientId.includes('YOUR_GOOGLE_CLIENT_ID')) {
        setIsGoogleModalOpen(true);
      } else {
        triggerGoogleLogin();
      }
    } catch {
      setIsGoogleModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-slate-100/70">
      {/* Split Card */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        {/* Left Side: Login Form */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between">
          <div>
            {/* Top Brand */}
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
                K
              </div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight">
                Katalyst
              </span>
            </Link>

            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
                Welcome Back!
              </h1>
              <p className="text-xs text-slate-500">
                Sign in with your Email and Password to access your student portal and sessions.
              </p>
            </div>

            {/* Server Feedback Alerts */}
            {serverError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Real Google Sign In Action Buttons */}
            <div className="space-y-2 mb-5">
              <RealGoogleAuthButton
                isCollege={true}
                onSuccess={(data) => {
                  setSuccessMessage(data.message);
                  setTimeout(() => router.push('/'), 700);
                }}
                onError={(err) => setServerError(err)}
              />
              <RealGoogleAuthButton
                isCollege={false}
                onSuccess={(data) => {
                  setSuccessMessage(data.message);
                  setTimeout(() => router.push('/'), 700);
                }}
                onError={(err) => setServerError(err)}
              />
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-5">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] text-slate-400 font-medium uppercase">
                or with email
              </span>
              <div className="border-t border-slate-200 w-full" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit((d) => loginMutation.mutate(d))} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="name@college.edu or name@gmail.com"
                    {...register('email')}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl input-field outline-none"
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] text-rose-600 mt-1 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...register('password')}
                    className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl input-field outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[10px] text-rose-600 mt-1 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loginMutation.isPending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Student Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer switch */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Did not have any account?{' '}
            <Link href="/signup" className="font-bold text-rose-600 hover:underline">
              Register Now
            </Link>
          </div>
        </div>

        {/* Right Side: Inspiring Visual Artwork */}
        <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-10 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(99,102,241,0.25)_0%,transparent_60%)] pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-sky-300 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Katalyst Student Portal</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight leading-snug">
              Unlock mentorship, technical labs & STEM scholarship drives.
            </h2>
          </div>

          <div className="relative z-10 my-8 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <p className="text-xs text-slate-200 leading-relaxed italic mb-3">
              "Katalyst transformed how I viewed engineering. I gained access to senior female mentors in tech who believed in me before anyone else did."
            </p>
            <p className="text-xs font-bold text-white">Divya Patel</p>
            <p className="text-[10px] text-sky-300">Software Engineer &bull; Katalyst Scholar</p>
          </div>

          <div className="relative z-10 text-xs text-slate-400">
            Katalyst India &bull; 17+ Years of Transforming Lives in STEM
          </div>
        </div>
      </div>

      {/* Google Auth Modal Fallback */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={(data) => {
          setIsGoogleModalOpen(false);
          setSuccessMessage(data.message);
          setTimeout(() => {
            router.push('/');
          }, 700);
        }}
      />
    </div>
  );
}
