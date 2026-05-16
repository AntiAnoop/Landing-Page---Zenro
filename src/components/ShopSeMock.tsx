import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { TppLead } from '../types';
import { supabase, handleSupabaseError, isSupabaseConfigured } from '../lib/supabase';

interface ShopSeMockProps {
  currentLead: Partial<TppLead>;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ShopSeMock({ currentLead, onSuccess, onCancel }: ShopSeMockProps) {
  const [step, setStep] = useState<'NUMBER' | 'OTP' | 'PROCESSING' | 'CONFIRMED'>('NUMBER');
  const [phone, setPhone] = useState(currentLead.phone || '');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');

  const sendOtp = () => {
    if (phone.length < 10) {
      setError('Please enter a valid mobile number');
      return;
    }
    setError('');
    setStep('OTP');
  };

  const verifyOtp = async () => {
    if (otp.join('').length < 4) {
      setError('Complete your OTP');
      return;
    }
    
    setError('');
    setStep('PROCESSING');
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (!isSupabaseConfigured) {
      setStep('CONFIRMED');
      onSuccess();
      return;
    }

    try {
      const { error: supaError } = await supabase
        .from('tpp_leads')
        .update({ status: 'enrolled' })
        .eq('phone', currentLead.phone);

      if (supaError) throw supaError;
      setStep('CONFIRMED');
      onSuccess();
    } catch (err: any) {
      handleSupabaseError(err, 'payment_enrollment_update');
      setError('Verification failed. Try again.');
      setStep('OTP');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[1px] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-sm bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-orange-600 italic">ShopSe</span>
            <span className="text-xs text-gray-400">Financing Portal</span>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 text-xs font-medium">Cancel</button>
        </div>

        <div className="p-8 pb-10 min-h-[320px] flex flex-col">
          <AnimatePresence mode="wait">
            {step === 'NUMBER' && (
              <motion.div key="n" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-lg font-medium text-gray-900 uppercase tracking-tight">Loan Eligibility</h2>
                  <p className="text-xs text-gray-500">Confirm your mobile number to get an instant credit decision.</p>
                </div>
                <div className="space-y-4">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-200 rounded p-3 text-lg font-medium outline-none focus:border-orange-500 bg-gray-50/50"
                  />
                  {error && <p className="text-[10px] text-red-600">{error}</p>}
                  <button onClick={sendOtp} className="w-full bg-orange-600 text-white py-3 rounded font-medium text-sm transition-colors hover:bg-orange-700 uppercase tracking-wide shadow-sm">
                    Continue Securely
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'OTP' && (
              <motion.div key="o" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-lg font-medium text-gray-900 uppercase tracking-tight">Verify Identity</h2>
                  <p className="text-xs text-gray-500">OTP sent to {phone}</p>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between gap-3">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="number"
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        className="w-full h-12 border border-gray-200 rounded text-center text-xl font-medium outline-none focus:border-orange-500"
                      />
                    ))}
                  </div>
                  <button onClick={verifyOtp} className="w-full bg-orange-600 text-white py-3 rounded font-medium text-sm uppercase tracking-wide">
                    Verify OTP
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'PROCESSING' && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-orange-600 rounded-full animate-spin" />
                <p className="text-xs text-gray-500 animate-pulse">Requesting Approval...</p>
              </div>
            )}

            {step === 'CONFIRMED' && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center font-bold text-xl">✓</div>
                <h2 className="text-lg font-medium text-gray-900">Approved</h2>
                <p className="text-xs text-gray-500 px-4">Your enrollment has been successfully financed. Welcome to Zenro.</p>
                <button onClick={onCancel} className="text-indigo-600 text-xs font-medium uppercase mt-4">Close Portal</button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
