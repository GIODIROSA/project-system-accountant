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
        element: <Navigate to="/producto" replace />,
      },
      {
        path: "producto",
        element: <Productos />,
      },
      {
        path: "pedido",
        element: <Pedidos />,
      },
    ],
  },
]);
