import React from 'react';
import { 
  Download, 
  Play,
  CheckCircle2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { YOUTUBE_TESTIMONIALS } from '../constants';

interface SuccessViewProps {
  onEnroll: () => void;
}

export default function SuccessView({ onEnroll }: SuccessViewProps) {
  return (
    <div className="space-y-3">
      {/* Success Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8 space-y-4">
          <h1 className="text-2xl md:text-3xl font-normal text-gray-900 text-center">Application Submitted</h1>
          <p className="text-sm text-gray-700 leading-relaxed text-center">
            Your profile has been received. You are eligible to proceed with the program enrollment. 
            Please review the resources below.
          </p>
        </div>
      </div>

      {/* Brochure Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 flex items-center justify-between group hover:border-blue-600 transition-colors">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-900">Official 2026 Prospectus</h3>
          <p className="text-xs text-gray-400">Detailed curriculum, salary charts & job domains.</p>
        </div>
        <button 
          onClick={() => window.open('#', '_blank')}
          className="flex items-center gap-2 text-blue-600 font-medium text-sm hover:underline"
        >
          <Download className="w-5 h-5" />
          Download PDF
        </button>
      </div>

      {/* Video Carousel Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 space-y-6">
        <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2 uppercase tracking-widest">Student Life in Japan</h3>
        
        <div className="flex overflow-x-auto gap-4 no-scrollbar -mx-2 px-2 snap-x snap-mandatory">
          {YOUTUBE_TESTIMONIALS.map((video) => (
            <div key={video.id} className="min-w-[280px] sm:min-w-[320px] snap-center group cursor-pointer space-y-3">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200">
                <iframe 
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${video.videoId}?autoplay=0&rel=0`} 
                  title={video.title}
                  loading="lazy"
                />
              </div>
              <p className="text-xs font-medium text-gray-500 px-1 truncate">{video.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final Action Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-900">Next Step: Training Schedule</h3>
          <p className="text-xs text-gray-500 italic">Select your preferred batch timing to finalize your enrollment.</p>
        </div>
        <button
          onClick={onEnroll}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-sm transition-all text-sm uppercase tracking-widest active:scale-95"
        >
          Proceed to Scheduling
        </button>
      </div>

      <footer className="py-8 text-center">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
          Zenro Global Assessment Dashboard
        </p>
      </footer>
    </div>
  );
}
