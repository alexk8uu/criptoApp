import { useQuery } from "@tanstack/react-query";
import https from "./https";

export const useGetDolarValue = (typeDolar: string) => {
  return useQuery({
    queryKey: ["dolar", typeDolar],
    queryFn: () => https.getDolarValue(typeDolar),
  });
};

export const useGetHistoricalDolarValue = (typeDolar: string) => {
  return useQuery({
    queryKey: ["historicalDolar", typeDolar],
    queryFn: () => https.getHistoricalDolarValue(typeDolar),
  });
};
