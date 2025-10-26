import { type Stripe } from "@stripe/stripe-js";
import getStripe from "./getStripe";
import { type CartCheckoutPayloadBody } from "@/pages/api/stripe/checkout_sessions";

export type Currency = "USD";

export async function fetchPostJSON<T>(
  url: string,
  data = {},
  headers: NonNullable<Parameters<typeof fetch>["1"]>["headers"] = undefined,
): Promise<T> {
  try {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
        ...headers,
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *client
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const txt = await response.text();
      throw new Error(txt || "Failed to fetch data");
    }

    const resp = (await response.json()) as T;
    return resp;
  } catch (err) {
    console.error("fetchPostJSON:", err);
    if (err instanceof Error) throw new Error(err.message);
    throw err;
  }
}

/** Cart checkout */
export const cartCheckout = async ({
  total,
  currency,
  onCancelRedirectTo,
  config,
}: {
  total: number;
  /* provide relative since BE adds https://domain.com/ */
  onCancelRedirectTo?: string;
  currency: Currency;
  config: Record<string, string | number>;
}) => {
  const response = await fetchPostJSON<{ sessionId: string; url: string }>(
    "/api/stripe/checkout_sessions",
    {
      amount: total,
      currency,
      onCancelRedirectTo,
      config,
    } as CartCheckoutPayloadBody,
  );

  // New approach: redirect to session URL directly
  if (response.url) {
    window.location.href = response.url;
  } else {
    throw Error("No checkout URL returned from server");
  }
};

