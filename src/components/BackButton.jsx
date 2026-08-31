import React from 'react';

export default function BackButton({ className = "", label = "Back" }) {
  return (
    <div className={`flex justify-start ${className}`}>
      <button 
        onClick={() => {
          if (window.history.length > 2) {
            window.history.back();
          } else {
            window.location.href = '/';
          }
        }}
        className="flex items-center space-x-2 text-[13px] md:text-[14px] text-[#616F3E] hover:text-[#203348] font-semibold transition-colors cursor-pointer"
        title="Go Back"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>{label}</span>
      </button>
    </div>
  );
}
