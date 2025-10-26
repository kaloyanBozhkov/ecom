import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/data/productService';
import { ProductDetails, FeaturesSection, SafetySection } from '@/components/organisms';
import { Container, Card, CardContent } from '@/components/atoms';
import { Icon } from '@/components/atoms/Icon';

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductDetails product={product} />

      <FeaturesSection 
        title="Key Features"
        subtitle="Everything you need for safe, reliable heating"
        features={product.features} 
      />

      <SafetySection
        safetyFeatures={product.safetyFeatures}
        certifications={product.certifications}
      />

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple setup, powerful performance
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                title: "Connect Propane",
                description: "Attach your standard propane tank using the included hose and regulator"
              },
              {
                step: 2,
                title: "Position Heater",
                description: "Place on a level surface in a well-ventilated area, away from flammable materials"
              },
              {
                step: 3,
                title: "Ignite & Adjust",
                description: "Use the piezo ignition to light, then adjust heat output from 9,000-18,000 BTU"
              },
              {
                step: 4,
                title: "Enjoy Warmth",
                description: "Relax as SafeHeat™ quickly brings your space to a comfortable temperature"
              }
            ].map((step) => (
              <Card key={step.step} className="border-gray-200 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-orange-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* What's Included Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <Container size="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What's Included
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              "SafeHeat™ Propane Heater Unit",
              "Propane Hose & Regulator",
              "User Manual & Safety Guide",
              "2-Year Warranty Card",
              "Quick Start Guide",
              "Customer Support Contact Info"
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Icon name="check" className="text-green-600" size={16} />
                </div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Reviews Section */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Customer Reviews
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="star" className="text-yellow-500 fill-yellow-500" size={24} />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900">4.8 out of 5</span>
              <span className="text-gray-600">(2,340 reviews)</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Robert Martinez",
                rating: 5,
                date: "2 weeks ago",
                verified: true,
                text: "This heater is a game-changer! My garage used to be freezing, now I can work comfortably even in winter. The safety features are top-notch."
              },
              {
                name: "Lisa Chen",
                rating: 5,
                date: "1 month ago",
                verified: true,
                text: "Excellent product. Easy to set up, powerful heat output, and the oxygen sensor gives me peace of mind when using it in my basement."
              },
              {
                name: "David Thompson",
                rating: 4,
                date: "3 weeks ago",
                verified: true,
                text: "Great heater overall. Heats up quickly and efficiently. Would give 5 stars but wish it came with a carrying case for easier portability."
              },
              {
                name: "Jennifer Brown",
                rating: 5,
                date: "1 week ago",
                verified: true,
                text: "Best purchase I've made this year. Works exactly as advertised. My workshop is finally usable in the cold months!"
              },
              {
                name: "Michael Wong",
                rating: 5,
                date: "2 months ago",
                verified: true,
                text: "Impressed with the build quality and safety features. Burns clean with no smell. Highly recommend for anyone with a garage or workshop."
              },
              {
                name: "Amanda Davis",
                rating: 5,
                date: "1 month ago",
                verified: true,
                text: "My husband loves this heater! He spends hours in the garage working on projects now. Fast shipping and great customer service too."
              }
            ].map((review, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Icon key={i} name="star" className="text-yellow-500 fill-yellow-500" size={14} />
                      ))}
                    </div>
                    {review.verified && (
                      <span className="text-xs text-green-600 font-medium">✓ Verified Purchase</span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed text-sm">"{review.text}"</p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

