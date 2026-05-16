/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppView, TppLead } from './types';
import LeadForm from './components/LeadForm';
import SuccessView from './components/SuccessView';
import EnrollForm from './components/EnrollForm';
import ShopSeMock from './components/ShopSeMock';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<AppView>(AppView.FORM_QUALIFICATION);
  const [currentLead, setCurrentLead] = useState<Partial<TppLead>>({
    full_name: '',
    email: '',
    phone: '',
    status: 'lead'
  });
  const [isLoading, setIsLoading] = useState(false);

  // Smooth navigation with potential loading state
  const navigateTo = useCallback((nextView: AppView) => {
    setIsLoading(true);
    // Simulate a brief transition delay for "premium" feel
    setTimeout(() => {
      setView(nextView);
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-[#1A1A1A] overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-red-500/5 blur-[100px]" />
        <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-md mx-auto min-h-screen shadow-2xl bg-white sm:shadow-none">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50"
            >
              <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </motion.div>
          ) : null}

          <motion.div
            key={view}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {view === AppView.FORM_QUALIFICATION && (
              <LeadForm 
                currentLead={currentLead} 
                setCurrentLead={setCurrentLead} 
                onSuccess={() => navigateTo(AppView.SUCCESS_BROCHURE)} 
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
                  // Confirmation logic
                }}
                onCancel={() => navigateTo(AppView.ENROLL_FORM)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Sticky CTA area if needed - usually step components handle this */}
    </div>
  );
}
