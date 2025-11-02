import { Router } from "express";

const router = Router();

router.get("/users", (req, res) => {
  res.send("Obtenido usuarios");
});

router.post("/users", (req, res) => {
  res.send("enviando usuario");
});

router.patch("/users/:id", (req, res) => {
  req.params = "id";
  res.send("actualizando usuario " + req.params);
});

router.delete("/users/:id", (req, res) => {
  req.params = "id";
  res.send("eliminando usuario " + req.params);
});



export default router;
