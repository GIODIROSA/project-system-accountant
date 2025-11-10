import api from "./api";
import type { Producto } from "../interface/interfaceProduct";

export const getProducts = async (): Promise<Producto[]> => {
  try {
    const response = await api.get("/producto");
    //console.log("RESPUESTA DE DATA:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// console.log('productos service cargado...', getProducts); // debbugging line 