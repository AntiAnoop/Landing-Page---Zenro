import React, { useState, useEffect } from 'react';
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

  // Debounced real-time upsert for contact info
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const { full_name, email, phone } = currentLead;
    // Save as long as they have a phone number (our unique identifier)
    if (!phone || phone.length < 5) return;

    const timer = setTimeout(async () => {
      await supabase
        .from('tpp_leads')
        .upsert({ 
          phone, 
          full_name: full_name || null, 
          email: email || null,
          status: 'lead'
        }, { onConflict: 'phone' });
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentLead.full_name, currentLead.email, currentLead.phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isSupabaseConfigured) {
      // Allow bypass in local dev/demo if keys are missing
      onSuccess();
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: supaError } = await supabase
        .from('tpp_leads')
        .upsert({
          ...currentLead,
          status: 'qualified',
          updated_at: new Date().toISOString()
        }, { onConflict: 'phone' });

      if (supaError) throw supaError;
      onSuccess();
    } catch (err: any) {
      handleSupabaseError(err, 'final_form_submit');
      setError('Connection error. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof TppLead, value: string) => {
    setCurrentLead(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4 px-3 sm:px-0">
      {/* Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="h-2 bg-indigo-600" />
        <div className="p-6 md:p-8 space-y-3">
          <h1 className="text-2xl md:text-3xl font-normal text-gray-900">Zenro Japan TPP Qualification</h1>
          <p className="text-sm text-gray-700 leading-relaxed border-b border-gray-100 pb-4">
            Thank you for your interest in the Japan Transition Program. Please answer the following questions to help us evaluate your profile.
          </p>
          <div className="text-xs text-red-600 font-medium">* Indicates required question</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <FormSection title="Full Name" required>
          <input
            required
            type="text"
            placeholder="Your answer"
            value={currentLead.full_name}
            onChange={(e) => handleChange('full_name', e.target.value)}
            className="w-full border-b border-gray-300 focus:border-indigo-600 outline-none py-2 text-sm transition-colors focus:border-b-2"
          />
        </FormSection>

        {/* Contact info block */}
        <FormSection title="Contact Information" details="Email and Phone are required for evaluation." required>
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs text-gray-500 uppercase tracking-tight">Email address</label>
              <input
                required
                type="email"
                placeholder="Your email"
                value={currentLead.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full border-b border-gray-300 focus:border-indigo-600 outline-none py-2 text-sm transition-colors focus:border-b-2"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 uppercase tracking-tight">Phone number</label>
              <input
                required
                type="tel"
                placeholder="Your phone number"
                value={currentLead.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full border-b border-gray-300 focus:border-indigo-600 outline-none py-2 text-sm transition-colors focus:border-b-2"
              />
            </div>
          </div>
        </FormSection>

        {/* Radio Questions */}
        <FormSection title="Japanese Language Training" details="Are you willing to undergo six months of intensive training?" required>
          <div className="space-y-3 pt-2">
            {LANGUAGE_OPTIONS.map((opt) => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                <input
                  required
                  type="radio"
                  name="language"
                  checked={currentLead.language_willingness === opt}
                  onChange={() => handleChange('language_willingness', opt)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 accent-indigo-600"
                />
                <span className="text-sm text-gray-800 group-hover:text-gray-900">{opt}</span>
              </label>
            ))}
          </div>
        </FormSection>

        <FormSection title="Education Qualification" required>
          <select 
            required
            value={currentLead.education}
            onChange={(e) => handleChange('education', e.target.value)}
            className="w-full max-w-xs border border-gray-300 rounded p-2 text-sm outline-none focus:border-indigo-600 bg-white"
          >
            <option value="">Choose</option>
            {EDUCATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </FormSection>

        <FormSection title="Preferred Job Role" required>
          <select 
            required
            value={currentLead.job_role}
            onChange={(e) => handleChange('job_role', e.target.value)}
            className="w-full max-w-xs border border-gray-300 rounded p-2 text-sm outline-none focus:border-indigo-600 bg-white"
          >
            <option value="">Choose</option>
            {JOB_INTEREST_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </FormSection>

        <FormSection title="Investment Comfort" required>
          <div className="space-y-3 pt-2">
            {INVESTMENT_OPTIONS.map((opt) => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                <input
                  required
                  type="radio"
                  name="investment"
                  checked={currentLead.investment_comfort === opt}
                  onChange={() => handleChange('investment_comfort', opt)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 accent-indigo-600"
                />
                <span className="text-sm text-gray-800 group-hover:text-gray-900">{opt}</span>
              </label>
            ))}
          </div>
        </FormSection>

        <FormSection title="Location">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs text-gray-500">State</label>
              <input
                type="text"
                placeholder="Your answer"
                value={currentLead.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full border-b border-gray-300 focus:border-indigo-600 outline-none py-2 text-sm transition-colors focus:border-b-2"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">City</label>
              <input
                type="text"
                placeholder="Your answer"
                value={currentLead.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full border-b border-gray-300 focus:border-indigo-600 outline-none py-2 text-sm transition-colors focus:border-b-2"
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Motivation & Achievements">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm">What is your biggest achievement so far?</p>
              <textarea
                rows={3}
                placeholder="Your answer"
                value={currentLead.achievement}
                onChange={(e) => handleChange('achievement', e.target.value)}
                className="w-full border border-gray-300 rounded p-3 text-sm outline-none focus:border-indigo-600 resize-none bg-gray-50/50"
              />
            </div>
            <div className="space-y-4">
              <p className="text-sm">Why do you want to go to Japan?</p>
              <textarea
                rows={3}
                placeholder="Your answer"
                value={currentLead.why_japan}
                onChange={(e) => handleChange('why_japan', e.target.value)}
                className="w-full border border-gray-300 rounded p-3 text-sm outline-none focus:border-indigo-600 resize-none bg-gray-50/50"
              />
            </div>
          </div>
        </FormSection>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between py-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded transition-all disabled:opacity-50 text-sm shadow-sm"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Form'}
          </button>
          
          <div className="hidden sm:block">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span>Section 1 of 1</span>
            </div>
          </div>
        </div>
      </form>
      
      <footer className="py-8 text-center">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">
          Never submit passwords through Google Forms Style UI.
        </p>
      </footer>
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
    <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 transition-shadow hover:shadow-sm">
      <div className="space-y-4">
        <div className="space-y-1">
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
    </div>
  );
}
