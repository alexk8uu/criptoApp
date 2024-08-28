"use client";

import React, { useEffect, useState } from "react";
import {
  Moon,
  Sun,
  ArrowUpIcon,
  ArrowDownIcon,
  RefreshCwIcon,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetDolarValue, useGetHistoricalDolarValue } from "./utils/hooks";

interface DollarData {
  moneda: string;
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

interface ChartData {
  fecha: string;
  blueDollar?: number;
  cryptoDollar?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
  }>;
  label?: string;
  isDarkMode: boolean;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  isDarkMode,
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`rounded-lg shadow-lg p-4 ${
          isDarkMode ? "bg-white text-black" : "bg-black text-white"
        }`}
      >
        <p className="font-bold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm">
            {entry.name}: ${entry.value.toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DollarCard: React.FC<{
  data: DollarData;
  isDarkMode: boolean;
  isSelected: boolean;
  onClick: () => void;
}> = ({ data, isSelected, onClick }) => {
  const formattedDate = new Date(data.fechaActualizacion).toLocaleString(
    "es-AR",
    {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const spread = (((data.venta - data.compra) / data.compra) * 100).toFixed(2);

  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-lg cursor-pointer ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-primary">
            Dólar {data.nombre}
          </h2>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
            {data.casa.toUpperCase()}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Compra</p>
            <p className="text-xl font-semibold">${data.compra.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Venta</p>
            <p className="text-xl font-semibold">${data.venta.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center">
            <RefreshCwIcon className="w-4 h-4 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">{formattedDate}</span>
          </div>
          <div className="flex items-center">
            {parseFloat(spread) > 0 ? (
              <ArrowUpIcon className="w-4 h-4 mr-1 text-green-500" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 mr-1 text-red-500" />
            )}
            <span
              className={
                parseFloat(spread) > 0 ? "text-green-500" : "text-red-500"
              }
            >
              {spread}% spread
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

type DollarType = "blue" | "cripto" | "both";
type TimeFilter = "all" | "6M" | "1M" | "1W" | "1D";

export default function DollarComparisonDashboard() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [selectedDollar, setSelectedDollar] = useState<DollarType>("both");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const { data: dolarBlue } = useGetDolarValue("blue");
  const { data: dolarCripto } = useGetDolarValue("cripto");
  const { data: historicalBlue } = useGetHistoricalDolarValue("blue");
  const { data: historicalCripto } = useGetHistoricalDolarValue("cripto");
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (!historicalBlue || !historicalCripto) return;

    const mergedData = [...historicalBlue, ...historicalCripto].reduce(
      (acc, curr) => {
        const existingEntry = acc.find(
          (item: any) => item.fecha === curr.fecha
        );
        if (existingEntry) {
          if (curr.casa === "blue") {
            existingEntry.blueDollar = curr.venta;
          } else {
            existingEntry.cryptoDollar = curr.venta;
          }
        } else {
          acc.push({
            fecha: curr.fecha,
            ...(curr.casa === "blue"
              ? { blueDollar: curr.venta }
              : { cryptoDollar: curr.venta }),
          });
        }
        return acc;
      },
      [] as ChartData[]
    );

    const sortedData = mergedData.sort(
      (a: any, b: any) =>
        new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );

    const now = new Date();
    const filteredData = sortedData.filter((item: any) => {
      const itemDate = new Date(item.fecha);
      switch (timeFilter) {
        case "6M":
          return (
            now.getTime() - itemDate.getTime() <= 6 * 30 * 24 * 60 * 60 * 1000
          );
        case "1M":
          return now.getTime() - itemDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
        case "1W":
          return now.getTime() - itemDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
        case "1D":
          return now.getTime() - itemDate.getTime() <= 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });

    setChartData(filteredData);
  }, [historicalBlue, historicalCripto, timeFilter]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`min-h-screen bg-background text-foreground`}>
      <div className="container mx-auto p-4">
        <header className="flex justify-end mb-8">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDarkMode ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {dolarBlue &&
            dolarCripto &&
            [dolarBlue, dolarCripto].map((data, index) => (
              <DollarCard
                key={index}
                data={data}
                isDarkMode={isDarkMode}
                isSelected={
                  selectedDollar === data.casa || selectedDollar === "both"
                }
                onClick={() =>
                  setSelectedDollar((prev) =>
                    prev === data.casa ? "both" : (data.casa as DollarType)
                  )
                }
              />
            ))}
        </div>
        <div className="flex justify-center space-x-2 mb-4">
          <Button
            variant={timeFilter === "all" ? "default" : "outline"}
            onClick={() => setTimeFilter("all")}
          >
            All
          </Button>
          <Button
            variant={timeFilter === "6M" ? "default" : "outline"}
            onClick={() => setTimeFilter("6M")}
          >
            6 Months
          </Button>
          <Button
            variant={timeFilter === "1M" ? "default" : "outline"}
            onClick={() => setTimeFilter("1M")}
          >
            1 Month
          </Button>
          <Button
            variant={timeFilter === "1W" ? "default" : "outline"}
            onClick={() => setTimeFilter("1W")}
          >
            1 Week
          </Button>
          <Button
            variant={timeFilter === "1D" ? "default" : "outline"}
            onClick={() => setTimeFilter("1D")}
          >
            Today
          </Button>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey="fecha"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "currentColor" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "currentColor" }}
                    dx={-10}
                  />
                  <Tooltip
                    content={<CustomTooltip isDarkMode={isDarkMode} />}
                  />
                  {(selectedDollar === "both" || selectedDollar === "blue") && (
                    <Area
                      type="monotone"
                      dataKey="blueDollar"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                      name="Dólar Blue"
                    />
                  )}
                  {(selectedDollar === "both" ||
                    selectedDollar === "cripto") && (
                    <Area
                      type="monotone"
                      dataKey="cryptoDollar"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                      name="Dólar Crypto"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
