import { BACKEND_URL } from "@/lib/constants";
import React, { Suspense, useEffect, useState } from "react";

type TokenPriceObject = {
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  last_updated: number;
};

export default function TokenPriceComponent({ token }: { token: string }) {
  const [tokenPrice, setTokenPrice] = useState<TokenPriceObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getTokenPrice(token);
        setTokenPrice(response);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch token price",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [token]);

  if (!token) return <></>;
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-pulse">Loading token price...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!tokenPrice) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-600">No price data available</p>
      </div>
    );
  }
  const priceChangeColor =
    tokenPrice.price_change_percentage_24h >= 0
      ? "text-green-600"
      : "text-red-600";

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="space-y-2">
        <div>
          <p className="text-sm text-blue-800">Current Price</p>
          <p className="text-2xl font-bold text-blue-800">
            ${tokenPrice.current_price.toLocaleString()}
          </p>
        </div>

        <div className="flex gap-4">
          <div>
            <p className="text-sm text-gray-500">24h Change</p>
            <p className={`font-semibold ${priceChangeColor}`}>
              {tokenPrice.price_change_percentage_24h.toFixed(2)}%
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">24h Change ($)</p>
            <p className={`font-semibold ${priceChangeColor}`}>
              ${tokenPrice.price_change_24h.toFixed(2)}
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-400">
          Last updated: {new Date(tokenPrice.last_updated).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

const getTokenPrice = async (
  tokenAddress: string,
): Promise<TokenPriceObject> => {
  const fetchResponse = await fetch(
    `${BACKEND_URL}/token/${tokenAddress}/price`,
  );

  if (!fetchResponse.ok) {
    throw new Error("Failed to fetch price");
  }
  const response = (await fetchResponse.json()) as {
    data: TokenPriceObject;
  };
  return response.data;
};
