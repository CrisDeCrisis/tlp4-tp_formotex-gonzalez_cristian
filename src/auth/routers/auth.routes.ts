import { Router } from "express";

const authRouter = Router();

authRouter.post("/login", (req, res) => {
  res.send("Login endpoint");
});

authRouter.post("/register", (req, res) => {
  res.send("Register endpoint");
});

authRouter.post("/auth", (req, res) => {
  res.send("Auth endpoint");
});

authRouter.post("/logout", (req, res) => {
  res.send("Logout endpoint");
});

export default authRouter;
