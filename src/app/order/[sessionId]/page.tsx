'use client';

import { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { Container, Button, Card, CardContent, Badge, Separator } from '@/components/atoms';
import { Icon } from '@/components/atoms/Icon';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

interface OrderPageProps {
  params: Promise<{ sessionId: string }>;
}

interface Order {
  id: string;
  created_at: Date;
  customer_email: string;
  customer_name: string | null;
  customer_phone: string | null;
  billing_address_line1: string | null;
  billing_address_line2: string | null;
  billing_address_city: string | null;
  billing_address_state: string | null;
  billing_address_postal_code: string | null;
  billing_address_country: string | null;
  total_amount: number;
  status: string;
  cart_items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
}

export default function OrderSuccessPage({ params }: OrderPageProps) {
  const { sessionId } = use(params);
  const clearCart = useCartStore((state) => state.clearCart);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear cart when order page loads
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    // Fetch order from database via API
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${sessionId}`);
        if (!response.ok) {
          throw new Error('Order not found');
        }
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [sessionId]);

  if (loading) {
    return (
      <Container className="py-16 md:py-24">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-orange-600"></div>
          <p className="mt-4 text-gray-600">Loading your order details...</p>
        </div>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="py-16 md:py-24">
        <Card className="max-w-2xl mx-auto border-red-200">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Icon name="x" className="text-red-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
            <p className="text-gray-600 mb-6">We couldn't find this order. Please check your email for order details.</p>
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </Container>
    );
  }

  const totalInDollars = order.total_amount / 100;
  const orderNumber = sessionId.slice(-8).toUpperCase();
  const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Container className="py-16 md:py-24">
      <Card className="max-w-3xl mx-auto border-green-200 shadow-lg py-0">
        <CardContent className="p-0">
          {/* Success Header */}
          <div className="bg-linear-to-r from-green-50 to-emerald-50 p-8 text-center border-b border-green-200">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Icon name="check-circle" className="text-green-600" size={48} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for your purchase, {order.customer_name || order.customer_email.split('@')[0]}
            </p>
            <Badge className="mt-4 bg-green-600 text-white">
              Order #{orderNumber}
            </Badge>
          </div>

          <div className="p-8">
            {/* Order Details */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number</span>
                  <span className="font-semibold text-gray-900">#{orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date</span>
                  <span className="font-semibold text-gray-900">{orderDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-semibold text-gray-900">{order.customer_email}</span>
                </div>
                {order.customer_phone && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone</span>
                    <span className="font-semibold text-gray-900">{order.customer_phone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <Badge className="bg-green-600 text-white">{order.status}</Badge>
                </div>
              </div>
            </div>

            {/* Billing Address */}
            {order.billing_address_line1 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Billing Address</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-900">{order.billing_address_line1}</p>
                  {order.billing_address_line2 && (
                    <p className="text-gray-900">{order.billing_address_line2}</p>
                  )}
                  <p className="text-gray-900">
                    {order.billing_address_city}, {order.billing_address_state} {order.billing_address_postal_code}
                  </p>
                  <p className="text-gray-900">{order.billing_address_country}</p>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                {order.cart_items.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="shrink-0 w-20 h-20 bg-linear-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                      <Icon name="flame" size={32} className="text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.productName}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 mb-8">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${totalInDollars.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>${totalInDollars.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Icon name="check-circle" className="text-blue-600" size={20} />
                What's Next?
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <Icon name="check" className="text-green-600 shrink-0 mt-0.5" size={16} />
                  <span>Check your email for order confirmation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="truck" className="text-orange-600 shrink-0 mt-0.5" size={16} />
                  <span>Your order will ship within 2-5 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="check" className="text-green-600 shrink-0 mt-0.5" size={16} />
                  <span>You'll receive a shipping confirmation with tracking number</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="shield-check" className="text-green-600 shrink-0 mt-0.5" size={16} />
                  <span>2-year warranty automatically activated</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/product/safeheat-propane-heater" className="flex-1">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  View Product
                </Button>
              </Link>
            </div>

            {/* Support */}
            <div className="mt-8 text-center text-sm text-gray-600">
              <p>Need help? Contact us at <a href="mailto:support@safeheat.com" className="text-orange-600 hover:underline">support@safeheat.com</a></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}