import React, { useState } from 'react';
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
    <div className="space-y-4 px-3 sm:px-0">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="h-2 bg-indigo-600" />
        <div className="p-6 md:p-8 space-y-4">
          <h1 className="text-2xl font-normal text-gray-900">Enrollment & Scheduling</h1>
          <p className="text-sm text-gray-700 leading-relaxed border-b border-gray-100 pb-4">
            Finalize your training details and review the fee structure.
          </p>
        </div>
      </div>

      {/* Fees Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 space-y-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2">Program Fees</h3>
        <div className="space-y-0 text-sm">
          {FEES_STRUCTURE.map((item, idx) => (
            <div 
              key={item.stage} 
              className={`py-3 flex justify-between items-center ${idx !== FEES_STRUCTURE.length - 1 ? 'border-b border-gray-50' : 'pt-4 font-bold text-indigo-600'}`}
            >
              <div className="space-y-0.5">
                <p>{item.stage}</p>
                <p className="text-[10px] text-gray-400 font-normal">{item.description}</p>
              </div>
              <p>{item.amount}</p>
            </div>
          ))}
        </div>
        <div className="bg-indigo-50/50 p-3 rounded text-[10px] text-indigo-700 leading-relaxed">
          <strong>Note:</strong> Financing options are available at the next step via our partner gateway.
        </div>
      </div>

      {/* Timing Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 space-y-6 shadow-sm">
        <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2">Select Class Batch</h3>
        <div className="space-y-4">
          {CLASS_TIMINGS.map((timing) => (
            <label key={timing.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="timing"
                checked={currentLead.class_timing === timing.label}
                onChange={() => setCurrentLead(prev => ({ ...prev, class_timing: timing.label }))}
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 accent-indigo-600"
              />
              <div className="text-sm">
                <p className="text-gray-800">{timing.label}</p>
                <p className="text-[10px] text-gray-400">Available across all training centers</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="py-8 flex flex-col gap-4">
        <button
          onClick={handleProceed}
          disabled={isUpdating}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg shadow-sm transition-all text-sm uppercase tracking-wide disabled:opacity-50"
        >
          {isUpdating ? 'Updating...' : 'Proceed to Payment'}
        </button>
        <button 
          onClick={onBack}
          className="text-xs text-gray-400 text-center hover:underline"
        >
          Go back to brochure
        </button>
      </div>
    </div>
  );
}
