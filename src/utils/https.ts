import axios from "axios";

const getDolarValue = async (typeDolar: string) => {
  try {
    const response = await axios.get(
      `https://dolarapi.com/v1/dolares/${typeDolar}`
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getHistoricalDolarValue = async (typeDolar: string) => {
  try {
    const response = await axios.get(
      `https://api.argentinadatos.com/v1/cotizaciones/dolares/${typeDolar}`
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default {
  getDolarValue,
  getHistoricalDolarValue,
};
