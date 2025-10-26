'use client';

import React from 'react';
import { Button } from '@/components/atoms';
import { Icon } from '@/components/atoms/Icon';
import { useCartStore } from '@/store/cartStore';

interface CartItemProps {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export const CartItem: React.FC<CartItemProps> = ({
  productId,
  productName,
  price,
  quantity,
}) => {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex gap-4 py-4 border-b border-gray-200">
      {/* Product Image Placeholder */}
      <div className="shrink-0 w-20 h-20 bg-linear-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
        <Icon name="flame" size={32} className="text-orange-500" />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 mb-1 text-sm truncate">
          {productName}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          ${price.toFixed(2)} each
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(productId, quantity - 1)}
            disabled={quantity <= 1}
          >
            <Icon name="minus" size={14} />
          </Button>
          <span className="w-8 text-center text-sm font-medium">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(productId, quantity + 1)}
          >
            <Icon name="plus" size={14} />
          </Button>
        </div>
      </div>

      {/* Price & Remove */}
      <div className="flex flex-col items-end justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-red-600"
          onClick={() => removeItem(productId)}
        >
          <Icon name="x" size={16} />
        </Button>
        <p className="font-semibold text-gray-900">
          ${(price * quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

