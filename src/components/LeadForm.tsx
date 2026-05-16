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
  Phone 
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

  // Debounced real-time upsert for contact info
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const { full_name, email, phone } = currentLead;
    if (!phone || phone.length < 5) return;

    const timer = setTimeout(async () => {
      try {
        await supabase
          .from('tpp_leads')
          .upsert({ 
            phone, 
            full_name: full_name || null, 
            email: email || null,
            status: 'lead'
          }, { onConflict: 'phone' });
      } catch (e) {
        console.error('Lead partial save failed', e);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentLead.full_name, currentLead.email, currentLead.phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isSupabaseConfigured) {
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

  const handleInputChange = (field: keyof TppLead, value: string) => {
    setCurrentLead(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-1">
      {/* Header Card */}
      <div className="overflow-hidden pb-1">
        <div className="px-6 md:px-8 py-4 space-y-4">
          <h1 className="text-2xl md:text-3xl font-normal text-gray-900 leading-tight text-center">
            Zenro's Training and Career Readiness Program
          </h1>
          <p className="text-sm text-gray-700 leading-relaxed font-medium italic text-left">
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
          <textarea
            required
            rows={3}
            placeholder="Your answer"
            value={currentLead.achievement}
            onChange={(e) => handleInputChange('achievement', e.target.value)}
            className="w-full border-b border-gray-300 focus:border-blue-600 outline-none pt-4 pb-2 text-sm transition-all focus:border-b-2 resize-none"
          />
        </FormSection>

        {/* Why Japan */}
        <FormSection title="Why do you want to go to Japan?" required>
          <textarea
            required
            rows={3}
            placeholder="Your answer"
            value={currentLead.why_japan}
            onChange={(e) => handleInputChange('why_japan', e.target.value)}
            className="w-full border-b border-gray-300 focus:border-blue-600 outline-none pt-4 pb-2 text-sm transition-all focus:border-b-2 resize-none"
          />
        </FormSection>

        {/* Full Name */}
        <FormSection title="Full Name" required>
          <input
            required
            type="text"
            placeholder="Your answer"
            value={currentLead.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            className="w-full border-b border-gray-300 focus:border-blue-600 outline-none pt-4 pb-2 text-sm transition-all focus:border-b-2"
          />
        </FormSection>

        {/* Email */}
        <FormSection title="Email Address" required>
          <input
            required
            type="email"
            placeholder="Your answer"
            value={currentLead.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full border-b border-gray-300 focus:border-blue-600 outline-none pt-4 pb-2 text-sm transition-all focus:border-b-2"
          />
        </FormSection>

        {/* Phone */}
        <FormSection title="Phone Number" required>
          <input
            required
            type="tel"
            placeholder="Your answer"
            value={currentLead.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full border-b border-gray-300 focus:border-blue-600 outline-none pt-4 pb-2 text-sm transition-all focus:border-b-2"
          />
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
