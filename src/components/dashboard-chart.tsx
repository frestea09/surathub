
"use client";

import { useState, useEffect, useMemo } from "react";
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

type ChartProps = {
  data: any[];
}

export function DashboardChart({ data: allData }: ChartProps) {
  const [isLoading, setIsLoading] = useState(true);

  const chartData = useMemo(() => {
    if (!allData || allData.length === 0) return [];
    
    const monthlyTotals: { [key: string]: number } = {
      "Jan": 0, "Feb": 0, "Mar": 0, "Apr": 0, "Mei": 0, "Jun": 0, "Jul": 0,
      "Agu": 0, "Sep": 0, "Okt": 0, "Nov": 0, "Des": 0,
    };
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

    allData.forEach(item => {
      const date = new Date(item.tanggal);
      const monthIndex = date.getMonth();
      const monthName = monthNames[monthIndex];
      if (monthlyTotals.hasOwnProperty(monthName)) {
        monthlyTotals[monthName]++;
      }
    });

    return monthNames.map(month => ({
      month,
      total: monthlyTotals[month] || 0,
    })).slice(0, 7); // Show first 7 months for consistency
    
  }, [allData]);

  const chartConfig = {
    total: {
      label: "Total Arsip",
      color: "hsl(var(--chart-1))",
    },
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="col-span-1 lg:col-span-1 xl:col-span-1">
      <CardHeader>
        <CardTitle>Statistik Surat</CardTitle>
        <CardDescription>Total surat yang diarsipkan per bulan.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        {isLoading || chartData.length === 0 ? (
          <div className="h-[350px] w-full px-2 space-y-4 flex flex-col justify-center">
            <Skeleton className="h-1/2 w-full" />
            <Skeleton className="h-1/2 w-full" />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
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

    