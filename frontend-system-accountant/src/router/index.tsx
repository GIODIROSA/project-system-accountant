import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Productos from "../pages/Products";
import Login from "../pages/Login";
import Pedidos from "../pages/Orders";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Productos />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "orders",
        element: <Pedidos />,
      },
    ],
  },
]);
