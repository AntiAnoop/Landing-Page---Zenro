import React, { useState, useEffect } from 'react';
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
  Phone,
  FastForward
} from 'lucide-react';
import { TppLead } from '../types';
import { supabase, handleSupabaseError, isSupabaseConfigured } from '../lib/supabase';
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
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) {
      console.warn('Supabase is not configured. Form will simulate success without saving data.');
      return;
    }

    const { full_name, email, phone } = currentLead;
    if (!phone || phone.length < 10) return; // Only autosave when phone is 10 digits

    const timer = setTimeout(async () => {
      try {
        const { error: autosaveError } = await supabase
          .from('tpp_leads')
          .upsert({ 
            phone, 
            full_name: full_name || '', 
            email: email || '',
            status: 'lead',
            updated_at: new Date().toISOString()
          }, { onConflict: 'phone' });
        
        if (autosaveError) console.error('Autosave failed:', autosaveError.message);
      } catch (e) {
        console.error('Lead partial save failed', e);
      }
    }, 2000); // 2 second delay for autosave

    return () => clearTimeout(timer);
  }, [currentLead.full_name, currentLead.email, currentLead.phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isSupabaseConfigured) {
      console.error('Supabase keys missing. Details:', { url: !!import.meta.env.VITE_SUPABASE_URL, key: !!import.meta.env.VITE_SUPABASE_ANON_KEY });
      setError('Database not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.');
      setIsSubmitting(false);
      // Optional: Allow user to proceed for demo purposes if preferred, 
      // but usually better to show error if they expect it to save.
      return;
    }

    setIsSubmitting(true);
    
    // Professional Phone Validation: Exactly 10 digits
    const phoneRegex = /^[6-9]\d{9}$/; // Starts with 6-9 usually for Indian numbers, but keeping it simple first
    if (!currentLead.phone || !/^\d{10}$/.test(currentLead.phone)) {
      setError('Please enter a valid 10-digit phone number.');
      setIsSubmitting(false);
      return;
    }

    // Professional Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!currentLead.email || !emailRegex.test(currentLead.email)) {
      setError('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }

    // Check for mandatory textareas length (at least 10 chars)
    if ((currentLead.achievement?.length || 0) < 10) {
      setError('Please provide a bit more detail about your achievement (min 10 characters).');
      setIsSubmitting(false);
      return;
    }

    if ((currentLead.why_japan?.length || 0) < 10) {
      setError('Please tell us more about why you want to go to Japan (min 10 characters).');
      setIsSubmitting(false);
      return;
    }

    try {
      // Create a clean payload to avoid any extra fields
      const payload: any = {
        phone: currentLead.phone,
        full_name: currentLead.full_name || '',
        email: currentLead.email || '',
        language_willingness: currentLead.language_willingness || '',
        education: currentLead.education || '',
        job_role: currentLead.job_role || '',
        investment_comfort: currentLead.investment_comfort || '',
        achievement: currentLead.achievement || '',
        why_japan: currentLead.why_japan || '',
        state: currentLead.state || '',
        city: currentLead.city || '',
        status: 'qualified',
        updated_at: new Date().toISOString()
      };

      const { error: supaError } = await supabase
        .from('tpp_leads')
        .upsert(payload, { onConflict: 'phone' });

      if (supaError) {
        console.error('Supabase error detail:', supaError);
        throw supaError;
      }
      onSuccess();
    } catch (err: any) {
      handleSupabaseError(err, 'final_form_submit');
      setError(`Submission failed: ${err.message || 'Check your internet connection.'}`);
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof TppLead, value: string) => {
    setCurrentLead(prev => ({ ...prev, [field]: value }));
  };

  const handleTestSkip = () => {
    const testData: Partial<TppLead> = {
      full_name: 'Test Tester',
      email: 'test@zenro.com',
      phone: '9876543210',
      language_willingness: LANGUAGE_OPTIONS[0],
      education: EDUCATION_OPTIONS[3],
      job_role: JOB_INTEREST_OPTIONS[5],
      investment_comfort: INVESTMENT_OPTIONS[0],
      achievement: 'Completed a full course on Japanese Language in record time.',
      why_japan: 'I love the culture and technology in Japan and want a global career.',
      state: 'Karnataka',
      city: 'Bangalore',
      status: 'qualified'
    };
    setCurrentLead(testData);
    onSuccess();
  };

  return (
    <div className="space-y-1">
      {/* Test Skip Button */}
      <div className="flex justify-end px-6 pt-2">
        <button 
          onClick={handleTestSkip}
          className="flex items-center gap-1 text-[9px] text-gray-300 hover:text-blue-500 font-bold uppercase tracking-tighter transition-colors"
        >
          <FastForward className="w-3 h-3" />
          Test Skip
        </button>
      </div>

      {/* Header Card */}
      <div className="overflow-hidden pb-1">
        <div className="px-6 md:px-8 py-4 space-y-4">
          <h1 className="text-2xl md:text-3xl font-medium text-gray-900 leading-tight text-center">
            Zenro's Training and Career Readiness Program
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed font-medium italic text-left opacity-90">
            Please fill out the form accurately to help us evaluate your profile for the Japan transition journey.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Japanese Language Training */}
        <FormSection title="Six months of dedicated Japanese language training is mandatory. Please confirm your willingness:" required>
          <div className="space-y-4 pt-4">
            {LANGUAGE_OPTIONS.map((opt) => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                <input
                  required
                  type="radio"
                  name="language"
                  checked={currentLead.language_willingness === opt}
                  onChange={() => handleInputChange('language_willingness', opt)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <span className="text-sm text-gray-800">{opt}</span>
              </label>
            ))}
          </div>
        </FormSection>

        {/* Education Qualification */}
        <FormSection title="Highest education qualification" required>
          <div className="space-y-4 pt-4">
            {EDUCATION_OPTIONS.map((opt) => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                <input
                  required
                  type="radio"
                  name="education"
                  checked={currentLead.education === opt}
                  onChange={() => handleInputChange('education', opt)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <span className="text-sm text-gray-800">{opt}</span>
              </label>
            ))}
          </div>
        </FormSection>

        {/* Preferred Job Role */}
        <FormSection title="Which job role interests you most?" required>
          <div className="space-y-4 pt-4">
            {JOB_INTEREST_OPTIONS.map((opt) => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                <input
                  required
                  type="radio"
                  name="job_role"
                  checked={currentLead.job_role === opt}
                  onChange={() => handleInputChange('job_role', opt)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <span className="text-sm text-gray-800">{opt}</span>
              </label>
            ))}
          </div>
        </FormSection>

        {/* Investment Capacity */}
        <FormSection title="The estimated investment is ₹2 lakhs, payable in stages. Are you comfortable with this?" required>
          <div className="space-y-4 pt-4">
            {INVESTMENT_OPTIONS.map((opt) => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                <input
                  required
                  type="radio"
                  name="investment"
                  checked={currentLead.investment_comfort === opt}
                  onChange={() => handleInputChange('investment_comfort', opt)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <span className="text-sm text-gray-800">{opt}</span>
              </label>
            ))}
          </div>
        </FormSection>

        {/* Achievement */}
        <FormSection title="Describe the biggest achievement you consider so far." required>
          <div className="space-y-2">
            <textarea
              required
              rows={3}
              minLength={10}
              maxLength={500}
              placeholder="Your answer"
              value={currentLead.achievement}
              onChange={(e) => handleInputChange('achievement', e.target.value)}
              className="w-full border-b border-gray-300 focus:border-blue-600 outline-none pt-4 pb-2 text-sm transition-all focus:border-b-2 resize-none"
            />
            <div className="flex justify-end">
              <span className="text-[10px] text-gray-400">
                {currentLead.achievement?.length || 0}/500
              </span>
            </div>
          </div>
        </FormSection>

        {/* Why Japan */}
        <FormSection title="Why do you want to go to Japan?" required>
          <div className="space-y-2">
            <textarea
              required
              rows={3}
              minLength={10}
              maxLength={500}
              placeholder="Your answer"
              value={currentLead.why_japan}
              onChange={(e) => handleInputChange('why_japan', e.target.value)}
              className="w-full border-b border-gray-300 focus:border-blue-600 outline-none pt-4 pb-2 text-sm transition-all focus:border-b-2 resize-none"
            />
            <div className="flex justify-end">
              <span className="text-[10px] text-gray-400">
                {currentLead.why_japan?.length || 0}/500
              </span>
            </div>
          </div>
        </FormSection>

        {/* Full Name */}
        <FormSection title="Full Name" required>
          <input
            required
            type="text"
            minLength={3}
            maxLength={100}
            placeholder="Your answer"
            value={currentLead.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            className="w-full border-b border-gray-300 focus:border-blue-600 outline-none pt-4 pb-2 text-sm transition-all focus:border-b-2 bg-transparent"
          />
        </FormSection>

        {/* Email */}
        <FormSection title="Email Address" required>
          <input
            required
            type="email"
            placeholder="example@email.com"
            value={currentLead.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full border-b border-gray-300 focus:border-blue-600 outline-none pt-4 pb-2 text-sm transition-all focus:border-b-2 bg-transparent"
          />
        </FormSection>

        {/* Phone */}
        <FormSection title="Phone Number" required>
          <div className="relative">
            <input
              required
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              placeholder="10-digit number"
              value={currentLead.phone}
              onKeyDown={(e) => {
                if (
                  !/[0-9]/.test(e.key) && 
                  !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)
                ) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, ''))}
              className="w-full border-b border-gray-300 focus:border-blue-600 outline-none pt-4 pb-2 text-sm transition-all focus:border-b-2 bg-transparent"
            />
          </div>
        </FormSection>

        {/* State */}
        <FormSection title="State" required>
          <input
            required
            type="text"
            placeholder="Your answer"
            value={currentLead.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className="w-full border-b border-gray-300 focus:border-blue-600 outline-none pt-4 pb-2 text-sm transition-all focus:border-b-2"
          />
        </FormSection>

        {/* City */}
        <FormSection title="City">
          <input
            type="text"
            placeholder="Your answer"
            value={currentLead.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="w-full border-b border-gray-300 focus:border-blue-600 outline-none pt-4 pb-2 text-sm transition-all focus:border-b-2"
          />
        </FormSection>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Submit Form Button Group */}
        <div className="py-6 space-y-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition-all disabled:opacity-50 text-sm shadow-sm"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Form'}
          </button>
          
          <p className="text-xs text-gray-600 opacity-60 tracking-tight leading-relaxed px-1 text-left italic">
            *this information will be used to reaching out you.
          </p>
        </div>
      </form>
    </div>
  );
}

interface FormSectionProps {
  title: string;
  details?: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormSection({ title, details, required, children }: FormSectionProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 space-y-4">
      <div className="space-y-2">
        <div className="flex items-baseline gap-1">
          <h3 className="text-base font-normal text-gray-900">{title}</h3>
          {required && <span className="text-red-500 text-lg">*</span>}
        </div>
        {details && <p className="text-xs text-gray-500">{details}</p>}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}
