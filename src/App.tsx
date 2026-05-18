/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppView, TppLead } from './types';
import LeadForm from './components/LeadForm';
import SuccessView from './components/SuccessView';
import EnrollForm from './components/EnrollForm';
import ShopSeMock from './components/ShopSeMock';
import { isSupabaseConfigured } from './lib/supabase';

export default function App() {
  const [view, setView] = useState<AppView>(AppView.FORM_QUALIFICATION);
  const [currentLead, setCurrentLead] = useState<Partial<TppLead>>({
    full_name: '',
    email: '',
    phone: '',
    language_willingness: '',
    education: '',
    job_role: '',
    investment_comfort: '',
    achievement: '',
    why_japan: '',
    state: '',
    city: '',
    class_timing: '',
    status: 'lead'
  });
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const navigateTo = useCallback((nextView: AppView) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView(nextView);
  }, []);

  const handleFormSuccess = useCallback(() => {
    setShowSuccessOverlay(true);
    // Punchy success message then redirect
    setTimeout(() => {
      setShowSuccessOverlay(false);
      navigateTo(AppView.SUCCESS_BROCHURE);
    }, 2000);
  }, [navigateTo]);

  return (
    <div className="min-h-screen bg-[#F0EBF8] font-sans text-[#202124] selection:bg-blue-100">
      <main className="max-w-2xl mx-auto pt-6 pb-20 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {view === AppView.FORM_QUALIFICATION && (
              <LeadForm 
                currentLead={currentLead} 
                setCurrentLead={setCurrentLead} 
                onSuccess={handleFormSuccess} 
              />
            )}
            {view === AppView.SUCCESS_BROCHURE && (
              <SuccessView 
                onEnroll={() => navigateTo(AppView.ENROLL_FORM)} 
              />
            )}
            {view === AppView.ENROLL_FORM && (
              <EnrollForm 
                currentLead={currentLead}
                setCurrentLead={setCurrentLead}
                onProceed={() => navigateTo(AppView.PAYMENT_MOCK)}
                onBack={() => navigateTo(AppView.SUCCESS_BROCHURE)}
              />
            )}
            {view === AppView.PAYMENT_MOCK && (
              <ShopSeMock 
                currentLead={currentLead}
                onSuccess={() => {
                  setCurrentLead(prev => ({ ...prev, status: 'enrolled' }));
                }}
                onCancel={() => navigateTo(AppView.ENROLL_FORM)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
