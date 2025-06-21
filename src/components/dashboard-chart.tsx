
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "./ui/skeleton";

type ChartData = {
  month: string;
  total: number;
};

export function DashboardChart() {
  const t = useTranslations('DashboardPage');
  const [data, setData] = useState<ChartData[]>([]);

  const chartConfig = {
    total: {
      label: t('totalArchive'),
      color: "hsl(var(--chart-1))",
    },
  };

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setData([
        { month: "Jan", total: Math.floor(Math.random() * 200) + 50 },
        { month: "Feb", total: Math.floor(Math.random() * 200) + 50 },
        { month: "Mar", total: Math.floor(Math.random() * 200) + 50 },
        { month: "Apr", total: Math.floor(Math.random() * 200) + 50 },
        { month: "Mei", total: Math.floor(Math.random() * 200) + 50 },
        { month: "Jun", total: Math.floor(Math.random() * 200) + 50 },
        { month: "Jul", total: Math.floor(Math.random() * 200) + 50 },
      ]);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="col-span-1 lg:col-span-1 xl:col-span-1">
      <CardHeader>
        <CardTitle>{t('chartTitle')}</CardTitle>
        <CardDescription>{t('chartDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        {data.length === 0 ? (
          <div className="h-[350px] w-full px-2 space-y-4">
            <Skeleton className="h-1/2 w-full" />
            <Skeleton className="h-1/2 w-full" />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <ResponsiveContainer>
              <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar
                  dataKey="total"
                  fill="var(--color-total)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
