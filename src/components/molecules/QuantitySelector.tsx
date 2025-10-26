'use client';

import React from 'react';
import { Button } from '@/components/atoms';
import { Icon } from '@/components/atoms/Icon';

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  className?: string;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  min = 1,
  max = 99,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        onClick={onDecrement}
        disabled={quantity <= min}
        className="h-10 w-10"
      >
        <Icon name="minus" size={16} />
      </Button>
      <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
      <Button
        variant="outline"
        size="icon"
        onClick={onIncrement}
        disabled={quantity >= max}
        className="h-10 w-10"
      >
        <Icon name="plus" size={16} />
      </Button>
    </div>
  );
};

