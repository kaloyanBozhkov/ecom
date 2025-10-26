import { prisma } from "@/server/db";

type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";

export const updateOrderStatus = async ({
  checkoutSessionId,
  status,
  trackingNumber,
}: {
  checkoutSessionId: string;
  status: OrderStatus;
  trackingNumber?: string;
}) => {
  const updateData: {
    status: OrderStatus;
    shipped_at?: Date;
    tracking_number?: string;
  } = {
    status,
  };

  // If marking as shipped, set shipped_at timestamp
  if (status === "SHIPPED") {
    updateData.shipped_at = new Date();
    if (trackingNumber) {
      updateData.tracking_number = trackingNumber;
    }
  }

  const order = await prisma.order.update({
    where: { checkout_session_id: checkoutSessionId },
    data: updateData,
  });

  return order;
};

