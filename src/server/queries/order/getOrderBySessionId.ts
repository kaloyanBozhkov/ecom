import { prisma } from "@/server/db";

export const getOrderBySessionId = async (checkoutSessionId: string) => {
  const order = await prisma.order.findUnique({
    where: { checkout_session_id: checkoutSessionId },
    include: {
      user: true,
    },
  });

  return order;
};

