'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Star,
  CheckCircle2,
  X,
  Building2,
  Mail,
  User,
  Tag,
  MessageSquare,
  Lightbulb,
  Award,
  Download,
  Share2,
} from 'lucide-react';
import { Language, translations } from '@/lib/translations';

interface VolunteerFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultActivityCode?: string;
  lang?: Language;
}

const SAMPLE_ACTIVITIES = [
  { code: 'SEVA-PUNE-KIT-01', name: 'Samutkarsh: 500 School Kits Assembly • Mastercard Pune' },
  { code: 'SEVA-MUM-DIGI-02', name: 'Digital Literacy & Coding Lab • Barclays Mumbai' },
  { code: 'SEVA-PUNE-TREE-03', name: 'Punarvas: Urban Micro-Forest Plantation • TCS Pune' },
  { code: 'SEVA-NSK-TRIBAL-04', name: 'Vanyashala: Solar Study Lamp Distribution • Nashik' },
];

const THEMES = [
  { id: 'logistics', label: 'Logistics & Venue Setup' },
  { id: 'engagement', label: 'Beneficiary Interaction' },
  { id: 'materials', label: 'Kit Materials & Quality' },
  { id: 'timing', label: 'Schedule & Time Management' },
  { id: 'facilitator', label: 'SevaSahayog Facilitator Support' },
];

export default function VolunteerFeedbackModal({
  isOpen,
  onClose,
  defaultActivityCode = '',
  lang = 'en',
}: VolunteerFeedbackModalProps) {
  const t = translations[lang] || translations.en;

  const [activityCode, setActivityCode] = useState(defaultActivityCode || 'SEVA-PUNE-KIT-01');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('Mastercard');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState('engagement');
  const [comments, setComments] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedbackId, setFeedbackId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `SEVA-FB-${Date.now().toString().slice(-6)}`;
      setFeedbackId(generatedId);

      // Save to localStorage for instant persistence
      const stored = JSON.parse(localStorage.getItem('seva_volunteer_feedbacks') || '[]');
      stored.unshift({
        id: generatedId,
        activityCode,
        name,
        email,
        company,
        rating,
        selectedTheme,
        comments,
        suggestions,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('seva_volunteer_feedbacks', JSON.stringify(stored));

      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header Ribbon */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#0f2b5c] via-blue-900 to-[#091b3b] text-white relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-sky-200 text-xs font-bold mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>SevaSahayog Volunteer Experience</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {t.modalTitle}
          </h2>
          <p className="text-xs sm:text-sm text-sky-100/90 mt-1">
            {t.modalSub}
          </p>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Activity Code Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {t.modalActivityCode}
                </label>
                <select
                  value={activityCode}
                  onChange={(e) => setActivityCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                  required
                >
                  {SAMPLE_ACTIVITIES.map((act) => (
                    <option key={act.code} value={act.code}>
                      {act.code} — {act.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Volunteer Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-blue-700" />
                    <span>{t.modalName}</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mansi Kardile"
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-blue-700" />
                    <span>{t.modalEmail}</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. mansi@mastercard.com"
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              {/* Corporate Partner Company */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-700" />
                  <span>{t.modalCompany}</span>
                </label>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                >
                  <option value="Mastercard">Mastercard India</option>
                  <option value="Barclays">Barclays Global Service Center</option>
                  <option value="TCS">Tata Consultancy Services (TCS)</option>
                  <option value="Infosys">Infosys Springboard</option>
                  <option value="Cummins">Cummins India Foundation</option>
                  <option value="Cognizant">Cognizant Outreach</option>
                  <option value="Other">Other Corporate Partner</option>
                </select>
              </div>

              {/* 5-Star Interactive Rating */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2 text-center">
                <label className="text-xs font-black text-amber-900 block">
                  {t.modalRating}
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-[11px] font-bold text-amber-800">
                  {rating === 5 && '🌟 Transformative & Highly Engaging!'}
                  {rating === 4 && '👍 Very Good Experience!'}
                  {rating === 3 && '🙂 Satisfactory Event'}
                  {rating <= 2 && '⚠️ Needs Logistics / Content Improvements'}
                </p>
              </div>

              {/* Primary Feedback Theme */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-blue-700" />
                  <span>{t.modalTheme}</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {THEMES.map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setSelectedTheme(th.id)}
                      className={`px-3 py-2 rounded-xl text-[11px] font-bold border transition-all text-left ${
                        selectedTheme === th.id
                          ? 'bg-[#0f2b5c] text-white border-[#0f2b5c] shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {th.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments & Suggestions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-700" />
                  <span>{t.modalComments}</span>
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="e.g. Assembling 500 kits directly for Zilla Parishad school kids was deeply rewarding..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.modalSuggestions}</span>
                </label>
                <textarea
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  placeholder="e.g. We could add a 15-minute briefing video before starting the packaging line..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-[#0f2b5c] hover:bg-[#091b3b] active:bg-[#061226] text-white font-black text-sm shadow-xl shadow-blue-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-sky-300" />
                    <span>{t.modalSubmitBtn}</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Confirmation Pass Card */
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto shadow-inner animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">
                  {t.modalSuccessTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  {t.modalSuccessSub}
                </p>
              </div>

              {/* Digital Certificate of Volunteering Card */}
              <div className="p-6 rounded-3xl bg-slate-950 text-white text-left font-mono border border-slate-800 shadow-2xl relative overflow-hidden space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-sky-400" />
                    <span className="text-xs font-bold text-sky-300">
                      SEVASAHAYOG VOLUNTEER PASS
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-sans">
                    {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Volunteer:</span>
                    <strong className="text-white font-sans text-sm">{name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Corporate Partner:</span>
                    <strong className="text-sky-400 font-sans text-sm">{company}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Activity Code:</span>
                    <span className="text-white font-bold">{activityCode}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Feedback ID:</span>
                    <span className="text-amber-400 font-bold">{feedbackId}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-sans">
                  <span>Verified CSR Volunteering Contribution</span>
                  <span className="text-sky-400 font-bold">100% Validated</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3.5 rounded-2xl bg-[#0f2b5c] text-white font-bold text-xs shadow-lg hover:bg-[#091b3b] transition-colors"
                >
                  {t.modalCloseBtn}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
