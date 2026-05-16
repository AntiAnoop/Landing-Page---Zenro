import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Smartphone, 
  Lock, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { TppLead } from '../types';
import { supabase, handleSupabaseError } from '../lib/supabase';

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
      setError('Please enter the complete 4-digit OTP');
      return;
    }
    
    setError('');
    setStep('PROCESSING');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update lead status to 'enrolled' in Supabase
    const { error: supaError } = await supabase
      .from('tpp_leads')
      .update({ status: 'enrolled' })
      .eq('phone', currentLead.phone);

    if (supaError) {
      handleSupabaseError(supaError, 'payment_enrollment_update');
      setError('Connection lost. Please try again.');
      setStep('OTP');
    } else {
      setStep('CONFIRMED');
      onSuccess();
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A1A] flex items-end sm:items-center justify-center sm:p-4">
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden flex flex-col min-h-[70vh] sm:min-h-0"
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black italic">S</div>
            <span className="font-bold text-gray-900 tracking-tight">ShopSe Financing</span>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 p-8 space-y-8">
          <AnimatePresence mode="wait">
            {step === 'NUMBER' && (
              <motion.div 
                key="number"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2 text-center">
                  <h2 className="text-xl font-black text-gray-900">Check Loan Eligibility</h2>
                  <p className="text-sm text-gray-500">Enter your registered mobile number to continue with 0% EMI.</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-2 border-r border-gray-200">
                      <span className="text-gray-400 font-bold text-sm">+91</span>
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter mobile number"
                      className="w-full pl-16 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none font-bold text-lg"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-600 text-xs font-medium">
                      <AlertCircle className="w-3 h-3" />
                      {error}
                    </div>
                  )}

                  <button
                    onClick={sendOtp}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-orange-100 flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Send Secure OTP</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  <Lock className="w-3 h-3" />
                  <span>RBI Regulated Partner</span>
                </div>
              </motion.div>
            )}

            {step === 'OTP' && (
              <motion.div 
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2 text-center">
                  <h2 className="text-xl font-black text-gray-900">Verify OTP</h2>
                  <p className="text-sm text-gray-500 text-center">We've sent a 4-digit code to <br /><span className="font-black text-gray-900">+91 {phone}</span></p>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-center gap-4">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="number"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-xl text-center text-2xl font-black text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                      />
                    ))}
                  </div>

                  {error && (
                    <div className="text-center text-red-600 text-xs font-medium">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={verifyOtp}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-orange-100 transition-all"
                  >
                    Verify & Proceed
                  </button>

                  <button className="w-full text-xs font-bold text-orange-500 uppercase tracking-widest text-center">
                    Resend Code in 0:45
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'PROCESSING' && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center space-y-6 py-12"
              >
                <div className="relative">
                  <Loader2 className="w-16 h-16 text-orange-500 animate-spin" />
                  <ShieldCheck className="absolute inset-0 m-auto w-6 h-6 text-orange-500" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-black text-gray-900">Validating Credit</h2>
                  <p className="text-sm text-gray-500">Checking your eligibility with partner banks...</p>
                </div>
              </motion.div>
            )}

            {step === 'CONFIRMED' && (
              <motion.div 
                key="confirmed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center space-y-6 py-12"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black text-gray-900">Enrollment Approved!</h2>
                  <p className="text-sm text-gray-500">Congratulations! Your finance request for Zenro TPP has been approved instantly.</p>
                </div>
                <button
                  onClick={onCancel}
                  className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
                >
                  Go to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 bg-gray-50 flex items-center justify-center gap-8">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" alt="UPI" className="h-4 opacity-30 grayscale" />
          <div className="h-4 w-px bg-gray-200" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Mastercard_logo.svg/1000px-Mastercard_logo.svg.png" alt="Mastercard" className="h-4 opacity-30 grayscale" />
          <div className="h-4 w-px bg-gray-200" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2000px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4 opacity-30 grayscale" />
        </div>
      </motion.div>
    </div>
  );
}
