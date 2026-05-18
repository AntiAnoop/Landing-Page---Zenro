import React from 'react';
import { 
  FileText, 
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
    <div className="space-y-4">
      {/* Success Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-8 md:p-10 flex flex-col items-center space-y-6">
          <CheckCircle2 className="w-16 h-16 text-green-500" strokeWidth={1.5} />
          <div className="space-y-3 text-center">
            <h1 className="text-2xl md:text-3xl font-normal text-gray-900">Application Submitted</h1>
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
              Your profile has been received. You are eligible to proceed with the program enrollment. 
            </p>
          </div>
        </div>
      </div>

      {/* Brochure Card */}
      <div 
        onClick={() => window.open('#', '_blank')}
        className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 flex items-center justify-between group hover:border-blue-600 transition-all cursor-pointer shadow-sm hover:shadow-md"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
            <FileText className="w-6 h-6 text-red-500" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-base font-medium text-gray-900">Zenro's Brochure</h3>
            <p className="text-xs text-gray-400">PDF Document • 2.4 MB</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
      </div>

      {/* Video Grid */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-8 space-y-6">
        <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2 uppercase tracking-widest">Take a Look at Zenro's Program</h3>
        
        <div className="grid grid-cols-2 gap-3 md:gap-6 pb-2">
          {YOUTUBE_TESTIMONIALS.map((video) => (
            <div key={video.id} className="w-full">
              <div className="aspect-[9/16] bg-gray-100 rounded-xl overflow-hidden relative border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <iframe 
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${video.videoId}?rel=0&modestbranding=1`} 
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final Action Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-10 space-y-8 text-center">
        <h3 className="text-xl md:text-2xl font-normal text-gray-900">Ready to Enroll with Zenro?</h3>
        <button
          onClick={onEnroll}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all text-sm uppercase tracking-widest active:scale-95 flex items-center justify-center gap-2"
        >
          Enroll Now
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <footer className="py-8 text-center">
        {/* Placeholder for legal links or support contact */}
      </footer>
    </div>
  );
}
