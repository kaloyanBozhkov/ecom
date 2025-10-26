import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create the SafeHeat product
  const product = await prisma.product.upsert({
    where: { slug: 'safeheat-propane-heater' },
    update: {},
    create: {
      name: 'SafeHeat™ Propane Garage Heater',
      slug: 'safeheat-propane-heater',
      tagline: 'Powerful, Portable & Safe for Indoor Use',
      description: 'Built for garages, workshops & basements — instant heat without smoke or smell. The SafeHeat™ delivers powerful, consistent warmth exactly where you need it, with industry-leading safety features designed specifically for enclosed spaces.',
      price: 179.99,
      original_price: 249.99,
      currency: 'USD',
      badge: 'Best Seller',
      in_stock: true,
      images: [
        {
          id: 'img-1',
          url: '/images/heater-front.jpg',
          alt: 'SafeHeat Propane Heater Front View',
        },
        {
          id: 'img-2',
          url: '/images/heater-side.jpg',
          alt: 'SafeHeat Propane Heater Side View',
        },
        {
          id: 'img-3',
          url: '/images/heater-action.jpg',
          alt: 'SafeHeat Propane Heater in Garage',
        },
      ],
      features: [
        {
          id: 'feat-1',
          title: 'Powerful BTU Output',
          description: '9,000–18,000 BTU adjustable heat settings for maximum comfort',
          icon: 'flame',
        },
        {
          id: 'feat-2',
          title: 'Indoor-Safe Design',
          description: 'Auto shut-off + oxygen depletion sensor for complete peace of mind',
          icon: 'shield-check',
        },
        {
          id: 'feat-3',
          title: 'Fast Heating',
          description: 'Heats up to 500 sq ft in minutes, not hours',
          icon: 'zap',
        },
        {
          id: 'feat-4',
          title: 'Universal Compatibility',
          description: 'Works with all standard propane tanks (20 lb recommended)',
          icon: 'check-circle',
        },
        {
          id: 'feat-5',
          title: 'Fast U.S. Shipping',
          description: 'Ships from our U.S. warehouse — arrives in 2-5 business days',
          icon: 'truck',
        },
        {
          id: 'feat-6',
          title: 'Portable Design',
          description: 'Lightweight and easy to move between spaces',
          icon: 'move',
        },
      ],
      specifications: [
        { label: 'Heat Output', value: '9,000 - 18,000 BTU' },
        { label: 'Coverage Area', value: 'Up to 500 sq ft' },
        { label: 'Fuel Type', value: 'Propane (standard tanks)' },
        {
          label: 'Safety Features',
          value: 'Oxygen depletion sensor, auto shut-off, tip-over protection',
        },
        { label: 'Dimensions', value: '18" H x 12" W x 10" D' },
        { label: 'Weight', value: '12 lbs (without tank)' },
        { label: 'Ignition Type', value: 'Piezo electric ignition' },
        { label: 'Warranty', value: '2-year manufacturer warranty' },
      ],
      safety_features: [
        'Oxygen Depletion Sensor (ODS) - automatically shuts off if oxygen levels drop',
        'Tip-over safety switch - instantly cuts gas flow if knocked over',
        'Overheat protection - prevents surface temperatures from becoming dangerous',
        'CSA certified for indoor use in well-ventilated spaces',
        'Low-emission burner technology - cleaner burn, less odor',
      ],
      certifications: ['CSA Certified', 'EPA Compliant', 'ANSI Z21.97 Standard'],
    },
  });

  console.log('✅ Created product:', product.name);
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

