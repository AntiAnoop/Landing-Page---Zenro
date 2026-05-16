import React, { useState } from 'react';
import { motion } from 'motion/react';
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
import { supabase, handleSupabaseError } from '../lib/supabase';

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
    
    setIsUpdating(true);
    const { error } = await supabase
      .from('tpp_leads')
      .update({ class_timing: currentLead.class_timing })
      .eq('phone', currentLead.phone);

    if (error) {
      handleSupabaseError(error, 'update_timing');
      setIsUpdating(false);
    } else {
      onProceed();
    }
  };

  return (
    <div className="p-6 pb-32 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Navigation */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 text-sm font-medium hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to brochure
      </button>

      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 leading-tight">
          Enrollment <br />
          <span className="text-red-600">Final Step</span>
        </h1>
        <p className="text-gray-500 text-sm">
          Select your training schedule and review the subsidized fee structure for Indian candidates.
        </p>
      </div>

      {/* Fees Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <CircleDollarSign className="w-4 h-4 text-red-600" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Fees Structure</h3>
        </div>
        
        <div className="bg-gray-50 border border-gray-100 rounded-3xl overflow-hidden">
          {FEES_STRUCTURE.map((item, idx) => (
            <div 
              key={item.stage} 
              className={`p-5 flex items-start justify-between ${idx !== FEES_STRUCTURE.length - 1 ? 'border-bottom border-gray-100' : 'bg-red-50 text-red-700'}`}
            >
              <div className="space-y-1">
                <p className="font-bold text-sm">{item.stage}</p>
                <p className={`text-[10px] ${idx === FEES_STRUCTURE.length - 1 ? 'text-red-600/70' : 'text-gray-400'}`}>
                  {item.description}
                </p>
              </div>
              <p className="font-black text-sm">{item.amount}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-bold uppercase tracking-wider">
          <Info className="w-3 h-3" />
          <span>No-Cost EMI available via ShopSe Financing</span>
        </div>
      </div>

      {/* Class Timing Selector */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-red-600" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Training Schedule</h3>
        </div>

        <div className="space-y-3">
          {CLASS_TIMINGS.map((timing) => (
            <button
              key={timing.id}
              onClick={() => setCurrentLead(prev => ({ ...prev, class_timing: timing.label }))}
              className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all group ${
                currentLead.class_timing === timing.label 
                ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-200' 
                : 'bg-white border-gray-100 text-gray-600 hover:border-red-100'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  currentLead.class_timing === timing.label ? 'bg-white/20' : 'bg-gray-50 group-hover:bg-red-50'
                }`}>
                  <Calendar className={`w-5 h-5 ${
                    currentLead.class_timing === timing.label ? 'text-white' : 'text-gray-400 group-hover:text-red-500'
                  }`} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">{timing.label}</p>
                  <p className={`text-[10px] font-medium ${
                    currentLead.class_timing === timing.label ? 'text-red-100' : 'text-gray-400'
                  }`}>Limited seats available</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                currentLead.class_timing === timing.label ? 'border-white bg-white' : 'border-gray-200'
              }`}>
                {currentLead.class_timing === timing.label && <div className="w-2 h-2 rounded-full bg-red-600" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Pay CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-40 max-w-md mx-auto">
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent -z-10" />
        <button
          onClick={handleProceed}
          disabled={isUpdating}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 rounded-2xl shadow-2xl flex flex-col items-center justify-center transition-all disabled:bg-gray-400"
        >
          {isUpdating ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span className="tracking-tight text-lg flex items-center gap-2">
                PROCEED TO FINANCING
                <ChevronRight className="w-5 h-5" />
              </span>
              <span className="text-[10px] opacity-70 uppercase tracking-widest mt-1">Powered by ShopSe</span>
            </>
          )}
        </button>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" />
            <span>Encrypted Payment</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-200" />
          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <TrendingDown className="w-3 h-3" />
            <span>0% Interest EMI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
