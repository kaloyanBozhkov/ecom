'use client';

import React from 'react';
import { ProductSpec } from '@/types/product';

interface SpecificationListProps {
  specifications: ProductSpec[];
  className?: string;
}

export const SpecificationList: React.FC<SpecificationListProps> = ({
  specifications,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {specifications.map((spec, index) => (
        <div
          key={index}
          className="flex justify-between items-start py-3 border-b border-gray-200 last:border-0"
        >
          <span className="text-gray-600 font-medium">{spec.label}</span>
          <span className="text-gray-900 text-right max-w-[60%]">{spec.value}</span>
        </div>
      ))}
    </div>
  );
};

