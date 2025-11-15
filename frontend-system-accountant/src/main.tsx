import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";

const bgElement = {
  backgroundColor: "#f7edda",
  height: "auto",
  margin: 0,
  padding: 0, 
}

// const bgElementNocturno= {
//   backgroundColor: "#fc5a50",
// }

createRoot(document.getElementById("root")!).render(
  
  <section className="" style={bgElement}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>

  </section>

);

