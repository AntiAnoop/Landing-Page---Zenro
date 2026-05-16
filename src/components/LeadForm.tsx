import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  ChevronRight, 
  Globe, 
  GraduationCap, 
  Briefcase, 
  Wallet, 
  MapPin, 
  User, 
  Mail, 
  Phone 
} from 'lucide-react';
import { TppLead } from '../types';
import { supabase, handleSupabaseError } from '../lib/supabase';
import { 
  LANGUAGE_OPTIONS, 
  EDUCATION_OPTIONS, 
  JOB_INTEREST_OPTIONS, 
  INVESTMENT_OPTIONS 
} from '../constants';

interface LeadFormProps {
  currentLead: Partial<TppLead>;
  setCurrentLead: React.Dispatch<React.SetStateAction<Partial<TppLead>>>;
  onSuccess: () => void;
}

export default function LeadForm({ currentLead, setCurrentLead, onSuccess }: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Debounced real-time upsert for contact info
  useEffect(() => {
    const { full_name, email, phone } = currentLead;
    
    // Only auto-save if phone or email is mostly valid
    if (!phone || phone.length < 10) return;

    const timer = setTimeout(async () => {
      setSaveStatus('saving');
      const { error } = await supabase
        .from('tpp_leads')
        .upsert({ 
          phone, 
          full_name, 
          email,
          status: 'lead'
        }, { onConflict: 'phone' });
      
      if (error) {
        setSaveStatus('error');
        handleSupabaseError(error, 'auto_save_contact');
      } else {
        setSaveStatus('saved');
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [currentLead.full_name, currentLead.email, currentLead.phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase
      .from('tpp_leads')
      .upsert({
        ...currentLead,
        status: 'qualified',
        updated_at: new Date().toISOString()
      }, { onConflict: 'phone' });

    if (error) {
      handleSupabaseError(error, 'final_form_submit');
      setIsSubmitting(false);
      alert("Submission failed. Please check your connection.");
    } else {
      onSuccess();
    }
  };

  const handleInputChange = (field: keyof TppLead, value: string) => {
    setCurrentLead(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 pb-24 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold uppercase tracking-wider">
          <Globe className="w-3 h-3" />
          <span>Japan Transition Program</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 leading-tight">
          Qualify for the <br />
          <span className="text-red-600 font-black">Zenro TPP</span>
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Embark on a career-changing journey to Japan. Complete this assessment to see if you qualify for our 2026 intake.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information (Prioritized for real-time capture) */}
        <div className="space-y-4 p-5 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              Contact Details
            </h2>
            {saveStatus === 'saved' && <span className="text-[10px] text-green-600 font-medium animate-pulse">Draft Saved</span>}
          </div>
          
          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                required
                type="text"
                placeholder="Full Name"
                value={currentLead.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-red-600 outline-none transition-all text-sm"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                required
                type="email"
                placeholder="Email Address"
                value={currentLead.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-red-600 outline-none transition-all text-sm"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                required
                type="tel"
                placeholder="Phone Number"
                value={currentLead.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-red-600 outline-none transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Assessment Questions */}
        <div className="space-y-6">
          <SectionTitle icon={<Globe className="w-4 h-4" />} title="Language Readiness" />
          <div className="grid gap-3">
            {LANGUAGE_OPTIONS.map((opt) => (
              <label key={opt} className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${currentLead.language_willingness === opt ? 'bg-red-50 border-red-600 text-red-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                <input
                  type="radio"
                  name="language"
                  checked={currentLead.language_willingness === opt}
                  onChange={() => handleInputChange('language_willingness', opt)}
                  className="hidden"
                />
                <span className="text-sm font-medium pr-8">{opt}</span>
                {currentLead.language_willingness === opt && <CheckCircle2 className="absolute right-4 w-5 h-5 text-red-600" />}
              </label>
            ))}
          </div>

          <SectionTitle icon={<GraduationCap className="w-4 h-4" />} title="Qualification" />
          <select 
            value={currentLead.education}
            onChange={(e) => handleInputChange('education', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-red-600 outline-none appearance-none cursor-pointer text-sm"
          >
            <option value="">Highest Education</option>
            {EDUCATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>

          <SectionTitle icon={<Briefcase className="w-4 h-4" />} title="Career Aspirations" />
          <select 
            value={currentLead.job_role}
            onChange={(e) => handleInputChange('job_role', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-red-600 outline-none appearance-none cursor-pointer text-sm"
          >
            <option value="">Preferred Job Role</option>
            {JOB_INTEREST_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>

          <SectionTitle icon={<Wallet className="w-4 h-4" />} title="Investment Comfort" />
          <div className="grid gap-3">
            {INVESTMENT_OPTIONS.map((opt) => (
              <label key={opt} className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${currentLead.investment_comfort === opt ? 'bg-red-50 border-red-600 text-red-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                <input
                  type="radio"
                  name="investment"
                  checked={currentLead.investment_comfort === opt}
                  onChange={() => handleInputChange('investment_comfort', opt)}
                  className="hidden"
                />
                <span className="text-sm font-medium pr-8">{opt}</span>
                {currentLead.investment_comfort === opt && <CheckCircle2 className="absolute right-4 w-5 h-5 text-red-600" />}
              </label>
            ))}
          </div>

          <SectionTitle icon={<MapPin className="w-4 h-4" />} title="Location" />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="State"
              value={currentLead.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-red-600 outline-none text-sm"
            />
            <input
              type="text"
              placeholder="City"
              value={currentLead.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-red-600 outline-none text-sm"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Biggest Achievement</label>
              <textarea
                rows={3}
                value={currentLead.achievement}
                onChange={(e) => handleInputChange('achievement', e.target.value)}
                placeholder="Describe a moment you're proud of..."
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-red-600 outline-none text-sm resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Why do you want to go to Japan?</label>
              <textarea
                rows={3}
                value={currentLead.why_japan}
                onChange={(e) => handleInputChange('why_japan', e.target.value)}
                placeholder="Share your motivation..."
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-red-600 outline-none text-sm resize-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Area */}
        <div className="sticky bottom-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-2xl shadow-xl shadow-red-200 flex items-center justify-center gap-2 group transition-all"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Submit Qualification Case</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          <p className="text-center text-[10px] text-gray-400 mt-3 font-medium uppercase tracking-widest">
            100% SECURE & PRIVATE · NO OBLIGATION
          </p>
        </div>
      </form>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="text-red-500">{icon}</div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">{title}</h3>
    </div>
  );
}
