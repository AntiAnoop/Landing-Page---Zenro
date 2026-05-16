import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  CreditCard, 
  ShieldCheck, 
  Info,
  Clock,
  ChevronRight,
  TrendingDown,
  CircleDollarSign
} from 'lucide-react';
import { TppLead } from '../types';
import { CLASS_TIMINGS, FEES_STRUCTURE } from '../constants';
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
      const { error } = await supabase
        .from('tpp_leads')
        .update({ class_timing: currentLead.class_timing })
        .eq('phone', currentLead.phone);

      if (error) throw error;
      onProceed();
    } catch (err: any) {
      handleSupabaseError(err, 'update_timing');
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8 space-y-3">
          <h1 className="text-2xl md:text-3xl font-normal text-gray-900">Enrollment & Scheduling</h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Finalize your training batch and review the subsidized fee structure for the 2026 intake.
          </p>
        </div>
      </div>

      {/* Fees Breakdown Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 space-y-4">
        <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2 uppercase tracking-widest">Program Fee Schedule</h3>
        <div className="space-y-0 text-sm">
          {FEES_STRUCTURE.map((item, idx) => (
            <div 
              key={item.stage} 
              className={`py-3 flex justify-between items-start ${idx !== FEES_STRUCTURE.length - 1 ? 'border-b border-gray-50' : 'pt-4 font-bold text-blue-600'}`}
            >
              <div className="space-y-0.5">
                <p>{item.stage}</p>
                <p className="text-[10px] text-gray-400 font-normal italic">{item.description}</p>
              </div>
              <p className="font-mono">{item.amount}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Batch Selector Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 space-y-6">
        <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2 uppercase tracking-widest">Select Training Batch</h3>
        <div className="space-y-5">
          {CLASS_TIMINGS.map((timing) => (
            <label key={timing.id} className="flex items-center gap-4 cursor-pointer group">
              <input
                type="radio"
                name="timing"
                checked={currentLead.class_timing === timing.label}
                onChange={() => setCurrentLead(prev => ({ ...prev, class_timing: timing.label }))}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
              <div className="space-y-1">
                <p className="text-sm text-gray-800 font-medium">{timing.label}</p>
                <p className="text-[10px] text-gray-400">Available via Offline/Online hybrid mode</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-6">
        <button
          onClick={handleProceed}
          disabled={isUpdating}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded shadow-sm transition-all text-sm uppercase tracking-widest disabled:opacity-50"
        >
          {isUpdating ? 'Updating...' : 'Confirm Enrollment'}
        </button>
        <button 
          onClick={onBack}
          className="flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Prospectus
        </button>
      </div>

      <footer className="py-8 text-center text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium italic opacity-60">
        Secured by Zenro Payment Gateway
      </footer>
    </div>
  );
}
