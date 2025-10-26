'use client';

import React from 'react';
import { Icon } from '@/components/atoms/Icon';

interface SafetyFeatureItemProps {
  text: string;
  className?: string;
}

export const SafetyFeatureItem: React.FC<SafetyFeatureItemProps> = ({
  text,
  className = '',
}) => {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="shrink-0 mt-0.5">
        <Icon name="shield-check" className="text-green-600" size={20} />
      </div>
      <p className="text-gray-700 leading-relaxed">{text}</p>
    </div>
  );
};

