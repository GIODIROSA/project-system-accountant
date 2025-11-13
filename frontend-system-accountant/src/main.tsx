import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

const bgElement = {
  backgroundColor: "#F4F2EF",
  height: "100vh",
  margin: 0,
  padding: 0, 
}

createRoot(document.getElementById("root")!).render(
  
  <section className="" style={bgElement}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>

  </section>

);

