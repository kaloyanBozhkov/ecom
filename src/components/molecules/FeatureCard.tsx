'use client';

import React from 'react';
import { Card, CardContent } from '@/components/atoms';
import { Icon, IconName } from '@/components/atoms/Icon';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: IconName;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  className = '',
}) => {
  return (
    <Card className={`border-gray-200 hover:border-orange-300 transition-colors ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
            <Icon name={icon} className="text-orange-600" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

