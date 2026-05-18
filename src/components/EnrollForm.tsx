import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Info
} from 'lucide-react';
import { TppLead } from '../types';
import { CLASS_TIMINGS, PHASE_1_FEES, PHASE_2_FEES, PROGRAM_FEE_TOTAL } from '../constants';
import { supabase, handleSupabaseError, isSupabaseConfigured } from '../lib/supabase';

interface EnrollFormProps {
  currentLead: Partial<TppLead>;
  setCurrentLead: React.Dispatch<React.SetStateAction<Partial<TppLead>>>;
  onProceed: () => void;
  onBack: () => void;
}

export default function EnrollForm({ currentLead, setCurrentLead, onProceed, onBack }: EnrollFormProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleProceed = async () => {
    if (!currentLead.class_timing) {
      alert("Please select your preferred class timing.");
      return;
    }
    
    if (!isSupabaseConfigured) {
      onProceed();
      return;
    }

    setIsUpdating(true);
    try {
    const payload = {
        ...currentLead,
        status: 'enrolled',
        updated_at: new Date().toISOString()
      };

      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('tpp_leads')
          .upsert(payload, { onConflict: 'phone' });

        if (error) throw error;
      } else {
        console.warn('Supabase not configured, simulating enrollment success.');
      }
      onProceed();
    } catch (err: any) {
      handleSupabaseError(err, 'enrollment_save');
      alert(`Submission error: ${err.message}. Please check your connection.`);
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center py-6 space-y-3">
        <h1 className="text-2xl font-normal text-gray-900 tracking-tight">
          Program Fee Structure
        </h1>
        <div className="inline-block px-4 py-1 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-600">
            Total Training Fee: <span className="text-gray-900">{PROGRAM_FEE_TOTAL}</span>
          </p>
        </div>
      </div>

      <div className="space-y-8 font-sans">
        {/* Phase I: Training Fees */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 space-y-4">
          <div className="space-y-0.5 text-left border-b border-gray-100 pb-3">
            <h2 className="text-base font-semibold text-gray-900">Phase I: Training & Language</h2>
            <p className="text-xs text-gray-500">Scheduled in 6 monthly installments</p>
          </div>
          
          <div className="border border-gray-300 rounded overflow-hidden">
            <div className="grid grid-cols-2 bg-gray-100 border-b border-gray-300">
              <div className="p-2 text-[11px] font-bold text-gray-600 uppercase border-r border-gray-300">Installment</div>
              <div className="p-2 text-[11px] font-bold text-gray-600 uppercase text-right">Amount (INR)</div>
            </div>
            <div className="divide-y divide-gray-300">
              {PHASE_1_FEES.map((item) => (
                <div key={item.month} className="grid grid-cols-2">
                  <div className="p-2.5 text-sm text-gray-700 border-r border-gray-300">
                    {item.month}
                  </div>
                  <div className="p-2.5 text-sm text-gray-900 text-right">
                    {item.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Phase II: Placement Fees */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 space-y-4">
          <div className="space-y-0.5 text-left border-b border-gray-100 pb-3">
            <h2 className="text-base font-semibold text-gray-900">Phase II: Placement & Visa</h2>
          </div>
          
          <div className="space-y-4">
            <div className="border border-gray-300 rounded overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-gray-300">
                {PHASE_2_FEES.map((item) => (
                  <div key={item.label} className="p-4 text-center">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-lg font-medium text-gray-900">{item.amount}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 leading-relaxed">
              Note: Phase II fees are applicable only after receiving the Certificate of Eligibility (COE) and visa invitation.
            </p>
          </div>
        </div>

        {/* Batch Selector */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 space-y-6">
          <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2 uppercase tracking-wider">Select Training Batch</h3>
          <div className="space-y-3">
            {CLASS_TIMINGS.map((timing) => (
              <label key={timing.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all group">
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="timing"
                    checked={currentLead.class_timing === timing.label}
                    onChange={() => setCurrentLead(prev => ({ ...prev, class_timing: timing.label }))}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">{timing.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="py-6 space-y-6 text-center">
          <button
            onClick={handleProceed}
            disabled={isUpdating}
            className="w-full bg-gray-900 hover:bg-black text-white font-medium py-4 rounded transition-all text-sm uppercase tracking-widest active:scale-[0.98] disabled:opacity-50"
          >
            {isUpdating ? 'Processing...' : 'Pay Now'}
          </button>
          
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors mx-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Prospectus
          </button>
        </div>
      </div>
    </div>
  );
}


