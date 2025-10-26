'use client';

import React from 'react';
import { Icon, IconName } from '@/components/atoms/Icon';

interface TrustBadgeProps {
  icon: IconName;
  text: string;
  className?: string;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ icon, text, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Icon name={icon} className="text-green-600" size={20} />
      <span className="text-sm text-gray-700 font-medium">{text}</span>
    </div>
  );
};

