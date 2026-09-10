import React from 'react';
import { Info } from 'lucide-react';
import { environmentalFactors } from '../utils/environmental';

interface DisclaimerNoticeProps {
  customText?: string;
  className?: string;
}

export const DisclaimerNotice: React.FC<DisclaimerNoticeProps> = ({ customText, className = '' }) => {
  return (
    <div
      role="note"
      className={`flex items-start gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3 text-xs text-emerald-800 ${className}`}
    >
      <Info className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" aria-hidden="true" />
      <span className="leading-relaxed">
        {customText || environmentalFactors.disclaimer}
      </span>
    </div>
  );
};
