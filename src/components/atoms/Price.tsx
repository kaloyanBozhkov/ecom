import React from 'react';

interface PriceProps {
  amount: number;
  currency?: string;
  originalAmount?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Price: React.FC<PriceProps> = ({ 
  amount, 
  currency = 'USD', 
  originalAmount,
  className = '',
  size = 'md'
}) => {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(value);
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  const originalSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
    xl: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`font-bold text-gray-900 ${sizeClasses[size]}`}>
        {formatPrice(amount)}
      </span>
      {originalAmount && originalAmount > amount && (
        <span className={`text-gray-500 line-through ${originalSizeClasses[size]}`}>
          {formatPrice(originalAmount)}
        </span>
      )}
    </div>
  );
};

