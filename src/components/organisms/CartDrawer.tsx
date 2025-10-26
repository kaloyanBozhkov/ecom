'use client';

import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button, Separator } from '@/components/atoms';
import { CartItem } from '@/components/molecules/CartItem';
import { Icon } from '@/components/atoms/Icon';
import { useCartStore } from '@/store/cartStore';
import { cartCheckout } from '@/utils/stripe/checkout.helpers';

export const CartDrawer: React.FC = () => {
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  // Get product details for cart items
  // Since we're in a client component, we need to use the productId from the cart item
  // The product name is already stored in the cart, so we just use it directly
  const cartItemsWithDetails = items.map((item) => {
    return {
      ...item,
      productName: 'SafeHeat™ Propane Garage Heater', // Hardcoded for now since we have 1 product
    };
  });

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent side="right" className="w-[80%] sm:w-[80%] sm:max-w-2xl p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 pt-6 pb-4">
            <SheetTitle className="flex items-center gap-2">
              <Icon name="shopping-cart" size={24} />
              Shopping Cart ({totalItems})
            </SheetTitle>
            <SheetDescription>
              Review your items before checkout
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Icon name="shopping-cart" size={40} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-6">
                  Add some items to get started!
                </p>
                <Button onClick={closeCart}>Continue Shopping</Button>
              </div>
            ) : (
              <div className="space-y-0">
                {cartItemsWithDetails.map((item) => (
                  <CartItem
                    key={item.productId}
                    productId={item.productId}
                    productName={item.productName}
                    price={item.price}
                    quantity={item.quantity}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 pt-6 px-6 pb-6">
              {/* Subtotal */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>

              <Separator className="my-4" />

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  size="lg"
                  onClick={async () => {
                    if (checkoutLoading) return;
                    setCheckoutLoading(true);

                    try {
                      await cartCheckout({
                        total: totalPrice,
                        currency: "USD",
                        config: {
                          cartItems: JSON.stringify(
                            cartItemsWithDetails.map(item => ({
                              productId: item.productId,
                              productName: item.productName,
                              quantity: item.quantity,
                              price: item.price,
                            }))
                          ),
                        },
                        onCancelRedirectTo: "/",
                      });
                    } catch (err) {
                      console.error("Checkout error:", err);
                      alert("Checkout failed. Please try again.");
                    } finally {
                      setCheckoutLoading(false);
                    }
                  }}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </span>
                  ) : (
                    <>
                      Proceed to Checkout
                      <Icon name="chevron-right" size={20} className="ml-2" />
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={closeCart}
                >
                  Continue Shopping
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Icon name="shield-check" className="text-green-600" size={16} />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Icon name="truck" className="text-orange-600" size={16} />
                  <span>Free Shipping</span>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

