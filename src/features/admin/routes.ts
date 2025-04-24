import { Router } from "express";
import { adminProductsRouter } from "./products/routes";

export const adminRouter = Router();

adminRouter.use("/products", adminProductsRouter);
