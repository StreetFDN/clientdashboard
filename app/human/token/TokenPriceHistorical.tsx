import { BACKEND_URL } from "@/lib/constants";
import React, { useEffect, useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from "recharts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type TokenPriceHistoricalObject = {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
};

type Period = "24h" | "7d" | "30d" | "1y" | "max";
const PeriodValue = ["24h", "7d", "30d", "1y", "max"];

export default function TokenPriceHistoricalComponent({
  token,
}: {
  token: string;
}) {
  const [tokenPriceHistorical, setTokenPriceHistorical] = useState<
    { price: number; timestamp: number }[] | null
  >(null);

  const [period, setPeriod] = useState<Period>("24h");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getTokenPriceHistorical(token, period);

        setTokenPriceHistorical(
          response.prices.map((price) => {
            return {
              timestamp: price[0],
              price: price[1],
            };
          }),
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch token price",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [token, period]);

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

  if (!tokenPriceHistorical) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-600">No price data available</p>
      </div>
    );
  }

  const chartConfig = {
    price: {
      label: "Price",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Price ({period})</h3>
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
      <ChartContainer
        className="aspect-auto h-[240px] w-[360px] my-4 mx-0"
        config={chartConfig}
      >
        <AreaChart
          accessibilityLayer
          data={tokenPriceHistorical}
          margin={{
            left: -20,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <YAxis type="number" dataKey="price" />
          <XAxis
            display={"none"}
            label={"Time"}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip cursor={false} content={<CustomTooltip />} />
          <Area dataKey="price" type="natural" fillOpacity={0.4} />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}

const getTokenPriceHistorical = async (
  tokenAddress: string,
  period: Period,
): Promise<TokenPriceHistoricalObject> => {
  const fetchResponse = await fetch(
    `${BACKEND_URL}/token/${tokenAddress}/price/history?period=${period}`,
  );

  if (!fetchResponse.ok) {
    throw new Error("Failed to fetch price");
  }
  const response = (await fetchResponse.json()) as {
    data: TokenPriceHistoricalObject;
  };
  return response.data;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const date = new Date(data.timestamp);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-md">
        <p className="text-sm text-gray-600">{formattedDate}</p>
        <p className="text-sm font-semibold text-gray-900">
          Price: ${data.price.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};
