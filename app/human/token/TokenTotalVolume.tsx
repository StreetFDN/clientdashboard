import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BACKEND_URL } from "@/lib/constants";
import React, { useEffect, useState } from "react";

type TokenVolumeTotalObject = {
  period: string;
  total_volume: number;
};

type Period = "7d" | "30d" | "1y";
const PeriodValue = ["7d", "30d", "1y"];

export default function TokenVolumeTotalComponent({
  token,
}: {
  token: string;
}) {
  const [tokenVolumeTotal, setTokenVolumeTotal] =
    useState<TokenVolumeTotalObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("7d");

  useEffect(() => {
    const fetchVolume = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getTokenVolumeTotal(token, period);
        setTokenVolumeTotal(response);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch token volume",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVolume();
  }, [token, period]);

  if (!token) return <></>;
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-pulse">Loading token volume...</div>
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

  if (!tokenVolumeTotal) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-600">No volume data available</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="space-y-2">
        <div>
          <p className="text-sm text-blue-800">
            Total Volume ({tokenVolumeTotal.period})
          </p>
          <ToggleGroup
            type="single"
            defaultValue={period}
            onValueChange={(value: Period) => setPeriod(value)}
          >
            {PeriodValue.map((data) => (
              <ToggleGroupItem key={data} value={data} aria-label={data}>
                {data}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <p className="text-2xl font-bold text-blue-800">
            ${tokenVolumeTotal.total_volume.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

const getTokenVolumeTotal = async (
  tokenAddress: string,
  period: Period,
): Promise<TokenVolumeTotalObject> => {
  const fetchResponse = await fetch(
    `${BACKEND_URL}/token/${tokenAddress}/volume?period=${period}`,
  );

  if (!fetchResponse.ok) {
    throw new Error("Failed to fetch volume");
  }
  const response = (await fetchResponse.json()) as {
    data: TokenVolumeTotalObject;
  };
  return response.data;
};
