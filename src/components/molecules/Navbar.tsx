'use client';

import React from 'react';
import Link from 'next/link';
import { Logo, Button, Badge } from '@/components/atoms';
import { Icon } from '@/components/atoms/Icon';
import { useCartStore } from '@/store/cartStore';

export const Navbar: React.FC = () => {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const toggleCart = useCartStore((state) => state.toggleCart);

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
              Home
            </Link>
            <Link href="/product/safeheat-propane-heater" className="text-gray-700 hover:text-gray-900 font-medium">
              Product
            </Link>
            <Button variant="ghost" size="icon" className="relative" onClick={toggleCart}>
              <Icon name="shopping-cart" size={20} />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-orange-600">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

