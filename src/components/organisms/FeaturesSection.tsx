'use client';

import React from 'react';
import { Container } from '@/components/atoms';
import { FeatureCard } from '@/components/molecules';
import { ProductFeature } from '@/types/product';

interface FeaturesSectionProps {
  title?: string;
  subtitle?: string;
  features: ProductFeature[];
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  title = 'Why Choose SafeHeat™?',
  subtitle = 'Built with your safety and comfort in mind',
  features,
}) => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              title={feature.title}
              description={feature.description}
              icon={feature.icon as any}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

