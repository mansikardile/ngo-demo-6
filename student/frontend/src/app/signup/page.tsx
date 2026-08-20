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
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const APPROVED_DOMAINS = [
  'coep.ac.in',
  'coeptech.ac.in',
  'vjti.ac.in',
  'iitb.ac.in',
  'vit.edu',
  'pict.edu',
  'mitwpu.edu.in',
  'spit.ac.in',
  'rvce.edu.in',
  'bmsce.ac.in',
  'dtu.ac.in',
  'nsut.ac.in',
  'iiit.ac.in',
  'nitk.edu.in',
  'vnit.ac.in',
  'cumminscollege.in',
];

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  collegeName: z.string().min(2, 'College / Institution name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function StudentSignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      collegeName: '',
      password: '',
    },
  });

  const emailVal = watch('email') || '';

  // Real-time domain verification preview
  const domain = emailVal.includes('@') ? emailVal.split('@')[1]?.toLowerCase() : '';
  const isApprovedCollegeDomain = domain ? APPROVED_DOMAINS.includes(domain) : false;
  const isEduDomain = domain ? (domain.endsWith('.ac.in') || domain.endsWith('.edu') || domain.endsWith('.edu.in')) : false;

  const signupMutation = useMutation({
    mutationFn: async (data: SignupFormData) => {
      const res = await api.post('/auth/signup', data);
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
      }, 1000);
    },
    onError: (err: any) => {
      setServerError(err.response?.data?.message || 'Sign up failed. Please check your details.');
    },
  });

  // Real Google OAuth Pop-up Trigger
  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsGoogleLoading(true);
        setServerError(null);

        // Fetch actual user profile from Google's userinfo endpoint
        const googleRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        const { email, name, picture, sub } = googleRes.data;

        // Register/Login in Supabase DB
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
        }, 800);
      } catch (err: any) {
        setServerError(err.response?.data?.message || 'Failed to authenticate Google account');
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      setIsGoogleLoading(false);
      // If client ID is unconfigured or blocked, open fallback chooser
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
      {/* Main Split Card */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Side: Form Container */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between">
          <div>
            {/* Top Brand Logo */}
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
                Student Sign Up
              </h1>
              <p className="text-xs text-slate-500">
                Create an account to attend Katalyst sessions and apply for STEM scholarships.
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

            {/* Real Google OAuth Pop-up Buttons */}
            <div className="space-y-2.5 mb-5">
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
                or sign up with email
              </span>
              <div className="border-t border-slate-200 w-full" />
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit((d) => signupMutation.mutate(d))} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    {...register('fullName')}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl input-field outline-none"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-[10px] text-rose-600 mt-1 font-medium">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700">
                    College / Personal Email *
                  </label>
                  {isApprovedCollegeDomain ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Approved College Domain
                    </span>
                  ) : isEduDomain ? (
                    <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      .edu domain (Pending verification)
                    </span>
                  ) : null}
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="name@college.edu or name@gmail.com"
                    {...register('email')}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl input-field outline-none"
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] text-rose-600 mt-1 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* College Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  College / University Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. COEP Pune / VJTI / PICT"
                    {...register('collegeName')}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl input-field outline-none"
                  />
                </div>
                {errors.collegeName && (
                  <p className="text-[10px] text-rose-600 mt-1 font-medium">
                    {errors.collegeName.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Create Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    {...register('password')}
                    className="w-full pl-9 pr-10 py-2 text-xs rounded-xl input-field outline-none"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={signupMutation.isPending}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {signupMutation.isPending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Student Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer switch */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-rose-600 hover:underline">
              Log in here
            </Link>
          </div>
        </div>

        {/* Right Side: Inspiring STEM Visual Showcase */}
        <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-rose-950 p-10 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(244,63,94,0.25)_0%,transparent_50%)] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-rose-300 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Katalyst Scholar Community</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight leading-snug">
              Transform your STEM journey with India's premier women mentorship initiative.
            </h2>
          </div>

          <div className="relative z-10 my-8 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <p className="text-xs text-slate-200 leading-relaxed italic mb-4">
              "Katalyst paired me with an Engineering VP who guided my coding roadmap every month. Today, I work as a Cloud Architect. Any young woman in engineering can achieve this."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-400 to-indigo-400 flex items-center justify-center font-bold text-sm text-slate-900">
                A
              </div>
              <div>
                <p className="text-xs font-bold text-white">Ananya Kulkarni</p>
                <p className="text-[10px] text-rose-300">Katalyst Alumna &bull; COEP Pune</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-2 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full scholarship & 1:1 corporate mentorship</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Free laptop distribution for coding & projects</span>
            </div>
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
          }, 800);
        }}
      />
    </div>
  );
}
