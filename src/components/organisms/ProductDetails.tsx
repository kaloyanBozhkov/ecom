'use client';

import React, { useState } from 'react';
import { Container, Button, Badge, Price, Card, CardContent } from '@/components/atoms';
import { QuantitySelector, SpecificationList } from '@/components/molecules';
import { Icon } from '@/components/atoms/Icon';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cartStore';

interface ProductDetailsProps {
  product: Product;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const handleAddToCart = () => {
    addItem(product.id, product.price, quantity);
    setQuantity(1); // Reset quantity after adding
    openCart(); // Open the cart drawer
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-linear-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <Icon name="flame" size={200} className="text-orange-500 mx-auto mb-4" />
                <p className="text-gray-500">Main Product Image</p>
              </div>
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:border-2 hover:border-orange-500 transition-all"
                >
                  <Icon name="flame" size={40} className="text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {product.badge && (
              <Badge className="bg-orange-100 text-orange-800 text-sm px-3 py-1">
                {product.badge}
              </Badge>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            <p className="text-xl text-orange-600 font-semibold">
              {product.tagline}
            </p>

            {/* Price */}
            <div className="flex items-center gap-4 py-4 border-y border-gray-200">
              <Price
                amount={product.price}
                originalAmount={product.originalPrice}
                size="xl"
              />
              {product.originalPrice && (
                <Badge className="bg-red-100 text-red-700">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </Badge>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium">
                {product.inStock ? 'In Stock - Ships in 2-5 Days' : 'Out of Stock'}
              </span>
            </div>

            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900">Quantity</label>
              <QuantitySelector
                quantity={quantity}
                onIncrement={() => setQuantity(quantity + 1)}
                onDecrement={() => setQuantity(quantity - 1)}
              />
            </div>

            {/* Add to Cart Button */}
            <Button
              size="lg"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <Icon name="shopping-cart" size={20} className="mr-2" />
              Add to Cart - ${(product.price * quantity).toFixed(2)}
            </Button>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="flex items-center gap-2">
                <Icon name="truck" className="text-orange-600" size={20} />
                <span className="text-sm text-gray-700">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="shield-check" className="text-orange-600" size={20} />
                <span className="text-sm text-gray-700">2-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="check-circle" className="text-orange-600" size={20} />
                <span className="text-sm text-gray-700">CSA Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="star" className="text-orange-600" size={20} />
                <span className="text-sm text-gray-700">4.8/5 Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <Card className="mt-12">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Technical Specifications
            </h3>
            <SpecificationList specifications={product.specifications} />
          </CardContent>
        </Card>
      </Container>
    </section>
  );
};

