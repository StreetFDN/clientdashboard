import { BACKEND_URL } from "@/lib/constants";
import React, { useEffect, useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from "recharts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type TokenHoldersHistoricalObject = {
  holders: [string, number][];
};

type Period = "7d" | "30d" | "max";
const PeriodValue = ["7d", "30d", "max"];

export default function TokenHoldersHistoricalComponent({
  token,
}: {
  token: string;
}) {
  const [tokenHoldersHistorical, setTokenHoldersHistorical] = useState<
    { holders: number; timestamp: string }[] | null
  >(null);

  const [period, setPeriod] = useState<Period>("7d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHolders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getTokenHoldersHistorical(token, period);

        setTokenHoldersHistorical(
          response.holders.map((holders) => {
            return {
              timestamp: holders[0],
              holders: holders[1],
            };
          }),
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch token holders",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHolders();
  }, [token, period]);

  if (!token) return <></>;
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-pulse">Loading token holders...</div>
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

  if (!tokenHoldersHistorical) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-600">No holders data available</p>
      </div>
    );
  }

  const chartConfig = {
    holders: {
      label: "Holders",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">
        Holders ({period})
      </h3>
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
          data={tokenHoldersHistorical}
          margin={{
            left: -20,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <YAxis type="number" dataKey="holders" />
          <XAxis
            display={"none"}
            label={"Time"}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip cursor={false} content={<CustomTooltip />} />
          <Area dataKey="holders" type="natural" fillOpacity={0.4} />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}

const getTokenHoldersHistorical = async (
  tokenAddress: string,
  period: Period,
): Promise<TokenHoldersHistoricalObject> => {
  const fetchResponse = await fetch(
    `${BACKEND_URL}/token/${tokenAddress}/holders/history?period=${period}`,
  );

  if (!fetchResponse.ok) {
    throw new Error("Failed to fetch holders");
  }
  const response = (await fetchResponse.json()) as {
    data: TokenHoldersHistoricalObject;
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
          Holders: {data.holders}
        </p>
      </div>
    );
  }
  return null;
};
