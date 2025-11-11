import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Productos from "../pages/Products";
import Pedidos from "../pages/Orders";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/products" replace />,
      },
      {
        path: "products",
        element: <Productos />,
      },
      {
        path: "orders",
        element: <Pedidos />,
      },
    ],
  },
]);
