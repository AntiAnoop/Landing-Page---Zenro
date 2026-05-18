import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronRight,
  CircleDollarSign,
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

      const { error } = await supabase
        .from('tpp_leads')
        .upsert(payload, { onConflict: 'phone' });

      if (error) throw error;
      onProceed();
    } catch (err: any) {
      handleSupabaseError(err, 'enrollment_save');
      alert(`Submission error: ${err.message}. Please check your connection.`);
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-1">
      {/* Header Section */}
      <div className="overflow-hidden pb-4">
        <div className="px-6 md:px-8 py-4 space-y-4">
          <h1 className="text-2xl md:text-3xl font-medium text-gray-900 leading-tight text-center">
            Program Fee Structure
          </h1>
          <div className="flex flex-col items-center">
            <div className="px-6 py-2 bg-gray-50 border border-gray-200 rounded-full">
              <p className="text-sm font-medium text-gray-700">
                TOTAL TRAINING FEE: <span className="font-bold">{PROGRAM_FEE_TOTAL}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Phase I: Training Fees */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 space-y-6">
          <div className="space-y-1 border-b border-gray-100 pb-3">
            <h3 className="text-lg font-medium text-gray-900 text-center">Phase - I (₹50,000)</h3>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.2em] text-center">Pay in 6 Installments</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-2 bg-gray-50 border-b border-gray-200">
              <div className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-left">Installment</div>
              <div className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Amount</div>
            </div>
            <div className="divide-y divide-gray-100">
              {PHASE_1_FEES.map((item) => (
                <div key={item.month} className="grid grid-cols-2">
                  <div className="p-3 text-sm text-gray-600">
                    {item.month}
                  </div>
                  <div className="p-3 text-sm font-semibold text-gray-900 text-right">
                    {item.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Phase II: Placement Fees */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 space-y-6">
          <div className="space-y-1 border-b border-gray-100 pb-3">
            <h3 className="text-lg font-medium text-gray-900 text-center">Phase - II (₹1,50,000)</h3>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.2em] text-center">Pay in 2 Installments</p>
          </div>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-gray-100">
                {PHASE_2_FEES.map((item) => (
                  <div key={item.label} className="p-4 space-y-1 text-center bg-white">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{item.label}</p>
                    <p className="text-base font-bold text-gray-900">{item.amount}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-lg">
              <Info className="w-4 h-4 text-gray-400 shrink-0" />
              <p className="text-[11px] text-gray-500 italic leading-relaxed">
                Phase II fees are applicable only after receiving the Certificate of Eligibility (COE) and visa invitation.
              </p>
            </div>
          </div>
        </div>

        {/* Batch Selector */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 space-y-6">
          <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2 uppercase tracking-widest">Select Training Batch</h3>
          <div className="space-y-4">
            {CLASS_TIMINGS.map((timing) => (
              <label key={timing.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-blue-600 transition-all group">
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="timing"
                    checked={currentLead.class_timing === timing.label}
                    onChange={() => setCurrentLead(prev => ({ ...prev, class_timing: timing.label }))}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                  />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-gray-800">{timing.label}</p>
                  </div>
                </div>
                {currentLead.class_timing === timing.label && (
                  <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="py-6 space-y-6 text-center">
          <button
            onClick={handleProceed}
            disabled={isUpdating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all text-sm uppercase tracking-widest active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isUpdating ? 'Connecting to Payment Gate...' : 'PAY NOW'}
            <CircleDollarSign className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[11px] text-gray-400 hover:text-blue-600 transition-colors mx-auto"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Prospectus
          </button>
        </div>
      </div>

      <footer className="py-10 text-center">
        <p className="text-[10px] text-gray-300 uppercase tracking-[0.2em] font-medium leading-relaxed">
          Zenro Education Japanese Program • Intake 2026<br />
          Official Fee Disclosure Document
        </p>
      </footer>
    </div>
  );
}


