import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, RefreshCwIcon } from "lucide-react";

interface DollarData {
  moneda: string;
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

const dollarData: DollarData[] = [
  {
    moneda: "USD",
    casa: "cripto",
    nombre: "Cripto",
    compra: 1305.58,
    venta: 1309,
    fechaActualizacion: "2024-08-27T20:58:00.000Z",
  },
  {
    moneda: "USD",
    casa: "blue",
    nombre: "Blue",
    compra: 1320,
    venta: 1340,
    fechaActualizacion: "2024-08-27T20:58:00.000Z",
  },
];

const DollarCard: React.FC<{ data: DollarData }> = ({ data }) => {
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
    <Card className="overflow-hidden transition-all hover:shadow-lg">
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

export default function ModernDollarCards() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dollarData.map((data, index) => (
          <DollarCard key={index} data={data} />
        ))}
      </div>
    </div>
  );
}
