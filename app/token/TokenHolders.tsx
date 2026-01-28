import { BACKEND_URL } from "@/lib/constants";
import React, { Suspense, useEffect, useState } from "react";

type TokenHoldersObject = {
  total_holders: number;
  distribution: {
    top_10: string;
    "11_30": string;
    "31_50": string;
    rest: string;
  };
  last_updated: number;
};

export default function TokenHoldersComponent({ token }: { token: string }) {
  const [tokenHolders, setTokenHolders] = useState<TokenHoldersObject | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }
    const fetchHolders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getTokenPrice(token);
        setTokenHolders(response);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch token price",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHolders();
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

  if (!tokenHolders) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-600">No holders data available</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <h3 className="text-lg font-semibold text-gray-900">Token Holders</h3>
          <span className="text-sm text-gray-500">
            Total: {tokenHolders.total_holders.toLocaleString()}
          </span>
        </div>

        {/* Distribution Chart */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Distribution</h4>

          {/* Top 10 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">Top 10 holders</span>
              <span className="text-sm font-medium text-gray-900">
                {tokenHolders.distribution.top_10}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: tokenHolders.distribution.top_10 }}
              />
            </div>
          </div>

          {/* 11-30 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">Holders 11-30</span>
              <span className="text-sm font-medium text-gray-900">
                {tokenHolders.distribution["11_30"]}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: tokenHolders.distribution["11_30"] }}
              />
            </div>
          </div>

          {/* 31-50 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">Holders 31-50</span>
              <span className="text-sm font-medium text-gray-900">
                {tokenHolders.distribution["31_50"]}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-400 h-2 rounded-full"
                style={{ width: tokenHolders.distribution["31_50"] }}
              />
            </div>
          </div>

          {/* Rest */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">Other holders</span>
              <span className="text-sm font-medium text-gray-900">
                {tokenHolders.distribution.rest}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-300 h-2 rounded-full"
                style={{ width: tokenHolders.distribution.rest }}
              />
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Last updated: {new Date(tokenHolders.last_updated).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

const getTokenPrice = async (
  tokenAddress: string,
): Promise<TokenHoldersObject> => {
  const fetchResponse = await fetch(
    `${BACKEND_URL}/token/${tokenAddress}/holders`,
  );

  if (!fetchResponse.ok) {
    throw new Error("Failed to fetch holders");
  }
  const response = (await fetchResponse.json()) as {
    data: TokenHoldersObject;
  };
  return response.data;
};
