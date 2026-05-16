import React from 'react';
import { 
  Download, 
  ExternalLink, 
  Play
} from 'lucide-react';
import { YOUTUBE_TESTIMONIALS } from '../constants';

interface SuccessViewProps {
  onEnroll: () => void;
}

export default function SuccessView({ onEnroll }: SuccessViewProps) {
  return (
    <div className="space-y-4 px-3 sm:px-0">
      {/* Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="h-2 bg-green-500" />
        <div className="p-6 md:p-8 space-y-4">
          <h1 className="text-2xl md:text-3xl font-normal text-gray-900">Application Successfully Submitted</h1>
          <p className="text-sm text-gray-700 leading-relaxed">
            Your profile has been received. You are eligible to proceed with the program enrollment. 
            Please review the resources below.
          </p>
        </div>
      </div>

      {/* Brochure Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 flex items-center justify-between shadow-sm">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-900">Zenro TPP Brochure</h3>
          <p className="text-xs text-gray-500">Program details & curriculum</p>
        </div>
        <button 
          onClick={() => window.open('#', '_blank')}
          className="flex items-center gap-2 text-indigo-600 font-medium text-sm hover:underline"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      {/* Testimonials */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 space-y-6 shadow-sm">
        <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2">Student Testimonials</h3>
        <div className="grid gap-6">
          {YOUTUBE_TESTIMONIALS.map((video) => (
            <div key={video.id} className="group cursor-pointer">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative flex items-center justify-center border border-gray-200">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 text-indigo-600 fill-current" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">{video.title}</p>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="py-8 space-y-4">
        <button
          onClick={onEnroll}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg shadow-sm transition-all text-sm uppercase tracking-wide"
        >
          Proceed to Enrollment
        </button>
        <p className="text-center text-[10px] text-gray-400 font-medium uppercase tracking-widest">
          Limited availability for upcoming cohort
        </p>
      </div>
    </div>
  );
}
