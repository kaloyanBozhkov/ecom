import { type NextApiRequest, type NextApiResponse } from "next";
import { getOrderBySessionId } from "@/server/queries/order/getOrderBySessionId";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const sessionId: string = req.query.sessionId as string;
  
  if (req.method === "GET") {
    try {
      const order = await getOrderBySessionId(sessionId);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.status(200).json(order);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end("Method Not Allowed");
  }
}

