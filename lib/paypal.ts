const base = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

const SUPPORTED_CURRENCIES = ["USD", "EUR", "GBP"];

export const paypal = {
  createOrder: async function createOrder(price: number, currency: string = "USD") {
    currency = currency.toUpperCase();

    if (!SUPPORTED_CURRENCIES.includes(currency)) {
      throw new Error(`Unsupported currency: ${currency}. Only USD, EUR, and GBP are allowed.`);
    }

    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: price.toFixed(2),
            },
          },
        ],
      }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      const errorMessage = await response.text();
      throw new Error(`Create order failed: ${errorMessage}`);
    }
  },

  capturePayment: async function capturePayment(orderId: string) {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      const errorMessage = await response.text();
      throw new Error(`Payment capture failed: ${errorMessage}`);
    }
  },
};





// Generate access token
async function generateAccessToken() {
  const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;

  if (!PAYPAL_CLIENT_ID || !PAYPAL_APP_SECRET) {
    throw new Error("PayPal credentials are missing from environment variables.");
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString("base64");

  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  });

  if (response.ok) {
    const jsonData = await response.json();
    return jsonData.access_token;
  } else {
    const errorMessage = await response.text();
    throw new Error(`Token fetch failed: ${errorMessage}`);
  }
}

export { generateAccessToken };
