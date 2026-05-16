import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, 
  Download, 
  Play, 
  ExternalLink, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { YOUTUBE_TESTIMONIALS } from '../constants';

interface SuccessViewProps {
  onEnroll: () => void;
}

export default function SuccessView({ onEnroll }: SuccessViewProps) {
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowOverlay(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Success Overlay Animation */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-white flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.6, times: [0, 0.7, 1] }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-black text-gray-900 mb-2"
            >
              Application Submitted!
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-500"
            >
              We've received your profile. You're one step closer to Japan!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="p-6 pb-32 space-y-10">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>You Are Qualified</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 leading-tight">
            Welcome to the <br />
            <span className="text-red-600">Japan Cohort '26</span>
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Your profile looks great. Based on your inputs, you are eligible for the Technical Intern Training Program (TITP) in Japan.
          </p>
        </div>

        {/* Brochure Download Section */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-red-600 to-red-700 text-white shadow-xl shadow-red-200"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Download className="w-24 h-24" />
          </div>
          <div className="relative z-10 space-y-4">
            <div>
              <h3 className="text-xl font-bold mb-1">Official Program Brochure</h3>
              <p className="text-red-100 text-sm opacity-90 italic">Everything you need to know about salary, housing & culture.</p>
            </div>
            <button 
              onClick={() => window.open('#', '_blank')}
              className="flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              Download Zenro TPP PDF
            </button>
          </div>
        </motion.div>

        {/* Testimonials Video Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Success Stories</h3>
            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold">LIVE FROM JAPAN</span>
          </div>
          
          <div className="space-y-6">
            {YOUTUBE_TESTIMONIALS.map((video) => (
              <div key={video.id} className="group relative rounded-3xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm transition-all hover:shadow-md">
                <div className="aspect-video relative overflow-hidden bg-gray-900 flex items-center justify-center">
                  <iframe 
                    className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                    src={`https://www.youtube.com/embed/${video.videoId}`} 
                    title={video.title}
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-all group-hover:bg-black/40">
                    <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                      <Play className="w-6 h-6 text-white fill-current" />
                    </div>
                  </div>
                </div>
                <div className="p-5 flex items-center justify-between">
                  <h4 className="font-bold text-gray-800 text-sm underline decoration-red-200 decoration-2 underline-offset-4">{video.title}</h4>
                  <ExternalLink className="w-4 h-4 text-gray-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-40 max-w-md mx-auto">
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent -z-10" />
        <button
          onClick={onEnroll}
          className="w-full bg-[#1A1A1A] hover:bg-black text-white font-bold py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-3 relative overflow-hidden group transition-all"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-white/5"
          />
          <span className="relative z-10 tracking-tight text-lg">SECURE MY SPOT NOW</span>
          <ChevronRight className="relative z-10 w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-center text-[10px] text-gray-400 mt-4 font-semibold uppercase tracking-widest">
          LIMITED SLOTS REMAINING FOR Q3 INTAKE
        </p>
      </div>
    </div>
  );
}
