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
    status: 'lead'
  });

  const navigateTo = useCallback((nextView: AppView) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView(nextView);
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans text-gray-900 selection:bg-indigo-100">
      {/* Google Forms-style top accent bar */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-indigo-600 z-50" />

      {!isSupabaseConfigured && (
        <div className="fixed top-4 left-4 right-4 z-50 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg shadow-sm">
          <strong>Configuration Required:</strong> Supabase environment variables are missing. Lead capture will not save to the database.
        </div>
      )}

      <main className="max-w-screen-sm mx-auto pt-6 pb-20 px-0 sm:px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
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
