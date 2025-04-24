import { Router } from "express";
import { productsRouter } from "./products/routes";
import { adminRouter } from "./admin/routes";

export const router = Router();

router.use("/products", productsRouter);
router.use("/admin", adminRouter);
