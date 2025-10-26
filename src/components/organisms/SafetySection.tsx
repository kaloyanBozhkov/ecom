'use client';

import React from 'react';
import { Container, Card, CardContent, Badge } from '@/components/atoms';
import { SafetyFeatureItem } from '@/components/molecules';

interface SafetySectionProps {
  safetyFeatures: string[];
  certifications: string[];
}

export const SafetySection: React.FC<SafetySectionProps> = ({
  safetyFeatures,
  certifications,
}) => {
  return (
    <section className="py-16 md:py-24 bg-green-50">
      <Container>
        <div className="text-center mb-12">
          <Badge className="bg-green-600 text-white mb-4">Safety First</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Safe Propane Heat for Enclosed Spaces
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your top concern is safety. That's why SafeHeat™ is engineered with multiple 
            redundant safety systems to protect you and your family.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="border-green-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Advanced Safety Features
              </h3>
              <div className="space-y-4">
                {safetyFeatures.map((feature, index) => (
                  <SafetyFeatureItem key={index} text={feature} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Industry Certifications
              </h3>
              <div className="space-y-6">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-green-700">✓</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{cert}</p>
                      <p className="text-sm text-gray-600">Verified & Tested</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Important Safety Notice</h4>
              <p className="text-gray-700 leading-relaxed">
                Always use this heater in well-ventilated areas. While SafeHeat™ includes multiple safety features, 
                proper ventilation is essential for safe operation. Never use in completely sealed rooms. 
                Read all safety instructions before use.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

