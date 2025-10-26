import { Hero, FeaturesSection, SafetySection } from '@/components/organisms';
import { getFeaturedProduct } from '@/data/productService';
import { Container, Button, Card, CardContent } from '@/components/atoms';
import Link from 'next/link';
import { Icon } from '@/components/atoms/Icon';

export default async function Home() {
  const product = await getFeaturedProduct();

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <>
      <Hero
        title={product.name}
        tagline={product.tagline}
        description={product.description}
        badge={product.badge}
      />

      <FeaturesSection features={product.features} />

      <SafetySection
        safetyFeatures={product.safetyFeatures}
        certifications={product.certifications}
      />

      {/* Social Proof Section */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands of Homeowners
            </h2>
            <p className="text-lg text-gray-600">
              See what our customers are saying
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Mike Johnson",
                rating: 5,
                text: "Best garage heater I've ever owned. Heats up my 400 sq ft workshop in minutes. The safety features give me peace of mind.",
                location: "Detroit, MI"
              },
              {
                name: "Sarah Williams",
                rating: 5,
                text: "I was worried about CO₂ safety, but this heater has an oxygen sensor that shuts it off automatically. Works perfectly in my basement workshop.",
                location: "Portland, OR"
              },
              {
                name: "Tom Anderson",
                rating: 5,
                text: "Portable and powerful. I move it between my garage and shed. No smell, no smoke, just instant heat. Worth every penny.",
                location: "Denver, CO"
              }
            ].map((review, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Icon key={i} name="star" className="text-yellow-500 fill-yellow-500" size={16} />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">"{review.text}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-linear-to-r from-orange-600 to-red-600 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Heat Your Space Safely?
            </h2>
            <p className="text-xl text-orange-100">
              Join thousands of satisfied customers who trust SafeHeat™ for reliable, 
              safe propane heating.
            </p>
            <div className="pt-4">
              <Link href="/product/safeheat-propane-heater">
                <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
                  Shop Now - ${product.price.toFixed(2)}
                  <Icon name="chevron-right" size={20} className="ml-2" />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-orange-100 pt-4">
              ✓ Free U.S. Shipping • ✓ 2-Year Warranty • ✓ 30-Day Returns
          </p>
        </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <Container size="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
        </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              {
                q: "Is it really safe to use indoors?",
                a: "Yes! SafeHeat™ is CSA certified for indoor use and includes an oxygen depletion sensor that automatically shuts off the heater if oxygen levels drop. However, always ensure proper ventilation."
              },
              {
                q: "What size propane tank do I need?",
                a: "SafeHeat™ works with standard propane tanks. We recommend a 20 lb tank for optimal performance and longer run times."
              },
              {
                q: "How large of a space can it heat?",
                a: "With 9,000-18,000 BTU output, SafeHeat™ can effectively heat spaces up to 500 sq ft, depending on insulation and ambient temperature."
              },
              {
                q: "What's included in the warranty?",
                a: "SafeHeat™ comes with a 2-year manufacturer warranty covering defects in materials and workmanship. Extended warranties are available at checkout."
              },
              {
                q: "How long does shipping take?",
                a: "We ship from our U.S. warehouse and most orders arrive in 2-5 business days via ground shipping. Expedited options available at checkout."
              }
            ].map((faq, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.a}
                  </p>
                </CardContent>
              </Card>
            ))}
    </div>
        </Container>
      </section>
    </>
  );
}
