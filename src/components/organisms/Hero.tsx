'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Badge, Container } from '@/components/atoms';
import { TrustBadge } from '@/components/molecules';
import { Icon } from '@/components/atoms/Icon';

interface HeroProps {
  title: string;
  tagline: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  badge?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  tagline,
  description,
  ctaText = 'Shop Now',
  ctaLink = '/product/safeheat-propane-heater',
  badge,
}) => {
  return (
    <section className="bg-linear-to-b from-orange-50 to-white py-16 md:py-24">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6">
            {badge && (
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 text-sm px-4 py-1">
                {badge}
              </Badge>
            )}
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              {title}
            </h1>
            
            <p className="text-xl md:text-2xl text-orange-600 font-semibold">
              {tagline}
            </p>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              {description}
            </p>

            <div className="pt-4">
              <Link href={ctaLink}>
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto">
                  {ctaText}
                  <Icon name="chevron-right" size={20} className="ml-2" />
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 pt-6 border-t border-gray-200">
              <TrustBadge icon="truck" text="Free U.S. Shipping" />
              <TrustBadge icon="shield-check" text="2-Year Warranty" />
              <TrustBadge icon="check-circle" text="CSA Certified" />
            </div>
          </div>

          {/* Right Column - Product Image Placeholder */}
          <div className="relative">
            <div className="aspect-square bg-linear-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <Icon name="flame" size={120} className="text-orange-500 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Product Image</p>
              </div>
            </div>
            {/* Floating Badge */}
            <div className="absolute top-4 right-4 bg-white rounded-full px-4 py-2 shadow-lg">
              <p className="text-sm font-semibold text-gray-900">⭐ 4.8/5.0</p>
              <p className="text-xs text-gray-500">2,340 reviews</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

