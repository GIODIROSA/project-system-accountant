import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import './assets/styles/global.css';

const bgElement = {
  backgroundColor: "#f7edda",
  height: "100vh",
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

